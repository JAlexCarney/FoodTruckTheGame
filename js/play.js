// cook's paws are temporarly going to be globals so they can be seen by the pickupables pre-fab
var leftPaw;
var rightPaw;

var Play = function(game){};
Play.prototype = {

	create: function() {
		// place assets and initialize variables
		
		// add audio
			// ambient
		this.ambientNoise = game.add.audio('ambientNoise');
			//play ambient noise
		this.ambientNoise.play('',0, .3, true);
			//load UIselect noise
		this.selectNoise = game.add.audio('select');
			//load register noise
		this.registerNoise = game.add.audio('register');
			//load chop noise.
		this.chopNoise = game.add.audio('chop');
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";
		
		// load bottom
			// background
		this.add.sprite(0, 512, 'atlas', 'counter');
			
			// cutting board
		this.board = this.add.sprite(256, 512, 'atlas', 'cutting board');
		this.board.rotation = Math.PI / 2;
		
			// Rice pot
		this.ricePot = this.add.sprite(768, 522, 'atlas', 'pot_empty');
		this.ricePot.scale.setTo(0.6);
		game.physics.enable(this.ricePot, Phaser.Physics.ARCADE);
			
			// create player 2's paws
				// left paw
		leftPaw = new Paw(game, true, 20,800);
		game.add.existing(leftPaw);
				// right Paw
		rightPaw = new Paw(game, false, 720,800);
		game.add.existing(rightPaw);
			
			// seaweed
		this.seaweed = new Pickupable(game, 'seaweed', 200, 800);
		game.add.existing(this.seaweed);
			
			// salmon
		this.salmon = new Pickupable(game, 'salmon', 400, 700);
		game.add.existing(this.salmon);
		
			// rice
		this.rice = new Pickupable(game, 'rice_raw', 756, 800);
		game.add.existing(this.rice);
		
			// knife
		this.knife = new Pickupable(game, 'knife', 712, 700);
		game.add.existing(this.knife);

		// load top
		this.add.sprite(0, 0, 'atlas', 'top screen');

		var changeCustomer = function(){
			//make sure the customer changes every time.
			do{
				this.customerType = game.rnd.integerInRange(0,6);
			}while(this.customerType == this.customer.type)
			// remove the old customer
			this.customer.kill();
			// create a new customer
			this.customer = new Customer(game, this.customerType);
			game.add.existing(this.customer);
			this.customer.inputEnabled = true;
			this.customer.events.onInputDown.add(changeCustomer, this);
		}
		this.customer = new Customer(game, game.rnd.integerInRange(0,6));
		game.add.existing(this.customer);
		this.customer.inputEnabled = true;
		this.customer.events.onInputDown.add(changeCustomer, this);
		
			// create the speech bubble
		this.txt = this.add.sprite(256, 96, 'atlas', 'TextBox');
		this.txt.scale.setTo(2.5,0.75);
			// font style
		this.orderStyle = { font: 'bold 35px Courier New', fill: '#000000', align: "center",  boundsAlignH: "center", boundsAlignV: "middle"};
			// text inside of speech bubble
		this.order = game.add.text(256, 0, "I'd like to order some food please.", this.orderStyle);
		this.order.setTextBounds(30, 10, 290, 374);
		this.order.wordWrap = true;
		this.order.wordWrapWidth = 290;

			// add the counter
		this.topCounter = this.add.sprite(0, 384, 'atlas', 'topCounter');
		game.physics.enable(this.topCounter);
		this.topCounter.body.setSize(1024, 44, 0, 84);
		this.topCounter.body.immovable = true;
		
			// add the register (currently decorative : P)
		this.add.sprite(600, 75, 'atlas', 'cashRegisterTempDisplay');
		this.register = this.add.sprite(600, 75, 'atlas', 'cashRegister_closed');
		game.physics.enable(this.register);
		this.register.body.immovable = true;

			// add an instance of the money prefab
		this.money = new Money(game, 100, 200);
		game.add.existing(this.money);
		
		// load divider
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider');
		this.physics.arcade.enable(this.divider);
		this.divider.enableBody = true;
		this.divider.body.immovable = true;
	},

	update: function() {

		// collide player two with Divide
		var leftHitDivider = game.physics.arcade.collide(leftPaw, this.divider);
		var rightHitDivider = game.physics.arcade.collide(rightPaw, this.divider);
		
		// collide player with food
			// seaweed
		if(game.physics.arcade.overlap(this.seaweed, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.seaweed;
		}
		if(game.physics.arcade.overlap(this.seaweed, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.seaweed;
		}
			// rice
		if(game.physics.arcade.overlap(this.rice, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.rice;
		}
		if(game.physics.arcade.overlap(this.rice, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.rice;
		}
			// salmon
		if(game.physics.arcade.overlap(this.salmon, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.salmon;
		}
		if(game.physics.arcade.overlap(this.salmon, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.salmon;
		}
		
		// collide player two with knife
		if(game.physics.arcade.overlap(this.knife, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.knife;
		}
		if(game.physics.arcade.overlap(this.knife, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.knife;
		}

		// collide knife with salmon 
		if(!this.salmonIsChopped && (rightPaw.isHolding || leftPaw.isHolding)){
			var chop = game.physics.arcade.overlap(this.salmon, this.knife);
			if(chop && !(this.salmon.isHeldByRight || this.salmon.isHeldByLeft) && (this.knife.isHeldByRight || this.knife.isHeldByLeft)){
				this.salmon.loadTexture('atlas', 'salmon_cut');
				this.salmonIsChopped = true;
				this.chopNoise.play();
			}
		}
		
		// collide rice with rice pot
		if(!this.rice.isHeldByRight && !this.rice.isHeldByLeft){
			if(game.physics.arcade.overlap(this.rice, this.ricePot)){
				this.rice.kill();
				this.ricePot.loadTexture('atlas', 'pot_rice');
			}
		}
		
		// collide money with counter
		game.physics.arcade.collide(this.topCounter, this.money);
		
		// money in register (on hover)
		if(game.physics.arcade.overlap(this.register, this.money)){
			this.register.loadTexture('atlas', 'cashRegister_open');
			if(this.money.beingHeld == false){
				this.money.kill();
				this.registerNoise.play();
			}
		}else{
			this.register.loadTexture('atlas', 'cashRegister_closed');
		}
	}
}
