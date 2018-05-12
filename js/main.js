// create the game object with a...
// resolution (1:2 rectangle)
var game;

window.onload = function(){
	game = new Phaser.Game(1024, 1024, Phaser.AUTO);
	game.state.add('Boot', Boot);
	game.state.add('Menu', Menu);
	game.state.add('Controls', Controls);
	game.state.add('Play', Play);
	game.state.add('Over', Over);
	game.state.add('Credits', Credits);
	game.state.start('Boot');
}

var Boot = function(game){};
Boot.prototype = {

	preload: function() {
		// load assets into cache
			// load texture atlas
		game.load.atlas('atlas', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
			// load menu backdrop
		game.load.image('menuBackdrop', 'assets/img/menuBackdrop.png');
	},

	update: function() {
		// proceed to menu
		game.state.start('Menu');
	}
}

var Over = function(game){};
Over.prototype = {
	
	preload: function() {
		// load assets into cache
	},
	
	create: function() {
		// place assets
	},

	update: function() {
		// run game loop
	}
}