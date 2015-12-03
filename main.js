var game = window.game || {};

game.init = function(){
  this.factory = new Factory(this.clases);
  
  var app = this,
    startButton = this.factory.create('Button',this.conf.buttons.startButton);
    this.nave = app.factory.create('Nave', this.conf.nave, this);
  
    window.addEventListener('load', windowReady);

    function windowReady () {
      app.gameContainer = q('#game-container');
      app.gameContainer.append("<canvas id='game' width='800' height='400'>Tu navegador no soporta canvas</canvas>");
      app.canvas = q('#game');
      app.ctx = app.canvas.getContext('2d');
      app.ctx.shadowColor   = app.conf.shadows.c;
      app.ctx.shadowOffsetX = app.conf.shadows.x;
      app.ctx.shadowOffsetY = app.conf.shadows.y;
      app.ctx.shadowBlur    = app.conf.shadows.b;
      app.nave.y = app.canvas.height - app.conf.nave.height - (app.conf.nave.height / 4);

      app.enemigos = app.crearEnemigos();

      app.libreria.push(startButton);
      app.libreria.push(app.nave);
      app.loop = app.factory.create('FrameLoop', {}, app);
      app.loadMedia();
      app.addListeners();
    }
}

game.start = function(){
  this.estado = 'jugando';
};

game.loadMedia = function(){
  var that = this;
  this.assets.fondo = new Image();
  this.assets.fondo.src = 'space.jpg';
  this.assets.fondo.onload = function(){
    that.intervalo = window.setInterval(function(){
      that.loop.init.apply(that);
    },that.conf.general.vel);
  }
};

game.keydown = function(e){
  game.teclado[e.keyCode] = true;
}

game.keyup = function(e){
  game.teclado[e.keyCode] = false;
}

game.addListeners = function(){
  var that = this;
  that.canvas.on('click mousemove mousedown mouseup', function(e){
    var theEvent,
      libreriaOjb = that.libreria.filter(function(item){
      var matchX = e.layerX > item.x &&   e.layerX < (item.x + item.width),
        matchY = e.layerY > item.y &&   e.layerY < (item.y + item.height);
      return  matchY && matchX && typeof item[e.type] === 'function';
    });
    theEvent = e.type

    for (var ndx in that.libreria) {
      if(that.libreria[ndx].defaultState) {
        that.libreria[ndx].defaultState()
      };
      try{
        if(libreriaOjb[ndx][theEvent]){
          libreriaOjb[ndx][theEvent]();
        }

      }catch(err){}
    };
  });
  q(document).on('keydown', this.keydown);
  q(document).on('keyup', this.keyup);
  q('#game').on('touchstart', function(e){
    that.nave.fire.apply(that);
  });
  if(window.hasOwnProperty("orientation")){
    this.addTouchAndMove(that);
  }
};

game.addTouchAndMove = function(scope){
  q(window).on('devicemotion', function(e){
    var orientation = (window.orientation > 0)? 1: -1,
      rot = Math.floor(e.accelerationIncludingGravity.y),
      pos = rot * orientation;
    if(pos < 0){
      scope.nave.moverIzquierda.apply(scope);
    }else if(rot > 0){
      scope.nave.moverDerecha.apply(scope);
    }
  })
}

game.tecladoListener = function(){
  var nave = this.libreria[this.libreria.indexOf(this.nave)];
  if(this.teclado[37]){//left
    nave.moverIzquierda(this);
  }
  if(this.teclado[39]){//right
    nave.moverDerecha(this);
  };
  if(this.teclado[32]){//fire
    if(!this.tecladoFire){
      nave.fire(this);
      this.tecladoFire = true;
    }
  }else{
    this.tecladoFire = false;
  }
}

game.crearEnemigos = function(){
  if(this.estado == 'iniciando'){
    var enemigos = [];
    for (var i = 0; i < this.conf.cantidadEnemigos; i++) {

      var conf = this.conf.enemigo,
        w = conf.width,
        x =  ((w + (w/2)) * i) +  (w/2),
        y = this.conf.enemigosYpos,
        width = conf.width,
        height = conf.height;
      enemigos.push(this.factory.create('Enemigo',{
        conf : conf,
        x : x,
        y : y,
        contador : 0,
        scope : this
      }));
    };
    return enemigos;
  }
};

game.dibujarEnemigos = function(){
  for (var i in this.enemigos) {
    var enemigo = this.enemigos[i];
    enemigo.dibujar(this);
    enemigo.mover();
  };
} 

game.drawBackground = function(){
  this.ctx.drawImage(this.assets.fondo,0,0);
};

game.dibujarDisparos = function(){
  for(var i in this.disparos){
    this.disparos[i].render();
  }
}

game.stopEnemies = function(){
  for (var i in this.enemigos) {
    this.enemigos[i].stop();
  }
}

game.dibujarLibreria = function(){
  for (var i in this.libreria) {
    if(this.libreria[i].render) this.libreria[i].render(this);
  }
};

game.init();


