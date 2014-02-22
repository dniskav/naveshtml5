var game = window.game || {};

game = {
	canvas : {},
	ctx : {},
	assets : {
		fondo : {}
	},
	intervalo : {},
	conf : {
		nave : {
			x : 100,
			y : 0,
			height : 50,
			width : 50,
			vel : 6,
			fill : '#FFFFFF',
			range : 0,
			disparo : {
				vel : 2,
				w : 3,
				h : 10
			},
		},
		enemigo : {
			x : 100,
			y : 0,
			height : 50,
			width : 50,
			vel : 6,
			fill : '#FF0000',
			range : 0,
			disparo : {
				vel : 2,
				w : 3,
				h : 10
			}	
		},
		general : {
			vel : 24
		},
		cantidadEnemigos : 10,
		enemigosYpos : 10
	},
	libreria : [],
	loop : {},
	loopItems : [],
	nave : {},
	clases : {},
	enemigos : [],
	disparos : [],
	teclado : [],
	touch : false,
	tecladoFire : false,
	estado : 'iniciando'
};

game.init = function(){
	var that = this,
		load = window.addEventListener('load', function(){ 
			var startButton = that.factory('Button', {
				x : 350, y : 200, width : 100, height : 50, color : 'white', 
				text : {
					color: 'gray', 
					font: "normal 12px Arial", 
					caption: 'Ipsum..', 
					baseLine : 'middle', 
					textAlign: 'center'
				}, 
				click : {
					callout: that.start, 
					scope: that
				} 
			});
			that.canvas = q('#game');
			that.ctx = that.canvas.getContext('2d');
			that.loadMedia();
			that.addListeners();
			that.conf.nave.y = that.canvas.height - that.conf.nave.height - (that.conf.nave.height / 4);
			that.nave = that.factory('Nave');
			that.nave.init(that.conf.nave);
			that.enemigos = that.crearEnemigos();
			that.libreria.push(startButton);
			that.loop = that.factory('FrameLoop');
		});
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
	that.canvas.on('click', function(e){
		// console.log('coords: ', e.layerX, e.layerY);
		var libreriaOjb = that.libreria.filter(function(item){
			var matchX = e.layerX > item.x &&   e.layerX < (item.x + item.width),
				matchY = e.layerY > item.y &&   e.layerY < (item.y + item.height);
			return  matchY && matchX;
		});
		if(libreriaOjb[0]) libreriaOjb[0].click();
		// console.log(libreriaOjb);
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
	if(this.teclado[37]){//left
		this.nave.moverIzquierda.apply(this);
	}
	if(this.teclado[39]){//right
		this.nave.moverDerecha.apply(this);
	};
	if(this.teclado[32]){//fire
		if(!this.tecladoFire){
			this.nave.fire.apply(this);
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

			var	conf = this.conf.enemigo,
				w = conf.width,
				x =  ((w + (w/2)) * i) +  (w/2),
				y = this.conf.enemigosYpos,
				width = conf.width,
				height = conf.height;
			enemigos.push(this.factory('Enemigo',{
				conf : conf,
				x : x,
				y : y,
				height : height,
				width : width,
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
		this.disparos[i].dibujar();
	}
}

game.stopEnemies = function(){
	for (var i in this.enemigos) {
		this.enemigos[i].stop();
	}
}

game.dibujarLibreria = function(){
	for (var i in this.libreria) {
		this.libreria[i].render(this);
	}
};

game.init();


