var game = window.game || {}


game.clases.nave = function(scope){
	this.nave =  scope.conf.nave;
	this.scope = scope;
	this.loopMethods = [];
};	
game.clases.nave.prototype = {
		dibujar : function(){
			this.scope.ctx.save();
			this.scope.ctx.fillStyle = this.nave.fill;
			this.scope.ctx.fillRect(
					this.nave.x, 
					this.nave.y, 
					this.nave.width, 
					this.nave.height
				);
			this.scope.ctx.restore();
		},
		mover : function(){
			if(this.scope.teclado[37]){
				this.nave.x -= this.nave.vel;
				if(this.nave.x < 0) this.nave.x = 0;
			}
			if(this.scope.teclado[39]){
				var limite = this.scope.canvas.width - this.nave.width;
				this.nave.x += this.nave.vel;

				if(this.nave.x > limite) this.nave.x = limite;
			};
			if(this.scope.teclado[32]){
				if(!this.scope.tecladoFire){
					this.scope.fire();
					this.scope.tecladoFire = true;
				}
			}else{
				this.scope.tecladoFire = false;
			}
		},
		disparar : function(){
			this.disparo = this.scope.factory('disparo', this.scope);
		},
		execLoop : function(method){
			for(var i  in this.loopMethods){
				this[this.loopMethods[i]]();	
			}
		},
		addLoopMethod : function(method){
			var m = method.split(' ');
			for(var j in m){
				this.loopMethods.push(m[j]);
			}
		},
		removeLoopMethod : function(method){
			this.loopMethods = this.loopMethods.filter(function(obj){
				return obj != method;
			});
		},
		removeAllLoops : function(){
			this.loopMethods = [];
		}
}

game.clases.enemigo = function(scope, params){
	this.scope = scope;
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

game.clases.enemigo.prototype = {
	crear : function(){

	},
	dibujar : function(){
		if (this.estado == 'vivo') this.scope.ctx.fillStyle = 'red';
		if (this.estado == 'muerto') this.scope.ctx.fillStyle = 'black';
		this.scope.ctx.save();
		this.scope.ctx.fillRect(
				this.x, 
				this.y, 
				this.width, 
				this.height 
			);
		this.scope.ctx.restore();
	},
	mover : function(){
		if(this.estado == 'vivo'){
			this.contador++;
			this.x += Math.sin(this.contador * Math.PI / 45) * 1;
		}
	},
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
	if(params){
		return new this.clases[type](this, params);
	}else{
		return new this.clases[type](this);
	}
}