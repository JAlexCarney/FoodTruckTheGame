// cook's paws are temporarly going to be globals so they can be seen by the pickupables pre-fab
var leftPaw;
var rightPaw;

var Play = function(game){
	//Dialog System constants that will save my Life
	//credit to Nathan's dialogue example from lecture

	this.DBOX_X = 300; //dialog box x-position
	this.DBOX_Y = 50; //dialog box y-position

	this.TEXT_X = 300;//dialog text x-position
	this.TEXT_Y = -20;//dialog text y-position
	this.TEXT_STYLE = { font: 'bold 20px Courier New', fill: '#000000', align:
	 "center",  boundsAlignH: "center", boundsAlignV: "middle" }; //text style inside of speech bubble
	this.TEXT_MAX_WIDTH = 256; //max width of text within box

	this.NEXT_TEXT = '[...]'; //text to display to prompt user response
	this.NEXT_X = 450; //next prompt x position
	this.NEXT_Y = 310; //next prompt y position

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
	this.customerDonezo = false; //detect if a customer is Donezo

	//other dialog variables to help pace dialog and how i access some conversations
	this.pauseDialog = false; //keeps track if dialog calls are enabled
	this.orderTime = 30000; //order timer temp set to 30 seconds
	this.isRunningLate = false; //keeps track if late(half way passed order) dialogue was accessed
	this.isOrderFinished = false; //keeps track if the player completed order (correctly)

	this.lateTimer = null; //will be used for determine if player is late
	this.finishedTimer = null; //will be used to time player overall

	//x value to place characters offscreen to the right
	  //y values not here to keep consistent with a customer's y value
	this.RIGHT_OFFSCREEN_X = 1400;
};

