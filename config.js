var game = window.game || {};

game = {
	gameContainer : '',
	canvas : {},
	ctx : {},
	assets : {
		fondo : {}
	},
	intervalo : {},
	conf : {
		buttons : {},
		shadows : {
			c : 'rgba(0,0,0,0.8)',
			x : 0,
			y : 0,
			b : 10
		},
		general : {
			vel : 24
		},
		cantidadEnemigos : 10,
		enemigosYpos : 10
	},
	libreria : [],
	loop : {},
	loopItems : [],
	nave : {},
	clases : {},
	enemigos : [],
	teclado : [],
	touch : false,
	tecladoFire : false,
	estado : 'iniciando'
};