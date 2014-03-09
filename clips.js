//file to place all clips
var game = window.game || {};

//configuation of the ship
game.conf.nave = {
	x : 100,
	y : 0,
	height : 50,
	width : 50,
	vel : 6,
	colors :{
		fill : '#FFFFFF',
		stroke : '#AAAAAA',
		shadows : {
			c : 'rgba(0,0,0,0.8)',
			x : 0,
			y : 0,
			b : 10
		}
	},
	range : 0,
	disparo : {
		vel : 2,
		w : 3,
		h : 10
	},
};

//configuration of the enemies
game.conf.enemigo = {
	x : 100,
	y : 0,
	height : 50,
	width : 50,
	vel : 6,
	colors :{
		fill : '#FF0000',
		stroke : '#AA0000',
		shadows : {
			c : 'rgba(0,0,0,0.8)',
			x : 0,
			y : 0,
			b : 10
		}
	},
	range : 0,
	disparo : {
		vel : 2,
		w : 3,
		h : 10
	}	
}