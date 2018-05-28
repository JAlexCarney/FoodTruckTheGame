var Play = function(game){
	//Dialog System constants that will save my Life
	//credit to Nathan's dialogue example from lecture

	this.DBOX_X = 256; //dialog box x-position
	this.DBOX_Y = 96; //dialog box y-position

	this.TEXT_X = 150;//dialog text x-position
	this.TEXT_Y = 30;//dialog text y-position
	this.TEXT_STYLE = { font: 'bold 24px Courier New', fill: '#000000', align:
	 "center",  boundsAlignH: "center", boundsAlignV: "middle"
}; //text style inside of speech bubble
	this.TEXT_MAX_WIDTH = 290; //max width of text within box

	this.NEXT_TEXT = '[...]'; //text to display to prompt user response
	this.NEXT_X = 340; //next prompt x position
	this.NEXT_Y = 350; //next prompt y position

	this.LETTER_TIMER = 10; // # of ms each letter takes to "type" onscreen
	this.LETTER_TIMER_SLOW = 50; // a slow one to nerf the speed readers

	//dialog variables specifically
	this.dialogConvo = 0; //current "convo"
	this.dialogLine = 0; //current line
	this.customer = null; //current customer
	this.lastCustomer = null; //last customer
	this.isDialogTyping = false; //lock player input while text is being typed out
	this.dialogText = null; //actual dialog text
	this.nextText = null; //prompt for player response
	this.dialogClick = false; //detect player response
	this.customerDonezo = false;//detect if a customer is Donezo

	//x value to place characters offscreen to the right
	  //y not here to keep consistent with a customer's y value
	this.RIGHT_OFFSCREEN_X = 1400;

	//when we have an order system that detects recipe completion,
	  //will have:
		//timer to time an order
		//variable that keeps track if they get it right (true) or wrong(false)
};
Play.prototype = {

	create: function() {
		// place assets and initialize variables

		//parse dialog from the JSON file
		  //will eventually have switch statement for different files for different days
		this.dialog = JSON.parse(this.game.cache.getText('dialog'));

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

		//add dialog box & allow input
		this.dialogBox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'atlas', 'TextBox');
		this.dialogBox.inputEnabled = true;

		//if click on box, set the response to "true"
		var proceedDialog = function() {
				this.dialogClick = true; //detect player response
		}
		this.dialogBox.events.onInputDown.add(proceedDialog, this);

    //initialize dialog text
		this.dialogText = this.add.text(this.TEXT_X, this.TEXT_Y, '', this.TEXT_STYLE);
		this.nextText = this.add.text(this.NEXT_X, this.NEXT_Y, '', this.TEXT_STYLE);

		//create first customer
		this.customer = new Customer(game, this.dialog[this.dialogConvo][this.dialogLine]['customer']);
		game.add.existing(this.customer);

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

		//load "chop" noise
		this.chopNoise = game.add.audio('grab');

		//let the typing Commence
		this.TypeText();
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
				//play "chop" noise
				this.chopNoise.play('', 0, 1, false);
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

		//check for mouse click to progress through dialog
		if(this.dialogClick && !this.dialogTyping) {
			this.TypeText();
		}
	},

  //again, credits to Nathan Altice for the dialogue system code that this was
	//heavily based off of
	TypeText: function() {

		//lock input while typing
		this.isDialogTyping = true;

		//also reset playerResponse to false
		this.dialogClick = false;

		//clear any text that may be leftover from previous calls
		this.dialogText.text = '';
		this.nextText.text = '';

		//if no more lines left to read in this convo,
		//or if a customer is Donezo
		// jump to next conversation/customer
		if(this.dialogLine > this.dialog[this.dialogConvo].length-1 ||
		  this.customerDonezo) {

			this.dialogLine = 0; //reset lines
			this.dialogConvo++; //but go to next convo
		}

		//check if we're in a convo
		if(this.dialogConvo >= this.dialog.length) {
			console.log('No more convos'); //indicate we are donezo if so

			//also kill any dialog boxes that may be existing
			if(this.dialogBox) {
				this.dialogBox.destroy();
			}

		} else {
			//set current speaker
			this.customer = this.dialog[this.dialogConvo][this.dialogLine]['customer'];

			//if there's going to be a new customer
			if(this.dialog[this.dialogConvo][this.dialogLine]['newCustomer']) {
				//and if last customer exists
				if(this.dialogLastCustomer) {
					//take them off onscreen to the right
					  //keep y at least consistent with the last customer
					this.add.tween(this[this.dialogLastCustomer]).to({x: this.RIGHT_OFFSCREEN_X}, {y: this.this.dialogLastCustomer.y}, Phaser.Easing.Linear.None, true);
					//this sounds really ominous, but kill this customer....
					this.dialogLastCustomer.kill();

					//say we're "done" with this customer
					this.customerDonezo = true;
				}
				// create this new customer
				this.customer = new Customer(game, this.dialog[this.dialogConvo][this.dialogLine]['customer']);
				game.add.existing(this.customer);
			}

			//build dialogue
			this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

			//set up timer to iterate through each letter in dialog
			  //will probably have a property in the dialog.json to switch timers
			let currentChar = 0;
			this.textTimer = this.time.events.repeat(this.LETTER_TIMER, this.dialogLines.length, function() {
				this.dialogText.text += this.dialogLines[currentChar]; //spell out the text
				currentChar++; //increment letter by letter
			}, this);

			//once timer finished typing dialog for a line, show [...] prompt to go on
			this.textTimer.timer.onComplete.addOnce(function() {
				//show prompt for more text
				this.nextText = this.add.text(this.NEXT_X, this.NEXT_Y, this.NEXT_TEXT);
				this.nextText.anchor.setTo(1, 1);

				//enable player input
				this.dialogTyping = false;
			}, this);

			//set dialog bounds
			this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;
			this.dialogText.setTextBounds(30, 10, 290, 374);
			this.dialogText.wordWrap = true;
			this.dialogText.wordWrapWIdth = this.TEXT_STYLE;

			//increment dialog line
			this.dialogLine++;

			//set past speaker
			this.dialogLastCustomer = this.customer;
		}
	} //end of text typing function
};
