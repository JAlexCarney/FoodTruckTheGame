// create the game object with a...
// resolution (1:2 rectangle)
var game = new Phaser.Game(1024, 1024, Phaser.AUTO);

var Boot = function(game){};
Boot.prototype = {

	preload: function() {
		// load assets into cache
			// load texture atlas
		game.load.atlas('atlas', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
	},
	
	create: function() {

	},

	update: function() {
		// proceed to menu
		game.state.start('Menu');
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
		game.state.start('Play');
	}
}

var Play = function(game){};
Play.prototype = {

	preload: function() {
		// load assets into cache
	},
	
	create: function() {
		// place assets and initialize variables
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";
		// add lower background
		// load top
		this.add.sprite(0, 0, 'atlas', 'backdrop');
		this.add.sprite(0, 0, 'atlas', 'lizard');
		this.add.sprite(200, 10, 'atlas', 'chatBubble');
		this.add.sprite(0, 384, 'atlas', 'topCounter');
		this.add.sprite(600, 50, 'atlas', '120 cash register');
		// load bottom
		this.add.sprite(0, 512, 'atlas', 'counter');
		
		// create player 2's paws
			// left paw
		this.leftPaw = this.add.sprite(20, 640, 'atlas', '120 open paw');
		this.leftPaw.anchor.x = 1;
		this.leftPaw.scale.setTo(-1,1);
		this.leftPaw.enableBody = true;
		game.physics.arcade.enable(this.leftPaw);
		this.leftPaw.body.collideWorldBounds = true;
			// right paw
		this.rightPaw = this.add.sprite(748, 640, 'atlas', '120 open paw');
		this.rightPaw.enableBody = true;
		this.physics.arcade.enable(this.rightPaw);
		this.rightPaw.body.collideWorldBounds = true;
		
		// load divider
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider');
		this.divider.enableBody = true;
	},

	update: function() {
		// run game loop
		// collide player two with Divide
		leftHitDivider = game.physics.arcade.collide(this.leftPaw, this.divider);
		rightHitDivider = game.physics.arcade.collide(this.rightPaw, this.divider);
		// movement controls.
			// left paw
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			this.leftPaw.body.velocity.y = -750;
			console.log('moving Up!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
			this.leftPaw.body.velocity.y = 750;
			console.log('moving Down!');
		}else{
			this.leftPaw.body.velocity.y = 0;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.leftPaw.body.velocity.x = -750;
			console.log('moving Left!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			this.leftPaw.body.velocity.x = 750;
			console.log('moving right!');
		}else{
			this.leftPaw.body.velocity.x = 0;
		}
			// right paw
		if(game.input.keyboard.isDown(Phaser.Keyboard.I)){
			this.rightPaw.body.velocity.y = -750;
			console.log('moving Up!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.K)){
			this.rightPaw.body.velocity.y = 750;
			console.log('moving Down!');
		}else{
			this.rightPaw.body.velocity.y = 0;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.J)){
			this.rightPaw.body.velocity.x = -750;
			console.log('moving Left!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.L)){
			this.rightPaw.body.velocity.x = 750;
			console.log('moving right!');
		}else{
			this.rightPaw.body.velocity.x = 0;
		}

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