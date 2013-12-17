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
			height : 20,
			width : 20,
			vel : 6,
			fill : '#FFFFFF',
			range : 0
		},
		disparo : {
			vel : 2
		},
		general : {
			vel : 24
		},
		cantidadEnemigos : 10
	},
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
			that.canvas = q('#game');
			that.ctx = that.canvas.getContext('2d');
			that.loadMedia();
			that.addListeners();
			that.conf.nave.y = that.canvas.height - 25;
			that.nave = that.factory('Nave');
			that.nave.init(that.conf.nave);
			that.enemigos = that.crearEnemigos();
			that.loop = that.factory('FrameLoop');
			that.debuger = q('#debuger');
		});
}



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

game.crearEnemigos = function(){
	if(this.estado == 'iniciando'){
		var enemigos = [];
		for (var i = this.conf.cantidadEnemigos - 1; i >= 0; i--) {
			var x =  5 + (i * 27),
				y = 20,
				width = 20,
				height = 20;
			enemigos.push(this.factory('enemigo',{
				x : x,
				y : y,
				height : height,
				width : width,
				contador : 0
			}));
		};
		this.estado = 'jugando';
		return enemigos;
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
	q(document).on('keydown', this.keydown);
	q(document).on('keyup', this.keyup);
	q('#game').on('touchstart', function(e){
		that.nave.fire.apply(that);
	});
	q(window).on('devicemotion', function(e){
		var rot = Math.floor(e.accelerationIncludingGravity.y);
		that.debuger.html('rotacion: ' + rot + ' naveX:' + that.nave.x);
		console.log(rot);
		if(rot < 0){
			that.nave.moverIzquierda.apply(that);
		}else if(rot > 0){
			that.nave.moverDerecha.apply(that);
		}
	})
};

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

game.init();


