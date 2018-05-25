// cook's paws are temporarly going to be globals so they can be seen by the pickupables pre-fab
var leftPaw;
var rightPaw;

var Play = function(game){};
Play.prototype = {

	create: function() {
		// place assets and initialize variables
		
		// add audio
		this.ambientNoise = game.add.audio('ambientNoise');
		//play ambient noise
		this.ambientNoise.play('',0, .15, true);
		
		//load UIselect noise
		this.selectNoise = game.add.audio('select');
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";
		
		// load bottom
			// background
		this.add.sprite(0, 512, 'atlas', 'counter');
			
			// cutting board
		board = this.add.sprite(256, 512, 'atlas', 'cutting board');
		board.rotation = Math.PI / 2;
		board.scale.setTo(.5,.5);
			
			// create player 2's paws
				// left paw
		leftPaw = new Paw(game, true, 20,800);
		game.add.existing(leftPaw);
				// right Paw
		rightPaw = new Paw(game, false, 720,800);
		game.add.existing(rightPaw);
			
			// salmon
		this.salmon = new Pickupable(game, 'salmon', 400, 700);
		game.add.existing(this.salmon);
		
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
		
			//back to menu 
		var openMenu = function(){
			game.state.start('Menu');
			this.ambientNoise.destroy();
			this.selectNoise.play('', 0, 1, false);
		};
		this.controls = game.add.sprite(750, -10,'atlas', 'button_menu');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(openMenu, this);

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
			}
		}
		
		// collide money with counter
		game.physics.arcade.collide(this.topCounter, this.money);
		
		// money in register (on hover)
		if(game.physics.arcade.overlap(this.register, this.money)){
			this.register.loadTexture('atlas', 'cashRegister_open');
			if(this.money.beingHeld == false){
				this.money.kill();
			}
		}else{
			this.register.loadTexture('atlas', 'cashRegister_closed');
		}
	}
}
