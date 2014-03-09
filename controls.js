//file to place all controls
var game = window.game || {};

 game.conf.buttons.startButton = {
 	x : 350, y : 200, width : 100, height : 50, 
	color : {
		n : 'white',
		h : 'gray',
		p : 'blue'
	}, 
	scope : game,
	text : {
		color : {
			n : 'silver',
			h : 'white',
			p : 'red'
		},  
		font: "normal 12px Arial", 
		caption: 'Ipsum..', 
		baseLine : 'middle', 
		textAlign: 'center'
	}, 
	click : {
		callout: function(el, scope){
			scope.start();
			el.remove();
		}
	} 
};