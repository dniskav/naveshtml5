var game = window.game || {}

game.clases.FrameLoop = function(){};

game.clases.FrameLoop.prototype.init = function(){
	this.actualizaEnemigos();
	this.moverDisparos();
	this.drawBackground();
	this.nave.dibujar.apply(this);
	this.tecladoListener();
	this.dibujarEnemigos();
	this.dibujarDisparos();
}
game.clases.Nave = function(){

};	
game.clases.Nave.prototype = {
	init : function(conf){
		this.x = conf.x;
		this.y = conf.y;
		this.height = conf.height;
		this.width = conf.width;
		this.vel = conf.vel;
		this.fill = conf.fill;
		this.range = conf.range;

		return this;
	},
	dibujar : function(){
		var ship = this.nave;
		this.ctx.save();
		this.ctx.fillStyle = ship.fill;
		this.ctx.fillRect(
				ship.x, 
				ship.y, 
				ship.width, 
				ship.height
			);
		this.ctx.restore();
	},
	moverIzquierda : function(){
		this.nave.x -= this.nave.vel;
		if(this.nave.x < 0) this.nave.x = 0;
	},
	moverDerecha : function(){
		var limite = this.canvas.width - this.nave.width;
		this.nave.x += this.nave.vel;

		if(this.nave.x > limite) this.nave.x = limite;
	},
	fire : function(){
		var nave = this.nave,
			x = nave.x + 9,
			y = nave.y - 10,
			width = 3,
			height = 10;
		this.disparos.push({
			x : x,
			y : y,
			width : width,
			height : height,
			range: {
				x1 : x,
				y2 : y,
				x2 : x + width,
				y2 : y + height 
			}
		});
	}
}

game.clases.enemigo = function(params){
	this.x = params.x;
	this.y = params.y;
	this.range = {
		x1 : params.x1,
		x2 : params.y,
		y1 : params.x,
		y2 : params.y  
	},
	this.height = params.height;
	this.width = params.width;
	this.estado = 'vivo';
	this.contador = params.contador;
};

game.clases.enemigo.prototype = {
	crear : function(){

	},
	dibujar : function(scope){
		if (this.estado == 'vivo') scope.ctx.fillStyle = 'red';
		if (this.estado == 'muerto') scope.ctx.fillStyle = 'black';
		scope.ctx.save();
		scope.ctx.fillRect(
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
		}
	},
}
game.clases.disparo = function(scope, params){
	this.scope = scope;
	this.params = params;
	init = function(){
		console.log('pum!');
	}
	init();
};

game.clases.disparo.prototype = {
	mover : function(){
		this.scope.ctx.save();
		this.scope.ctx.fillStyle = 'white';
		for(var i in this.scope.disparos){
			var disparo = this.scope.disparos[i];
			this.scope.ctx.fillRect(
				disparo.x, 
				disparo.y, 
				disparo.width, 
				disparo.height
			);
		}
		this.scope.ctx.restore();		
	},
	dibujar : function(){}
}

game.clases.frameloop = function(scope){
	this.elements = [];
	this.scope = scope;
}

game.clases.frameloop.prototype = {
	add : function(obj) {

	}
};

game.factory = function(type, params){
	return new this.clases[type](params);
}