Play.prototype = {

	// place assets and initialize variables
	create: function() {

			day = game.rnd.integerInRange(1,5);
			//switch statement to load proper dialog JSON files
			switch (day) {
				case 1:
					console.log(day);
					this.dialog = JSON.parse(this.game.cache.getText('dialog'));
					break;
				case 2:
					console.log(day);
					this.dialog = JSON.parse(this.game.cache.getText('dialog2'));
					break;
				case 3:
					console.log(day);
					this.dialog = JSON.parse(this.game.cache.getText('dialog3'));
					break;
				case 4:
					console.log(day);
					this.dialog = JSON.parse(this.game.cache.getText('dialog4'));
					break;
				case 5:
					console.log(day);
					this.dialog = JSON.parse(this.game.cache.getText('dialog5'));
					break;
				default:
					console.log("this shouldn't be happening");
			}
			console.log("loaded JSON");

		// add audio
		this.ambientNoise = game.add.audio('ambientNoise');
		//play ambient noise
		this.ambientNoise.play('',0, .25, true);
		//load UIselect noise
		this.selectNoise = game.add.audio('select');
		//load registar noise
		this.registerNoise = game.add.audio('register');
		
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";

		// load bottom
			// background
		this.add.sprite(0, 512, 'atlas', 'counter');

		//CREATING COOKWARE
		this.spawnCookware();

		//CREATE PAWS
		this.createPaws();

		//create top screen (if not all top screen elements)
		this.createTopScreen();

		// load divider
		this.createDivider();

		console.log("created background");

		//load "chop" noise
		this.chopNoise = game.add.audio('grab');
		
		//let the typing Commence
		this.typeText();
	},

	update: function() {
		console.log(this.customer);
	
		// collide player two with split screen divider
		var leftHitDivider = game.physics.arcade.collide(this.leftPaw, this.divider);
		var rightHitDivider = game.physics.arcade.collide(this.rightPaw, this.divider);

		//handles food and paw collisions
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
				//for now, set an order to be true if you.. put the rice in a pot
				//this.isOrderFinished = true; //keeps track if the player completed order (correctly)
				this.setOrderComplete();
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

		//check for mouse click and if dialog calls are paused to progress through dialog
		if(this.dialogClick & !this.dialogTyping && !this.pauseDialog) {
		this.typeText();
		}
	},

  // credits to Nathan Altice for the basis of this dialogue system code that this was
	//heavily based off of
		//I'm so sorry the code looks so ugly I tried to use loops isntead and having
		//some things in separate functions, but they would not work without sometihng
		//goofy going on like a single letter displaying multiple times.
	typeText: function() {
		console.log("able to reach typeText")

		//lock input while typing
		this.isDialogTyping = true;
		this.dialogBox.inputEnabled = false; //prevent clicks from interrupting dialogue

		//also reset playerResponse to false
		this.dialogClick = false;

		//clear any text that may be leftover from previous calls
		this.dialogText.text = '';
		this.nextText.text = '';

		//check if we're even in a convo
		if(this.dialogConvo >= this.dialog.length) {
			console.log('No more convos');
			//TODO: proceed to night time state if done with all customers

		//case of a customer greeting & ordering
		} else if(this.dialogConvo % 4 === 0) {

			//set current speaker
			this.customer = this.dialog[this.dialogConvo][this.dialogLine]['customer'];

			//if there's going to be a new customer
			if(this.dialog[this.dialogConvo][this.dialogLine]['newCustomer']) {
				console.log(this.lastCustomer);
				//and if last customer exists
				if(this.lastCustomer){
					console.log(this.lastCustomer);
					//this sounds really ominous, but destroy this last customer...
						//edit: idk why this isn't working
					this.lastCustomer.kill();

					//say we're "done" with this customer
					this.customerDonezo = true;

				}
					
				// create this new customer with the customer prefab
					//passes in a string from dialogue to create customer
				 this.customer = new Customer(game, this.dialog[this.dialogConvo][this.dialogLine]['customer']);
				game.add.existing(this.customer);
				
				//set past customer
				this.lastCustomer = this.customer;

				//was supposed to tween them on screen but not working either...
				//this.add.tween(this[this.customer]).to({x: this.ONSCREEN_X}, {y: this.customer.body.y}, Phaser.Easing.Linear.None, true);

					//reset us being "done" with a customer
				this.customerDonezo = false;
			}

		//build dialog
		//proceed until we reach the end of the convo
			//gets dialog text
			this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

			//set up timer to iterate through each letter in dialog
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
				this.dialogBox.inputEnabled = true;

			}, this);

			//if there's a function property in the dialogue, evaluate it
			if(this.dialog[this.dialogConvo][this.dialogLine]['function'] != undefined) {
				eval(this.dialog[this.dialogConvo][this.dialogLine].function);
			}

			//set dialog bounds
			this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;
			this.dialogText.setTextBounds(0, 0, this.TEXT_MAX_WIDTH, 374);
			this.dialogText.wordWrap = true;
			this.dialogText.wordWrapWIdth = this.TEXT_STYLE;

			//increment dialog line
			this.dialogLine += 1;


		//case if dialog is late
	} else if (this.dialogConvo % 4 === 1 && this.isRunningLate) {
		//console.log("Was able to reach the correct late case");

	  //build dialog
		//proceed until we reach the end of the convo
			//gets dialog text
			this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

			//set up timer to iterate through each letter in dialog
				//TODO: have a property in the dialog.json to switch type pacing
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
				this.dialogBox.inputEnabled = true;

			}, this);

			//if there's a function property in the dialogue, evaluate it
			if(this.dialog[this.dialogConvo][this.dialogLine]['function'] != undefined) {
				eval(this.dialog[this.dialogConvo][this.dialogLine].function);
			}

			//set dialog bounds
			this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;
			this.dialogText.setTextBounds(0, 0, this.TEXT_MAX_WIDTH, 374);
			this.dialogText.wordWrap = true;
			this.dialogText.wordWrapWIdth = this.TEXT_STYLE;

			//increment dialog line
			this.dialogLine += 1;

		//case if player gets order correct
	} else if (this.dialogConvo % 4 === 2 && this.isOrderFinished) {

		//building  Dialog
			//gets dialog text
			this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

			//set up timer to iterate through each letter in dialog
				//TODO: have a property in the dialog.json to switch type pacing
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
				this.dialogBox.inputEnabled = true;

			}, this);

			//if there's a function property in the dialogue, evaluate it
			if(this.dialog[this.dialogConvo][this.dialogLine]['function'] != undefined) {
				eval(this.dialog[this.dialogConvo][this.dialogLine].function);
			}

			//set dialog bounds
			this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;
			this.dialogText.setTextBounds(0, 0, this.TEXT_MAX_WIDTH, 374);
			this.dialogText.wordWrap = true;
			this.dialogText.wordWrapWIdth = this.TEXT_STYLE;

			//increment dialog line
			this.dialogLine += 1;

		//case if player doesnt get order in on time
	} else if (this.dialogConvo % 4 === 3 && !this.isOrderFinished && this.isRunningLate) {
		//build dialog
		//proceed until we reach the end of the convo
			//gets dialog text
			this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

			//set up timer to iterate through each letter in dialog
				//TODO: have a property in the dialog.json to switch type pacing
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
				this.dialogBox.inputEnabled = true;

			}, this);

			//if there's a function property in the dialogue, evaluate it
			if(this.dialog[this.dialogConvo][this.dialogLine]['function'] != undefined) {
				eval(this.dialog[this.dialogConvo][this.dialogLine].function);
			}

			//set dialog bounds
			this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;
			this.dialogText.setTextBounds(0, 0, this.TEXT_MAX_WIDTH, 374);
			this.dialogText.wordWrap = true;
			this.dialogText.wordWrapWIdth = this.TEXT_STYLE;

			//increment dialog line
			this.dialogLine += 1;

	 } else {
		//this is a case that shouldn't be reached at ALL but having it as an error catcher
		console.log('Error: This should not be reached in typeText()');
	 }

	 //when we reach end of either the greet or late conversation
	 if( (this.dialogConvo % 4 === 0 && this.dialogLine > this.dialog[this.dialogConvo].length - 1) ||
	 (this.dialogConvo % 4 === 1 && this.dialogLine > this.dialog[this.dialogConvo].length - 1)) {
			//pause dialog
			this.pauseDialog = true;

			//reset lines
			this.dialogLine = 0;
		}

		//when we reach end of the thank conversation
		if( this.dialogConvo % 4 === 2 && this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
			//reset variables
			this.isOrderFinished = false;
			this.isRunningLate = false;
			this.dialogLine = 0;

			//proceed to next Customer
			this.dialogConvo += 2;
			//reset the line
			this.dialogLine = 0;
		}

		//when we reach end of the unsuccessful conversation
		if( this.dialogConvo % 4 === 3 && this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
			//reset variables
			this.isOrderFinished = false;
			this.isRunningLate = false;

			//proceed to nextCustomer
			this.dialogConvo += 1;
			//reset the line
			this.dialogLine = 0;
		}

 }, //end of text typing function derived from nathan

	 //spawns cookware needed for bottom screen player
		spawnCookware: function() {
			// cutting board
		this.board = this.add.sprite(256, 512, 'atlas', 'cutting board');
		//this.board.rotation = Math.PI / 2;

			// Rice pot
		this.ricePot = this.add.sprite(768, 522, 'atlas', 'pot_empty');
		this.ricePot.scale.setTo(0.6);
		game.physics.enable(this.ricePot, Phaser.Physics.ARCADE);

		// knife
		this.knife = new Pickupable(game, 'knife', 712, 700);
		game.add.existing(this.knife);

		console.log("created cookware");

	},
	createPaws: function() {
		// create player 2's paws
			// left paw
		this.leftPaw = new Paw(game, true, 20,800);
		game.add.existing(this.leftPaw);
		leftPaw = this.leftPaw
			// right Paw
		this.rightPaw = new Paw(game, false, 720,800);
		game.add.existing(this.rightPaw);
		rightPaw = this.rightPaw

	},
	//spawns all ingredients for the bottom screen
	spawnAllIngredients: function () {
				// seaweed
			this.seaweed = new Pickupable(game, 'seaweed', 200, 800);
			game.add.existing(this.seaweed);
			game.physics.enable(this.seaweed);
			this.seaweed.enableBody = true;

				// salmon
			this.salmon = new Pickupable(game, 'salmon', 400, 700);
			game.add.existing(this.salmon);
			game.physics.enable(this.salmon);
			this.seaweed.enableBody = true;

				// rice
			this.rice = new Pickupable(game, 'rice_raw', 756, 800);
			game.add.existing(this.rice);
			game.physics.enable(this.rice);
			this.rice.enableBody = true;
	},
	//sets up top screen. put here for code readability
	createTopScreen: function() {
		// load top
		this.add.sprite(0, 0, 'atlas', 'top screen');

		//add dialog box & allow input
		this.dialogBox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'atlas', 'TextBox');
		this.dialogBox.inputEnabled = true;

		//if click on box, set the response to "true"
		this.dialogBox.events.onInputDown.add(this.proceedDialog, this);

    //initialize dialog text
		this.dialogText = this.add.text(this.TEXT_X, this.TEXT_Y, '', this.TEXT_STYLE);
		this.nextText = this.add.text(this.NEXT_X, this.NEXT_Y, '', this.TEXT_STYLE);

		// //create first customer
		 this.customer = new Customer(game, this.dialog[this.dialogConvo][this.dialogLine]['customer']);
		 game.add.existing(this.customer);

			// add the counter
		this.topCounter = this.add.sprite(0, 384, 'atlas', 'topCounter');
		game.physics.enable(this.topCounter);
		this.topCounter.body.setSize(1024, 64, 0, 64);
		this.topCounter.body.immovable = true;

		// add the register (currently decorative : P)
	this.add.sprite(600, 75, 'atlas', 'cashRegisterTempDisplay');
	this.register = this.add.sprite(600, 75, 'atlas', 'cashRegister_closed');
	game.physics.enable(this.register);
	this.register.body.immovable = true;

	},
	//creates our divider to fake our "split screen"
	createDivider: function() {
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider');
		this.physics.arcade.enable(this.divider);
		this.divider.enableBody = true;
		this.divider.body.immovable = true;

	},
	// add an instance of the money prefab
	spawnMoney: function() {
		this.money = new Money(game, 100, 200);
		game.add.existing(this.money);
	},

	//delete remaining ingredients in between customers
	clearIngredients: function() {
		//destroy remaining ingredients that may be leftover
		if(this.seaweed != undefined){
			this.seaweed.kill();
		}

		if(this.salmon != undefined) {
			this.salmon.kill();
		}

		if(this.rice != undefined) {
			this.rice.kill();
		}
	},
	//starts the timer for the player to complete an order
		//time: how much time allotted for an order
		//delay:how much time before starting timers
			//will decrease as days go on
	startOrderTimer: function(time, delay) {

		//auto destroy timers
		this.lateTimer = game.time.create(true);
		this.finishedTimer = game.time.create(true);

		//add events to these timers
		//timer (delay, callback, context)
		this.lateTimer.add((time / 2), this.setLate, this);
		this.finishedTimer.add(time, this.setIncomplete, this);

		//start timers
		this.lateTimer.start(delay);
		this.finishedTimer.start(delay);
	},
  //functon that detects player response if click on dialog box
	proceedDialog: function() {
				this.dialogClick = true; //detect player response
	},

	//functions to check for order status
	//on lateTimer completion, will call this and set the player as "late"
	 setLate: function() {

		 this.dialogConvo += 1;

	  	//set player as running late
	 		this.isRunningLate = true;

	 		//unpause dialog
	 		this.pauseDialog = false;

			//call typeText
			this.typeText();
 },
	//on finishTimer completion, will set order as incomplete
	setIncomplete: function() {
			//set order as incomplete
			this.isOrderFinished = false;

			//unpause dialog
			this.pauseDialog = false;

			//set correct dialogConvo when didn't finish
			this.dialogConvo += 2;

			//call typeText
			this.typeText();

	},
	//in update, check if an order's correct and call this to set the order as true
	setOrderComplete: function() {
			//set the order as finished
			this.isOrderFinished = true;

			//unpause dialog
			this.pauseDialog = false;

			//set the correct dialogConvo when an order is complete
			if(this.isRunningLate) {
				this.dialogConvo += 1;
			} else {
				this.dialogConvo += 2;
			}

			//destroy timers
			this.lateTimer.destroy();
			this.finishedTimer.destroy();

			//call typeText
			this.typeText();
	}
};
