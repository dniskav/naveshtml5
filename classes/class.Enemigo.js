var game = window.game || {}

game.clases.Enemigo = function(params){
  this.conf = params.conf;
  this.type = "Enemigo";
  this.x = params.x;
  this.y = params.y;
  this.height = params.conf.height;
  this.width = params.conf.width;
  this.estado = 'vivo';
  this.contador = params.contador;
  this.scope = params.scope;
  this.shootingBot();
};

game.clases.Enemigo.prototype = {
  crear : function(){

  },
  shootingBot : function(){   
    var timer = (Math.random() * 2000) + 600,
      that = this;
      this.shootTimer = setTimeout(function(){
        if(that.scope.estado == 'jugando') {
          that.fire(that.scope);
        }
      if(that.estado == 'vivo'){
        that.shootingBot();
      }
    }, timer);
  },
  dibujar : function(scope){
    var that = this;
    if (this.estado == 'vivo') scope.ctx.fillStyle = this.conf.colors.fill;
    if (this.estado == 'muerto'){
      scope.ctx.fillStyle = 'blue';
      window.setTimeout(function(){
        that.morir(scope);
      }, 12);
    };
    scope.ctx.strokeStyle = this.conf.colors.stroke;
    scope.ctx.save();

    scope.ctx.fillRect(
        this.x, 
        this.y, 
        this.width, 
        this.height 
      );
    scope.ctx.strokeRect(
        this.x, 
        this.y, 
        this.width, 
        this.height 
      );
    scope.ctx.restore();
  },
  mover : function(){
    if(this.estado == 'vivo'){
      this.contador++;
      this.x += Math.sin(this.contador * Math.PI / 45) * 1;
      this.updateBounds();
    }
  },
  updateBounds : function(){
    this.range = {
      x1 : this.x,
      y1 : this.y,
      x2 : this.x + this.width,
      y2 : this.y + this.height
    };
  },
  morir : function(scope){
    var index = scope.enemigos.indexOf(this);
    this.stop();
    delete scope.enemigos[index];
  },
  // fire : function(scope){
  //   var clase = this,
  //     conf = clase.conf.disparo,
  //     x = clase.x + (clase.width / 2),
  //     y = clase.y + clase.height,
  //     width = conf.w,
  //     height = conf.h;
  //   scope.libreria.push(scope.factory.create('Disparo', {
  //       shooter : this.type,
  //       x : x,
  //       y : y,
  //       width : width,
  //       height : height,
  //       vel : clase.conf.disparo.vel,
  //       scope : scope
  //     })
  //   );
  // },
  stop : function(){
    clearTimeout(this.shootTimer);
  }
}
