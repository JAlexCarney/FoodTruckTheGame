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
		//this.add.sprite(0, 0, 'atlas', 'backdrop');
		customer = new Customer(game, game.rnd.integerInRange(0,3));
		game.add.existing(customer);
		this.txt = this.add.sprite(256, 0, 'atlas', 'TextBox');
		this.txt.scale.setTo(2.5,1.5);
		this.add.sprite(0, 384, 'atlas', 'topCounter');
		this.add.sprite(600, 50, 'atlas', 'cashRegisterTempDisplay');
		this.add.sprite(600, 50, 'atlas', 'cashRegister');
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