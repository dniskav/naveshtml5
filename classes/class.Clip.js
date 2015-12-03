'use strict';
var game = window.game || {}

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
