'use strict';
var game = window.game || {}

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
  morir : function(){
    this.estado = 'eliminado';
    this.onStage = false;
  }
}

q.extend(game.clases.Nave, game.clases.Hostile);