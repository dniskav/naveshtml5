'use strict';
var game = window.game || {}

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
