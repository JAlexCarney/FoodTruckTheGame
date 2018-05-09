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
		var changeCustomer = function(){
			//make sure the customer changes every time.
			do{
				this.customerType = game.rnd.integerInRange(0,3);
			}while(this.customerType == this.customer.type)
			// remove the old customer
			this.customer.kill();
			// create a new customer
			this.customer = new Customer(game, this.customerType);
			game.add.existing(this.customer);	
			this.customer.inputEnabled = true;
			this.customer.events.onInputDown.add(changeCustomer, this);
		}
		this.customer = new Customer(game, game.rnd.integerInRange(0,3));
		game.add.existing(this.customer);
		this.customer.inputEnabled = true;
		this.customer.events.onInputDown.add(changeCustomer, this);
		
			// create the speech bubble
		this.txt = this.add.sprite(256, 0, 'atlas', 'TextBox');
		this.txt.scale.setTo(2.5,1.5);
			// font style
		this.orderStyle = { font: 'bold 35px Courier New', fill: '#000000', align: "center",  boundsAlignH: "center", boundsAlignV: "middle"};
			// text inside of speech bubble
		this.order = game.add.text(256, 0, "I'd like to order some food please.", this.orderStyle);
		this.order.setTextBounds(30, 10, 290, 374);
		this.order.wordWrap = true;
		this.order.wordWrapWidth = 290;
		
			// add the counter and register (currently decorative : P)
		this.add.sprite(0, 384, 'atlas', 'topCounter');
		this.add.sprite(600, 50, 'atlas', 'cashRegisterTempDisplay');
		this.add.sprite(600, 50, 'atlas', 'cashRegister');
		
		// load bottom
			// background
		this.add.sprite(0, 512, 'atlas', 'counter');
			// knife
		this.knife = game.add.sprite(512, 700, 'atlas', 'knife');
		game.physics.enable(this.knife, Phaser.Physics.ARCADE);
		this.knife.anchor = new PIXI.Point(0.5, 0.5);
			// create player 2's paws
			// left paw
		this.leftPaw = new Paw(game, true, 20,600);
		game.add.existing(this.leftPaw);
			// right Paw
		this.rightPaw = new Paw(game, false, 720,600);
		game.add.existing(this.rightPaw);
		
		// load divider
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider');
		this.physics.arcade.enable(this.divider);
		this.divider.enableBody = true;
		this.divider.body.immovable = true;
	},

	update: function() {

		// collide player two with Divide
		var leftHitDivider = game.physics.arcade.collide(this.leftPaw, this.divider);
		var rightHitDivider = game.physics.arcade.collide(this.rightPaw, this.divider);
		var pawCollision = game.physics.arcade.collide(this.leftPaw, this.rightPaw);
		this.rightPaw.overlap = game.physics.arcade.overlap(this.knife, this.rightPaw);
		this.leftPaw.overlap = game.physics.arcade.overlap(this.knife, this.leftPaw);

		// knife pick up mechanic
		if(this.rightPaw.isHolding){
			this.knife.x = this.rightPaw.x;
			this.knife.y = this.rightPaw.y;
		}else if(this.leftPaw.isHolding){
			this.knife.x = this.leftPaw.x + 128;
			this.knife.y = this.leftPaw.y;
		}
	}
}