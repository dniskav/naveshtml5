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
	tecladoFire : false,
	estado : 'iniciando'
};

game.init = function(){
	var that = this,
		load = window.addEventListener('load', function(){
			that.canvas = q('#game');
			that.ctx = that.canvas.getContext('2d');
			that.loadMedia();
			that.addKeyListeners();
			that.conf.nave.y = that.canvas.height - 25;
			that.nave = that.factory('Nave');
			that.nave.init(that.conf.nave);
			that.enemigos = that.crearEnemigos();
			that.loop = that.factory('FrameLoop');
			// falta agregar los mettodos al (loopItems)
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
				y = 10,
				width = 20,
				height = 20;
			enemigos.push(this.factory('enemigo',{
				x : x,
				y : y,
				range: {
					x1 : x,
					y1 : y,
					x2 : x + width,
					y2 : y + height 
				},
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

game.addKeyListeners = function(){
	q(document).on('keydown', this.keydown);
	q(document).on('keyup', this.keyup);
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
	};
} 
game.actualizaEnemigos = function(){
	for(var i in this.enemigos){
		var enemigo = this.enemigos[i];
		if(!enemigo) continue;
		enemigo.mover();
	}
}

game.drawBackground = function(){
	this.ctx.drawImage(this.assets.fondo,0,0);
};

game.hit = function(obj){
	if(q.range.comp(this.range, obj.range)){
		return true;
	}else return false
}

game.dibujarDisparos = function(){
	this.ctx.save();
	this.ctx.fillStyle = 'white';
	for(var i in this.disparos){
		var disparo = this.disparos[i];
		this.ctx.fillRect(
			disparo.x, 
			disparo.y, 
			disparo.width, 
			disparo.height
		);
	}
	this.ctx.restore();
}

game.moverDisparos = function(){
	for(var i in this.disparos){
		var disparo = this.disparos[i];
		disparo.y -= this.conf.disparo.vel;
		disparo.range.y1 = disparo.y;
		disparo.range.y2 = disparo.y + 10;
	};
	this.disparos = this.disparos.filter(function(disparo){
		return disparo.y > 0;
	});
}

game.init();


