'use strict';
var game = window.game || {}

game.clases.Hostile = function () {
  this.fire = fire;

  function fire (scope) {
    var shooter = this;
    var  disparo = shooter.disparo;
    var  x = shooter.x + (shooter.width/2);
    var  y = shooter.y - disparo.h;
    var  width = disparo.w;
    var  height = disparo.h;
    if(shooter.estado == 'eliminado' || scope.estado != 'jugando') return;
    scope.libreria.push(scope.factory.create('Disparo', {
        shooter : shooter.type,
        x : x,
        y : y,
        width : width,
        height : height,
        vel : disparo.vel,
        scope : scope
      })
    );   
  }
}
q.extend(game.clases.Hostile, game.clases.Clip);
