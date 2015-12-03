'use strict';
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