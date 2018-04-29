// create the game object with a...
// resolution (1:2 rectangle)
var game = new Phaser.Game(1536, 1024, Phaser.AUTO);

var Boot = function(game){};
Boot.prototype = {

	preload: function() {
		// load assets into cache
	},
	
	create: function() {

	},

	update: function() {
		// proceed to menu
	}
}

var Menu = function(game){};
Menu.prototype = {

	preload: function() {
		// not used, assets loaded in boot state
	},
	
	create: function() {
		// place assets and initialize variables
	},

	update: function() {
		// run game loop
	}
}

var Play = function(game){};
Play.prototype = {

	preload: function() {
		// load assets into cache
	},
	create: function() {
		// place assets and initialize variables
	},

	update: function() {
		// run game loop
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

game.state.add('Boot', Boot);
game.state.add('Menu', Menu);
game.state.add('Play', Play);
game.state.add('Over', Over);
game.state.start('Boot');