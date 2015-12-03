'use strict';
var game = window.game || {}

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
        var hitX = this.range.x1 < this.scope.nave.range.x2 && this.range.x2 > this.scope.nave.range.x1;
        var hitY = this.range.y1 < this.scope.nave.range.y2 && this.range.y2 > this.scope.nave.range.y1;
          console.log('fire', this.range, this.scope.nave.range);
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