var game = window.game || {}

game.clases.FrameLoop = function(){};

game.clases.FrameLoop.prototype.init = function(){
	this.drawBackground();
	this.nave.dibujar.apply(this);
	this.tecladoListener();
	this.dibujarEnemigos();
	this.dibujarDisparos();
	for (var ndx in this.disparos) {
		if (this.disparos.length > 0) {
			try {
				this.disparos[ndx].mover();
			}catch(err){}
		}
		this.disparos = this.disparos.filter(function(disparo){
			return disparo.y > 0;
		});
	}
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
		this.disparos.push(this.factory('disparo', {
				x : x,
				y : y,
				width : width,
				height : height,
				vel : this.conf.disparo.vel,
				scope : this
			})
		);
	}
}
game.clases.disparo = function(params){
	this.scope = params.scope;
	this.x = params.x;
	this.y = params.y;
	this.width = params.width;
	this.height = params.height;
	this.vel = params.vel;
	this.init();
};

game.clases.disparo.prototype = {
	init : function(){
		this.updateBounds();
	},
	mover : function(){
		this.y -= this.vel;
		this.hitTest();
		this.updateBounds();
	},
	dibujar : function(){
		this.scope.ctx.save();
		this.scope.ctx.fillStyle = 'white';
		this.scope.ctx.fillRect(
			this.x, 
			this.y, 
			this.width, 
			this.height
		);
		this.scope.ctx.restore();
	},
	hitTest : function(){
		for (var i in this.scope.enemigos) {
			if (this.scope.enemigos.length > 0) {
				var enemigo = this.scope.enemigos[i].range,
					hitX = this.range.x1 < enemigo.x2 && this.range.x2 > enemigo.x1,
					hitY = this.range.y1 < enemigo.y2 && this.range.y2 > enemigo.y1;

				if(hitX && hitY){
					this.scope.enemigos[i].estado = 'muerto';
					delete this.scope.disparos[this.scope.disparos.indexOf(this)];
				}
			}
		}
	},
	updateBounds : function(){
		this.range = {
			x1 : this.x,
			y1 : this.y,
			x2 : this.x + this.width,
			y2 : this.y + this.height
		};
	}
}

game.clases.enemigo = function(params){
	this.x = params.x;
	this.y = params.y;
	this.height = params.height;
	this.width = params.width;
	this.estado = 'vivo';
	this.contador = params.contador;
	this.crear();
};

game.clases.enemigo.prototype = {
	crear : function(){

	},
	dibujar : function(scope){
		var that = this;
		if (this.estado == 'vivo') scope.ctx.fillStyle = 'red';
		if (this.estado == 'muerto'){
			scope.ctx.fillStyle = 'blue';
			window.setTimeout(function(){
				that.morir(scope);
			}, 12);
		} 
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
		delete scope.enemigos[index];
	}
}

game.factory = function(type, params){
	return new this.clases[type](params);
}