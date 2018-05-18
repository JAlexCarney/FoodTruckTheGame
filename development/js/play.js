//global timer variable;
var customerTimer;
//global variable: keeps track of how many times to repeat customer switching
var repeatCount = 10;

var Play = function(game){};
Play.prototype = {

	create: function() {
		// place assets and initialize variables

		// add audio
		this.ambientNoise = game.add.audio('ambientNoise');
		//play ambient noise
		this.ambientNoise.play('',0, .25, true);

		//load UIselect noise
		this.selectNoise = game.add.audio('select');

		// enable physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";

		// load bottom
			// background
		this.add.sprite(0, 512, 'atlas', 'counter');
			// cucumber
		this.salmon = game.add.sprite(400, 700, 'atlas', 'salmon_whole');
		game.physics.enable(this.salmon, Phaser.Physics.ARCADE);
		this.salmonIsChopped = false;
		this.salmon.anchor = new PIXI.Point(0.5, 0.5);
		this.salmon.scale.setTo(0.5);
			// knife
		this.knife = game.add.sprite(712, 700, 'atlas', 'knife');
		game.physics.enable(this.knife, Phaser.Physics.ARCADE);
		this.knife.anchor = new PIXI.Point(0.5, 0.5);
		this.knife.scale.setTo(1.5);
		// create player 2's paws
			// left paw
		this.leftPaw = new Paw(game, true, 20,800);
		game.add.existing(this.leftPaw);
			// right Paw
		this.rightPaw = new Paw(game, false, 720,800);
		game.add.existing(this.rightPaw);

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

		//temporarily disabling changing customers with clicking on them
	  //this.customer.events.onInputDown.add(changeCustomer, this);

		//switch customer every 3-ish minutes
		customerTimer.repeat(180000, repeatCount, changeCustomer, this);
		
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
		this.topCounter.body.setSize(1024, 64, 0, 64);
		this.topCounter.body.immovable = true;

			// add the register (currently decorative : P)
		this.add.sprite(600, 75, 'atlas', 'cashRegisterTempDisplay');
		this.add.sprite(600, 75, 'atlas', 'cashRegister');

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
		var leftHitDivider = game.physics.arcade.collide(this.leftPaw, this.divider);
		var rightHitDivider = game.physics.arcade.collide(this.rightPaw, this.divider);

		// collide player two with knife
		this.rightPaw.overlap = game.physics.arcade.overlap(this.knife, this.rightPaw);
		this.leftPaw.overlap = game.physics.arcade.overlap(this.knife, this.leftPaw);

		// collide knife with salmon
		if(!this.salmonIsChopped && (this.rightPaw.isHolding || this.leftPaw.isHolding)){
			var chop = game.physics.arcade.overlap(this.salmon, this.knife);
			if(chop){
				this.salmon.loadTexture('atlas', 'salmon_cut');
				this.salmonIsChopped = true;
			}
		}

		// collide money with counter
		game.physics.arcade.collide(this.topCounter, this.money);

		// knife pick up mechanic
		if(this.rightPaw.isHolding){
			this.knife.x = this.rightPaw.x - 32;
			this.knife.y = this.rightPaw.y - 100;
		}else if(this.leftPaw.isHolding){
			this.knife.x = this.leftPaw.x + 128 - 32;
			this.knife.y = this.leftPaw.y - 100;
		}
	}
}
