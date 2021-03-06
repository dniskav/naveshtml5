var game = window.game || {}


game.clases.FrameLoop = function(){};

game.clases.FrameLoop.prototype.init = function(){
	var that = this;
	this.drawBackground();
	this.tecladoListener();
	this.dibujarEnemigos();
	this.dibujarDisparos();
	this.dibujarLibreria();
	if(this.estado == 'jugando'){
		var disparos = this.libreria.filter(function(disparo){
			return disparo instanceof game.clases.Disparo;
		});
		for (var ndx in disparos) {
			var disparo = disparos[ndx], 
				disparoNdx = this.libreria.indexOf(disparo);

			try {
				disparo.mover();
			}catch(err){}

			if(disparo.y < 0 || disparo.range.y2 > that.canvas.attr('height')){
				this.libreria = q.arrayRemove(this.libreria, disparoNdx);
			};

		}
	}
}	

game.clases.Clip = function(params){
	var p = params || {}; 

	this.conf = p.conf || {};
	this.color = p.color || {
		n : 'silver',
		h : 'gray',
		p : 'black'
	};
	this.text = p.text || {
		color : {
			n : 'white',
			h : 'black',
			p : 'white'
		},  
		font: "normal 12px Arial", 
		caption: '', 
		baseLine : 'top', 
		textAlign: 'left'
	};
	this.scope = p.scope || this;
	this.x = p.x || 10;
	this.y = p.y || 10;
	this.height = p.height || 30;
	this.width = p.width || 30;
	this.onStage = true;
}

game.clases.Clip.prototype = {
	init : function(){
		this.updateBounds();
		this.color.act = this.color.n || this.color.fill;
		this.text.color.act = this.text.color.n;
		return this;
	},
	updateBounds : function(){
		this.range = {
			x1 : this.x,
			y1 : this.y,
			x2 : this.x + this.width,
			y2 : this.y + this.height
		};
	},
	render : function(scope){
		if(!this.onStage)return;
		scope.ctx.fillStyle = this.color.act;
		this.color.shadows = this.color.shadows || {};
		scope.ctx.save();
		scope.ctx.fillRect(
				this.x, 
				this.y, 
				this.width, 
				this.height 
			);
		scope.ctx.fillStyle = this.text.color.act;
		scope.ctx.textBaseline = this.text.baseLine;
		scope.ctx.font = this.text.font;
		scope.ctx.textAlign = this.text.textAlign;
		scope.ctx.shadowColor   = this.color.shadows.c || scope.ctx.shadowColor || 'rgba(0,0,0,0)';
        scope.ctx.shadowOffsetX = this.color.shadows.x || scope.ctx.shadowOffsetX || 0;
        scope.ctx.shadowOffsetY = this.color.shadows.y || scope.ctx.shadowOffsetY || 0;;
        scope.ctx.shadowBlur    = this.color.shadows.b || scope.ctx.shadowOffsetBlur || 0;;
  		scope.ctx.fillText(this.text.caption, (this.x + this.width/2), (this.y + this.height/2) );
		scope.ctx.restore();
	}
}

game.clases.Nave = function(params){
	this.x = params.x || 10;
	this.y = params.y || 10;
	this.height = params.height || 30;
	this.width = params.width || 30;
	this.scope = params.scope;
	this.color = params.colors;
	this.clickOpt = params.click;
	this.disparo = params.disparo || {};
	this.estado = 'vivo';
	this.vel = params.vel;
	this.type = "Nave";
	this.init();
};

game.clases.Nave.prototype = {
	dibujar : function(scope){
		var that = this,
		ship = scope.nave;
		if(ship.estado == 'eliminado') return;
		if (ship.estado == 'vivo') scope.ctx.fillStyle = ship.conf.colors.fill;
		if (ship.estado == 'muerto'){
			scope.ctx.fillStyle = 'red';
			window.setTimeout(function(){
				scope.nave.morir();
			}, 12);
		};
	},
	moverIzquierda : function(scope){
		if(this.estado == 'eliminado' || scope.estado != 'jugando') return;
		this.x -= this.vel;
		if(this.x < 0) this.x = 0;
		this.updateBounds();
	},
	moverDerecha : function(scope){
		if(this.estado == 'eliminado' || scope.estado != 'jugando') return;
		var limite = scope.canvas.width - this.width;
		this.x += this.vel;

		if(this.x > limite) this.x = limite;
		this.updateBounds();
	},
	fire : function(scope){
		var nave = this,
			disparo = nave.disparo,
			x = nave.x + (nave.width/2),
			y = nave.y - disparo.h,
			width = disparo.w,
			height = disparo.h;
		if(nave.estado == 'eliminado' || scope.estado != 'jugando') return;
		scope.libreria.push(scope.factory.create('Disparo', {
				shooter : nave.type,
				x : x,
				y : y,
				width : width,
				height : height,
				vel : disparo.vel,
				scope : scope
			})
		);
	},
	morir : function(){
		this.estado = 'eliminado';
		this.onStage = false;
	}
}

q.extend(game.clases.Nave, game.clases.Clip);

game.clases.Disparo = function(params){
	this.shooter = params.shooter;
	this.scope = params.scope;
	this.x = params.x;
	this.y = params.y;
	this.width = params.width;
	this.height = params.height;
	this.vel = params.vel;
	this.color = {};
	this.init();
};

game.clases.Disparo.prototype = {
	init : function(){
		switch(this.shooter){
			case "Nave":
				this.color.n = "white";
				break
			case "Enemigo":
				this.color.n = "red"
		}
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
	render : function(){
		this.scope.ctx.save();
		this.scope.ctx.fillStyle = this.color.n;
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
							delete this.scope.libreria[this.scope.libreria.indexOf(this)];
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
	fire : function(scope){
		var clase = this,
			conf = clase.conf.disparo,
			x = clase.x + (clase.width / 2),
			y = clase.y + clase.height,
			width = conf.w,
			height = conf.h;
		scope.libreria.push(scope.factory.create('Disparo', {
				shooter : this.type,
				x : x,
				y : y,
				width : width,
				height : height,
				vel : clase.conf.disparo.vel,
				scope : scope
			})
		);
	},
	stop : function(){
		clearTimeout(this.shootTimer);
	}
}

game.clases.Button = function(params){
	this.x = params.x || 10;
	this.y = params.y || 10;
	this.height = params.height || 30;
	this.width = params.width || 30;
	this.scope = params.scope;
	this.color = params.color || {n : 'silver', h : 'gray', p : 'white'};
	this.text = params.text || {};
	this.clickOpt = params.click;
	this.init();
};

game.clases.Button.prototype = {
	defaultState : function(){
		this.init();
	},
	click : function(){
		this.clickOpt.callout(this, this.scope);
	},
	mousedown : function(){
		this.color.act = this.color.p;
		this.text.color.act = this.text.color.p;
	},
	remove : function(){
		delete this.scope.libreria[this.scope.libreria.indexOf(this)];
	},
	mouseup : function(){
		this.color.act = this.color.n;
		this.text.color.act = this.text.color.n;
	},
	out : function(){
		this.color.act = this.color.n;
		this.text.color.act = this.text.color.n;
	},
	mousemove : function(){
		this.color.act = this.color.h;
		this.text.color.act = this.text.color.h;
	}
};

q.extend(game.clases.Button, game.clases.Clip);
