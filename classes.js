var game = window.game || {}

game.clases.FrameLoop = function(){};

game.clases.FrameLoop.prototype.init = function(){
	this.drawBackground();
	if(this.nave.estado != 'eliminado')this.nave.dibujar.apply(this);
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
			return disparo.y > 0 && disparo.range.y2 < 160;
		});
	}
}
game.clases.Nave = function(){

};	
game.clases.Nave.prototype = {
	init : function(conf){
		this.estado = 'vivo';
		this.x = conf.x;
		this.y = conf.y;
		this.height = conf.height;
		this.width = conf.width;
		this.vel = conf.vel;
		this.fill = conf.fill;
		this.range = conf.range;
		this.type = "Nave";
		this.updateBounds();

		return this;
	},
	dibujar : function(){
		var that = this,
			ship = this.nave;
			if(ship.estado == 'eliminado') return;

		if (ship.estado == 'vivo') this.ctx.fillStyle = ship.fill;
		if (ship.estado == 'muerto'){
			this.ctx.fillStyle = 'red';
			window.setTimeout(function(){
				that.nave.morir();
			}, 12);
		};
		this.ctx.save();
		this.ctx.fillRect(
				ship.x, 
				ship.y, 
				ship.width, 
				ship.height
			);
		this.ctx.restore();
	},
	moverIzquierda : function(){
		if(this.nave.estado == 'eliminado') return;
		this.nave.x -= this.nave.vel;
		if(this.nave.x < 0) this.nave.x = 0;
		this.nave.updateBounds();
	},
	moverDerecha : function(){
		if(this.nave.estado == 'eliminado') return;
		var limite = this.canvas.width - this.nave.width;
		this.nave.x += this.nave.vel;

		if(this.nave.x > limite) this.nave.x = limite;
		this.nave.updateBounds();
	},
	fire : function(){
		var nave = this.nave,
			x = nave.x + 9,
			y = nave.y - 10,
			width = 3,
			height = 10;
		if(nave.estado == 'eliminado') return;
		this.disparos.push(this.factory('Disparo', {
				shooter : nave.type,
				x : x,
				y : y,
				width : width,
				height : height,
				vel : this.conf.disparo.vel,
				scope : this
			})
		);
	},
	updateBounds : function(){
		this.range = {
			x1 : this.x,
			y1 : this.y,
			x2 : this.x + this.width,
			y2 : this.y + this.height
		};
	},
	morir : function(){
		this.estado = 'eliminado';
	},
	animMorir : function(){

	}
}
game.clases.Disparo = function(params){
	this.shooter = params.shooter;
	this.scope = params.scope;
	this.x = params.x;
	this.y = params.y;
	this.width = params.width;
	this.height = params.height;
	this.vel = params.vel;
	this.init();
};

game.clases.Disparo.prototype = {
	init : function(){
		this.updateBounds();
	},
	mover : function(){
		if(this.shooter == "Nave"){
			this.y -= this.vel;
		}else{
			this.y += this.vel;
		}
		this.hitTest();
		this.updateBounds();
	},
	dibujar : function(){
		switch(this.shooter){
			case "Nave":
				var color = "white";
				break
			case "Enemigo":
				var color = "red"
		}
		this.scope.ctx.save();
		this.scope.ctx.fillStyle = color;
		this.scope.ctx.fillRect(
			this.x, 
			this.y, 
			this.width, 
			this.height
		);
		this.scope.ctx.restore();
	},
	hitTest : function(){
		switch(this.shooter){
			case "Nave":
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
			break;
			case "Enemigo":
				var hitX = this.range.x1 < this.scope.nave.range.x2 && this.range.x2 > this.scope.nave.range.x1,
					hitY = this.range.y1 < this.scope.nave.range.y2 && this.range.y2 > this.scope.nave.range.y1;

					if(hitX && hitY){
						if(this.scope.nave.estado == 'eliminado') return;
						this.scope.nave.estado = 'muerto';
						this.scope.stopEnemies();
					};				
			break;
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

game.clases.Enemigo = function(params){
	this.type = "Enemigo";
	this.x = params.x;
	this.y = params.y;
	this.height = params.height;
	this.width = params.width;
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
					that.fire(that.scope);
				if(that.estado == 'vivo'){
					that.shootingBot();
				}
			}, timer);
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
		this.stop();
		delete scope.enemigos[index];
	},
	fire : function(scope){
		var clase = this,
			x = clase.x + 9,
			y = clase.y + clase.height,
			width = 3,
			height = 10;
		scope.disparos.push(scope.factory('Disparo', {
				shooter : this.type,
				x : x,
				y : y,
				width : width,
				height : height,
				vel : scope.conf.disparo.vel,
				scope : scope
			})
		);
	},
	stop : function(){
		clearTimeout(this.shootTimer);
	}
}


game.clases.Button = function(params){
	this.x = params.x || 0;
	this.y = params.y || 0;
	this.width = params.width || 0;
	this.height = params.height || 0;
	this.init();
};

game.clases.Button.prototype = {
	init :function(){
		this.updateBounds();
	},
	click : function(callout, scope){

	},
	press : function(){},
	release : function(){},
	hover : function(){},
	render : function(scope){
		scope.ctx.save();
		scope.ctx.fillRect(
				this.x, 
				this.y, 
				this.width, 
				this.height 
			);
		scope.ctx.restore();
	},
	updateBounds : function(){
		this.range = {
			x1 : this.x,
			y1 : this.y,
			x2 : this.x + this.width,
			y2 : this.y + this.height
		};
	},
};

game.factory = function(type, params){
	return new this.clases[type](params);
}