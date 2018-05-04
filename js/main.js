// create the game object with a...
// resolution (1:2 rectangle)
var game;

window.onload = function(){
	game = new Phaser.Game(1024, 1024, Phaser.AUTO);
	game.state.add('Boot', Boot);
	game.state.add('Menu', Menu);
	game.state.add('Play', Play);
	game.state.add('Over', Over);
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

var Menu = function(game){};
Menu.prototype = {

	create: function() {
		// place assets and initialize variables
		game.add.image(0,0,'menuBackdrop');
	},

	update: function() {
		// run game loop
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('Play');
		}
	}
}

var Play = function(game){};
Play.prototype = {
	
	create: function() {
		// place assets and initialize variables
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";
		// add lower background
		// load top
		this.add.sprite(0, 0, 'atlas', 'backdrop');
		customer = this.add.sprite(0, 0, 'atlas', 'customer');
		customer.scale.setTo(0.8,0.8);
		this.add.sprite(200, 10, 'atlas', 'chatBubble');
		this.add.sprite(0, 384, 'atlas', 'topCounter');
		this.add.sprite(600, 50, 'atlas', '120 cash register');
		// load bottom
		this.add.sprite(0, 512, 'atlas', 'counter');
		
		// create player 2's paws
			// left paw
		this.leftPaw = new Paw(game, true, 20,600);
		game.add.existing(this.leftPaw);
			//right Paw
		this.rightPaw = new Paw(game, false, 720,600);
		game.add.existing(this.rightPaw);
		
		// load divider
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider');
		this.physics.arcade.enable(this.divider);
		this.divider.enableBody = true;
		this.divider.body.immovable = true;
	},

	update: function() {
		
		// run game loop
		// collide player two with Divide
		var leftHitDivider = game.physics.arcade.collide(this.leftPaw, this.divider);
		var rightHitDivider = game.physics.arcade.collide(this.rightPaw, this.divider);
		var pawCollision = game.physics.arcade.collide(this.leftPaw, this.rightPaw);
	
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