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
	this.TEXT_MAX_WIDTH = 230; //max width of text within box
	this.NEXT_TEXT = '[...]'; //text to display to prompt user response
	this.NEXT_X = 450; //next prompt x position
	this.NEXT_Y = 310; //next prompt y position
	this.LETTER_TIMER = 10; // # of ms each letter takes to "type" onscreen
	this.LETTER_TIMER_SLOW = 50; // a slow one to nerf the speed readers

	this.RICE_TIMER = 5000; //amt of time rice needs to cook for now 5 seconds
};

Play.prototype = {
	// place assets and initialize variables
	create: function() {

		// fade in
		this.fade = new Fade(game, true);
		game.add.existing(this.fade);
	
		//dialog variables
		this.dialogConvo = 0; //current "convo"
		this.dialogLine = 0; //current line
		this.customer = null; //current customer
		this.lastCustomer = null; //last customer
		this.isDialogTyping = false; //lock player input while text is being typed out
		this.dialogText = null; //actual dialog text
		this.nextText = null; //prompt for player response
		this.dialogClick = false; //detect player response

		//other dialog variables to help pace dialog and access to certain conversations
		this.pauseDialog = false; //keeps track if dialog calls are enabled
		this.orderTime = 30000; //order timer temp set to 30 seconds
		this.isRunningLate = false; //keeps track if late(half way passed order) dialogue was accessed
		this.isOrderFinished = false; //keeps track if the player completed order

		this.lateTimer = null; //will be used for determine if player is late
		this.finishedTimer = null; //will be used to time player overall

		//variables for cooking
		this.riceIsCooked = false;
		this.salmonIsChopped = false;
		this.orderType = ''; //for checking what type of order is there
		this.riceInBowl = false; //for poke bowl
		this.pokeBowlOrder = false; //check if customer ordered a poke bowl
		this.pokeBowlReady = false; //check if the poke bowl order is ready to plate
		this.pokeBowlPlated = false;//pokebowl is ready for customer
		this.sashimiOrder = false; //check if customer ordered sashimi
		this.sashimiReady = false; //check if sashimi is ready to plate
		this.sashimiPlated = false; //if sashimi is plated, "complete" order
		this.sushiRollOrder = false; //check if sushi roll was ordered
		this.riceOnNori = false; //check if rice is on seaweed
		this.salmonOnNori = false; //check if salmon is on rice & on seaweed
		this.sushiRolled = false; //see if sushi was rolled up
		this.sushiRollReady = false; //check if sushi roll is ready for plating
		this.sushiRollPlated = false; //sushi roll is ready for customer

			//switch statement to load proper dialog JSON files
			switch (day) {
				case 1:
					this.dialog = JSON.parse(this.game.cache.getText('dialog'));
					break;
				case 2:
					this.dialog = JSON.parse(this.game.cache.getText('dialog2'));
					break;
				case 3:
					this.dialog = JSON.parse(this.game.cache.getText('dialog3'));
					break;
				case 4:
					this.dialog = JSON.parse(this.game.cache.getText('dialog4'));
					break;
				case 5:
					this.dialog = JSON.parse(this.game.cache.getText('dialog5'));
					break;
				default:
					console.log("this shouldn't be happening");
			}
		this.ambientNoise = game.add.audio('ambientNoise'); // add audio
		this.ambientNoise.play('',0, .25, true); //play ambient noise
		this.selectNoise = game.add.audio('select'); //load UIselect noise
		this.registerNoise = game.add.audio('register');//load registar noise
		this.chopNoise = game.add.audio('grab'); //load "chop" noise
		this.alarmNoise = game.add.audio('alarm'); //load alarm morning noise

		game.physics.startSystem(Phaser.Physics.ARCADE); 	// enable physics

		game.stage.backgroundColor = "#000000"; // set appropriate background color

		//loading bottom screen for player 2
		this.add.sprite(0, 512, 'atlas', 'counter'); //background
		this.spawnCookware(); //cookware for player 2
		this.createPaws(); //create paws
		//loading rest for player 1
		this.createTopScreen();//create top screen (if not all top screen elements)
		this.createDivider(); // load divider between 2 screens
		this.typeText(); 	//let the typing Commence
		
		if( day != 1 ) {
			//play alarmNoise at the start of state
			this.alarmNoise.play();
		}
	},

	update: function() {
		// collide player two with split screen divider
		var leftHitDivider = game.physics.arcade.collide(this.leftPaw, this.divider);
		var rightHitDivider = game.physics.arcade.collide(this.rightPaw, this.divider);
		this.checkPawCollisions(); 	//handles food and paw collisions
		this.checkKnifeCollisions(); 		//handles knife collissions
		this.checkRicePotCollision(); 	// collide rice with rice pot

		game.physics.arcade.collide(this.topCounter, this.money); // collide money with counter

		// money in register (on hover)
		if(game.physics.arcade.overlap(this.register, this.money)){
			this.register.loadTexture('atlas', 'cashRegister_open');
			if(this.money.beingHeld == false){
				this.money.kill();
				this.registerNoise.play();
				//unpause dialog
				this.pauseDialog = false;
			}
		}else{
			this.register.loadTexture('atlas', 'cashRegister_closed');
		}
		//check on these if the order is not finished
		if(!this.orderIsFinished) {
			this.checkPokeBowl();  //check pokeBowlOrder
			this.checkSashimi();   //check sashimiOrder
			this.checkSushiRoll(); //check sushiRoll order
		}


		//check for mouse click and if dialog calls are paused to progress through dialog
		if(this.dialogClick & !this.dialogTyping && !this.pauseDialog) {
		this.typeText();
		}
	},

 //------------------------ CREATE FUNCTIONS ----------------------------------
 	//functions mostly used for setting up non-food items

 //function that brings other screen things to top for visual polish
 bringEverythingToTop: function() {
	 this.knife.bringToTop();
	 this.topBG.bringToTop();
	 this.dialogBox.bringToTop();
	 this.customer.bringToTop();
	 this.topCounter.bringToTop();
	 this.ipadScreen.bringToTop();
	 this.register.bringToTop();
	 this.dialogText.bringToTop();
	 this.divider.bringToTop();
 },
	// create player 2's paws
	createPaws: function() {
		this.leftPaw = new Paw(game, true, 20,800); // left paw
		game.add.existing(this.leftPaw);
		leftPaw = this.leftPaw;
		this.rightPaw = new Paw(game, false, 720,800); // right Paw
		game.add.existing(this.rightPaw);
		rightPaw = this.rightPaw;
},

	//sets up top screen
	createTopScreen: function() {
		this.topBG = this.add.sprite(0, 0, 'atlas', 'top screen'); // load top background
		//add dialog box & allow input
		this.dialogBox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'atlas', 'TextBox');
		this.dialogBox.inputEnabled = true;
		//if click on box, set the response to "true"
		this.dialogBox.events.onInputDown.add(this.proceedDialog, this);
    //initialize dialog text
		this.dialogText = this.add.text(this.TEXT_X, this.TEXT_Y, '', this.TEXT_STYLE);
		this.nextText = this.add.text(this.NEXT_X, this.NEXT_Y, '', this.TEXT_STYLE);
		// add the counter
		this.topCounter = this.add.sprite(0, 384, 'atlas', 'topCounter');
		game.physics.enable(this.topCounter);
		this.topCounter.body.setSize(1024, 64, 0, 64);
		this.topCounter.body.immovable = true;
		// add the register (currently decorative : P)
	this.ipadScreen = this.add.sprite(600, 75, 'atlas', 'cashRegisterTempDisplay');
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
	// make customer
	customerInit: function(type) {
		switch(type) {
		case 'alpaca':
			this.customer = this.add.sprite(0, 0, 'atlas', 'customer_alpaca');
			break;
		case 'bird':
			this.customer = this.add.sprite(0, 72, 'atlas', 'customer_bird');
			break;
		case 'frog':
			this.customer = this.add.sprite(0, 112, 'atlas', 'customer_frog');
		  break;
		case 'axolotl':
			this.customer = this.add.sprite(0, 132, 'atlas', 'customer_axolotl');
			break;
		case 'bat':
			this.customer = this.add.sprite(0, 42, 'atlas', 'customer_bat');
			break;
		case 'shark':
			this.customer = this.add.sprite(0, -8, 'atlas', 'customer_shark');
			break;
		case 'mouse':
			this.customer = this.add.sprite(0, 162, 'atlas', 'customer_mouse');
			break;
		default:
				console.log("customerInit error: this shouldn't be reached");
		}
  },
	//spawns cookware needed for bottom screen player
	 spawnCookware: function() {
	 this.board = this.add.sprite(256, 512, 'atlas', 'cutting board');// cutting board
	 this.ricePot = this.add.sprite(768, 522, 'atlas', 'pot_empty'); // rice pot
	 this.ricePot.scale.setTo(0.6);
	 game.physics.enable(this.ricePot, Phaser.Physics.ARCADE);
	 this.knife = new Pickupable(game, 'knife', 712, 700); // knife
	 game.add.existing(this.knife);
 },
	// add an instance of the money prefab
	spawnMoney: function() {
		this.money = new Money(game, 100, 200);
		game.add.existing(this.money);
	},

 //------------------------ DIALOG FUNCTIONS ----------------------------------
 	//functions related to the dialog system used in our game.
		//again, a lot of credit to Nathan Altice for the basis of the code

 //functon that detects player response if click on dialog box
 proceedDialog: function() {
			 this.dialogClick = true; //detect player response
 },
 //sets dialog bounds
 setDialogBounds: function() {
	 this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;
	 this.dialogText.setTextBounds(10, 0, this.TEXT_MAX_WIDTH, 374);
	 this.dialogText.wordWrap = true;
	 this.dialogText.wordWrapWidth = this.TEXT_MAX_WIDTH;
 },
 //writes out the text letter by letter
 writeOutText: function() {
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
 },
 // credits to Nathan Altice for the basis of this dialogue system code that this was
 //heavily based off of
	 //I'm so sorry the code looks so ugly I tried to use loops isntead and having
	 //some things in separate functions, but they would not work without sometihng
	 //goofy going on like a single letter displaying multiple times.
 typeText: function() {
	 //generic typetext call
	 console.log(this.isOrderFinished);
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
 } else {
		if(this.dialogConvo % 4 === 0) {
			console.log('Before new customer ' + this.isOrderFinished);
	 //if there's going to be a new customer
	 if(this.dialog[this.dialogConvo][this.dialogLine]['newCustomer']) {
		 //and if last customer exists
		 if(this.customer){
			 //destroy the last customer
			 this.customer.kill();
		 }
		 //create new customer
		 this.customerInit(this.dialog[this.dialogConvo][this.dialogLine]['customer']);
		 this.isOrderFinished = false;
		 console.log('Made new customer');
		 console.log(this.isOrderFinished);
}
	 //build dialog until we reach the end of the convo
		 //get the text from json
		 this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];
		 //iterate through each letter in dialog line
		 this.writeOutText();
		 //if there's a function property in the dialogu that hasn't been evaluated already,
			//evaluate it
			if(this.dialog[this.dialogConvo][this.dialogLine]['function'] != undefined) {
				eval(this.dialog[this.dialogConvo][this.dialogLine].function);
			}

		 this.setDialogBounds(); //set dialog bounds
		 this.dialogLine += 1; //increment dialog line
		 this.lastCustomer = this.customer; 	//set past customer

	 //case if dialog is late
 } else if (this.dialogConvo % 4 === 1 && this.isRunningLate) {
	 //build dialog
	 //proceed until we reach the end of the convo
		 //gets dialog text
		 this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];
		 //iterate through each letter in dialog line
		 this.writeOutText();
		 //set dialog bounds
		 this.setDialogBounds();
		 //increment dialog line
		 this.dialogLine += 1;
		 //set past customer
		 this.lastCustomer = this.customer;
	 //case if player gets order correct
 } else if (this.dialogConvo % 4 === 2 && this.isOrderFinished) {
	 //building  Dialog
		 //gets dialog text
		 this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];
		 //iterate through each letter in dialog line
		 this.writeOutText();
		 //if there's a function property in the dialogu that hasn't been evaluated already,
			//evaluate it
			if(this.dialog[this.dialogConvo][this.dialogLine]['function'] != undefined) {
				eval(this.dialog[this.dialogConvo][this.dialogLine].function);
		}
		 //set dialog bounds
		 this.setDialogBounds();
		 //increment dialog line
		 this.dialogLine += 1;
		 //set past customer
		 this.lastCustomer = this.customer;

	 //case if player doesnt get order in on time
 } else if (this.dialogConvo % 4 === 3 && !this.isOrderFinished && this.isRunningLate) {
	 //build dialog proceed until we reach the end of the convo
		 //gets dialog text
		 this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

		 //iterate through each letter in dialog line
		 this.writeOutText();
		 //if there's a function property in the dialogu that hasn't been evaluated already,
			//evaluate it
			if(this.dialog[this.dialogConvo][this.dialogLine]['function'] != undefined) {
				eval(this.dialog[this.dialogConvo][this.dialogLine].function);
		}
		 //set dialog bounds
		 this.setDialogBounds();
		 //increment dialog line
		 this.dialogLine += 1;
		 //set past customer
		 this.lastCustomer = this.customer;

	} else {
	 //this is a case that shouldn't be reached at ALL but having it as an error catcher
	 console.log('Error: This should not be reached in typeText()');
	}

	//when we reach end of either the greet or late conversation
	if( (this.dialogConvo % 4 === 0 && this.dialogLine > this.dialog[this.dialogConvo].length - 1) ||
	(this.dialogConvo % 4 === 1 && this.dialogLine > this.dialog[this.dialogConvo].length - 1)) {
		 this.pauseDialog = true; 	//pause dialog
		 this.dialogLine = 0; //reset lines
	 }

	 //when we reach end of the thank conversation
	 if( this.dialogConvo % 4 === 2 && this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
		 //reset variables
		 this.isOrderFinished = false;
		 this.isRunningLate = false;
		 this.dialogLine = 0;
		 //pause dialog until player puts money in register
		 this.pauseDialog = true;
		 //proceed to next Customer
		 this.dialogConvo += 2;
		 //reset the line
		 this.dialogLine = 0;
	 }

	 //when we reach end of the unsuccessful order conversation
	 if( this.dialogConvo % 4 === 3 && this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
		 //reset variables
		 this.isOrderFinished = false;
		 this.isRunningLate = false;
		 //proceed to nextCustomer
		 this.dialogConvo += 1;
		 //reset the line
		 this.dialogLine = 0;
	 }
 }
}, //end of text typing function derived from nathan
 //------------------------ CREATE FOOD FUNCTIONS ---------------------------------
 	//spawns all ingredients for the bottom screen
 	spawnAllIngredients: function () {
 		this.spawnBowl();
 		this.spawnPlate();
 		this.spawnSeaweed();
 		this.spawnSalmon();
 		this.spawnRice();
 		this.bringEverythingToTop();
 	},
 	//spawns poke bowl ingredients
 	spawnPokeIngredients: function() {
 		this.spawnBowl();
 		this.spawnRice();
 		this.spawnSalmon();
 		this.bringEverythingToTop();
 	},
 	//spawns sashimi ingredients
 	spawnSashimiIngredients: function() {
 		this.spawnPlate();
 		this.spawnRice();
 		this.spawnSalmon();
 		this.bringEverythingToTop();
 	},
 	//spawns sushi roll ingredients
 	spawnSushiRollIngredients: function() {
 		this.spawnPlate(); 	//plate
 		this.spawnRice(); //rice
 		this.spawnSalmon(); //salmon
 		this.spawnSeaweed(); //seaweed
 		this.bringEverythingToTop();
 	},

		//smaller spawning functions to make bigger recipes slightly more readable
		spawnRice: function() {
			this.rice = new Pickupable(game, 'rice_raw', 700, 900);
			game.add.existing(this.rice);
			game.physics.enable(this.rice);
			this.rice.enableBody = true;
		},
		spawnSalmon: function() {
			this.salmon = new Pickupable(game, 'salmon', 420, 800);
			game.add.existing(this.salmon);
			game.physics.enable(this.salmon);
			this.salmon.enableBody = true;
		},
		spawnSeaweed: function() {
			this.seaweed = new Pickupable(game, 'seaweed', 200, 800);
			game.add.existing(this.seaweed);
			game.physics.enable(this.seaweed);
			this.seaweed.enableBody = true;
		},
		spawnBowl: function() {
			this.bowl = new Pickupable(game, 'bowl', 200, 750);
			game.add.existing(this.bowl);
			game.physics.enable(this.bowl);
			this.bowl.enableBody = true;
		},
		spawnPlate: function() {
			this.plate = new Pickupable(game, 'plate', 550, 850);
			this.plate.scale.setTo(.75, .75);
			game.add.existing(this.plate);
			game.physics.enable(this.plate);
			this.plate.enableBody = false;
		},

		//function that deletes remaining ingredients in between customers
		//also reset some variables to prepare for next customer
		clearIngredients: function() {
			//clear off remaning food assets on screen
			if(this.seaweed != undefined)			{this.seaweed.kill();}
			if(this.salmon != undefined) 			{this.salmon.kill();}
			if(this.rice != undefined) 				{this.rice.kill();}
			if(this.bowl != undefined) 				{this.bowl.kill();}
			if(this.plate != undefined) 			{this.plate.kill();}
			if(this.sashimi != undefined) 		{this.sashimi.kill();}
			if(this.sushiRoll != undefined) 	{this.sushiRoll.kill();}

			//reset most variables
			this.ricePot.loadTexture('atlas', 'pot_empty');	//reset rice pot texture
			this.salmonIsChopped = false;
			this.riceIsCooked = false;
			this.salmonIsChopped = false;
			this.orderType = '';
			this.riceInBowl = false;
			this.pokeBowlOrder = false;
			this.pokeBowlReady = false;
			this.pokeBowlPlated = false;
			this.sashimiOrder = false;
			this.sashimiReady = false;
			this.sashimiPlated = false;
			this.sushiRollOrder = false;
			this.riceOnNori = false;
			this.salmonOnNori = false;
			this.sushiRolled = false;
			this.sushiRollReady = false;
			this.sushiRollPlated = false;
		},
 //------------------------ CHECK ORDER FUNCTIONS -----------------------------
 //TODO: account for combo
		//will probably have special combo cases
	//for now, only checks to see if the pokebowl is the only one ordered
	//check to see if poke bowl (if only ordered) is ready
 	checkPokeBowl: function() {
		//checks to see if a poke bowl was even ordered
		if(!this.orderIsFinished && this.orderType === 'pokeBowl' && this.pokeBowlOrder) {
			console.log('riceIsCooked ' + this.riceIsCooked);
			console.log('rice + bowl overlap' + game.physics.arcade.overlap(this.rice, this.bowl));
			//check if rice is cooked & overlap with the bowl
			if(this.riceIsCooked && game.physics.arcade.overlap(this.rice, this.bowl)){
				console.log('poke bowl overlap worked');
				//kill the rice & set bowl texture
				this.rice.kill();
				this.bowl.loadTexture('atlas','bowl_rice');
				//set riceBowl to true
				this.riceInBowl = true;
			}	//check if salmon is cut && check if ricebowl is a thing && if overlap between
			else if(this.salmonIsChopped && this.riceInBowl && game.physics.arcade.overlap(this.salmon, this.bowl)) {
				this.salmon.kill(); //kill salmon
				this.bowl.loadTexture('atlas','bowl_salmon'); //replace bowl texture
				this.pokeBowlReady = true;
				this.pokeBowlPlated = true;//set as plated & ready
 		  } else if (this.pokeBowlPlated) {
				this.orderIsFinished = true; //set order complete  to prevent dialog errors
				this.setOrderComplete();
			}
		}
	},
	//checks to see if sashimi is ready
		//for now: only accounts for when there's solo sashimi order
	checkSashimi: function() {
		//console.log('checking sashimi');
		if(!this.orderIsFinished && this.orderType === 'sashimi' && this.sashimiOrder){
			//if both rice is cooked & salmon is cut, create sashimi when overlapped
			if(this.riceIsCooked && this.salmonIsChopped && game.physics.arcade.overlap(this.salmon, this.rice)) {
				console.log('sashimi overlap worked');
				this.sashimi = new Pickupable(game, 'sashimi', this.rice.x, this.rice.y);//create sashimi
				game.add.existing(this.sashimi);
				this.rice.kill(); //kill individual assets
				this.salmon.kill();
				this.sashimiReady = true; //ready to be plated
				//check if player puts food on plate
			} else if (this.sashimiReady && game.physics.arcade.overlap(this.sashimi, this.plate)) {
				this.sashimi.kill(); //kill sashimi asset
				this.plate.loadTexture('atlas', 'sashimi ( with plate)')//reload plate texture
				this.sashimiPlated = true; //set as plated
			} else if (this.sashimiPlated) {
				this.orderIsFinished = true; //set order complete to prevent dialog errors
				this.setOrderComplete();
			}
		}
		//console.log('couldnt check sashimi or overlaps did not work');
	},
	//check to see if sushi roll is ready if it was ordered
		//only accounts for when there's solo sushi roll order
		//for now:
				//no rice collision
				//no knife cutting
	checkSushiRoll: function() {

		if(!this.orderIsFinished && this.orderType === 'sushiRollOrder' && this.sushiRollOrder) {
			//check if rice is cooked
			if(this.riceIsCooked && game.physics.arcade.overlap(this.rice, this.seaweed)) {
				console.log('sushi roll not detecting rice & seedweed collision')
				this.rice.kill(); //kill rice
				this.seaweed.loadTexture('atlas','rice_on_seaweed'); //update seaweed
				this.riceOnNori = true; //set that rice is on nori
			} else if (this.riceOnNori && this.salmonIsChopped && game.physics.arcade.overlap(this.seaweed, this.salmon)) {
				console.log('sushi roll: not detecting rice & salmon detection')
				this.salmon.kill(); //kill salmon
				this.seaweed.loadTexture('atlas','sushi roll(unrolled)');//reload seaweed texture
				this.salmonOnNori = true; //set that salmon is on the seaweed
			} else if (this.salmonOnNori && (rightPaw.isHolding && leftPaw.isHolding)) {
				this.seaweed.kill()//kill seaweed
					//for now, say it's cut
				this.sushiRoll = new Pickupable(game, 'sushiRoll', 600, 750);
				game.add.existing(this.sushiRoll);
				this.sushiRollReady = true; //ready for plating,
			} else if (this.sushiRollReady && game.physics.arcade.overlap(this.sushiRoll, this.plate)) {
				this.sushiRoll.kill(); //kill sushi roll
				this.plate.loadTexture('atlas', 'sushiRoll_plate'); //reload plate texture to have sashimi
				this.sushiRollPlated = true; //set as plated
			} else if (this.sushiRollPlated) {
				//set order as plated & finished
				this.orderIsFinished = true;
				this.setOrderComplete();
			} else {
				//do nothing
			}
		}
	},

 //------------------------ ORDER TIME FUNCTIONS ----------------------------------

 //set order type function since json is wonky with setting string variables
 // with single ''  directly.
 setOrderType: function(type) {
	 switch(type) {
		 case 'pokeBowl':
			 this.orderType = 'pokeBowl';
			 break;
		 case 'sashimi':
			 this.orderType = 'sashimi';
			 break;
		 case 'sushiRoll':
			 this.orderType = 'sushiRoll';
			 break;
		 default:
			 console.log('setOrderType error: neither of the 3 typical cases')
	 }
 },
 	//for determining which order to check for in update,
 	//spawning their ingredients, and starting the order timer
	//TODO: change time/delay depending on day
 	createOrder: function() {
 		switch (this.orderType) {
 			case 'pokeBowl':
 					this.pokeBowlOrder = true;
 					this.spawnPokeIngredients(); //spawn specific ingredients needed
 					this.startOrderTimer((this.orderTime * 2), 30000); //start timer; 30 sec delay
 					break;
 		 case 'sashimi':
 					this.sashimiOrder = true;
 					this.spawnSashimiIngredients();
 					this.startOrderTimer(this.orderTime, 30000);
 					break;
 			case 'sushiRoll':
 				this.sushiRollOrder = true;
 				this.spawnSushiRollIngredients();
 				this.startOrderTimer((this.orderTime * 2), 30000);
 				break;
 			default:
			  //should not be reached
 		}
 	},
 	//starts the timer for the player to complete an order
 		//time: how much time allotted for an order
 		//delay:how much time before starting timers
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
	//functions to check for order status
	//on lateTimer completion, will call this and set the player as "late"
	 setLate: function() {
		 this.dialogConvo += 1;
			this.isRunningLate = true; 	//set player as running late
			this.pauseDialog = false; //unpause dialog
			this.typeText(); //call typeText
 },
	//on finishTimer completion, will set order as incomplete
	setIncomplete: function() {
			this.isOrderFinished = false; //set order as incomplete
			this.pauseDialog = false; 	//unpause dialog
			this.dialogConvo += 2;	//set correct dialogConvo when didn't finish
			this.typeText(); //call typeText
	},
	//in update, check if an order's correct and call this to set the order as true
	setOrderComplete: function() {
			this.isOrderFinished = true; //set the order as finished
			this.pauseDialog = false; //unpause dialog
			//set the correct dialogConvo when an order is complete
			if(this.isRunningLate) { this.dialogConvo += 1;}
			else { this.dialogConvo += 2; }
			//destroy timers
			this.lateTimer.destroy();
			this.finishedTimer.destroy();
			//call typeText
			this.typeText();
	},

 //------------------------ UPDATE FUNCTIONS ----------------------------------
 	//usually for checking collisions,

	//callback function that sets the rice as cooked and places correct assets
	cookRice: function() {
		this.riceIsCooked = true;	//set rice as cooked
		this.ricePot.loadTexture('atlas', 'pot_empty'); //reset rice pot texture
		this.rice = new Pickupable(game, 'rice_cooked', 900, 870); //load as cooked rice
		game.add.existing(this.rice);
	},
	checkKnifeCollisions: function() {
		// collide knife with salmon
		if(!this.salmonIsChopped && (rightPaw.isHolding || leftPaw.isHolding)){
			var chop = game.physics.arcade.overlap(this.salmon, this.knife);
			if(chop && !(this.salmon.isHeldByRight || this.salmon.isHeldByLeft) && (this.knife.isHeldByRight || this.knife.isHeldByLeft)){
				this.salmon.loadTexture('atlas', 'salmon_cut');
				this.salmonIsChopped = true;
				this.chopNoise.play();
			}
		}
	},
	//checks for collisions involving chef's paws
	checkPawCollisions: function() {
		//bowl & paw collisions
	if(game.physics.arcade.overlap(this.bowl, leftPaw)) {
		leftPaw.overlap = true;
		leftPaw.overlapObject = this.bowl;
	}
	if(game.physics.arcade.overlap(this.bowl, rightPaw)) {
		rightPaw.overlap = true;
		rightPaw.overlapObject = this.bowl;
	}
		//plate
	if(game.physics.arcade.overlap(this.plate, rightPaw)) {
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.plate;
		}
		if(game.physics.arcade.overlap(this.plate, leftPaw)) {
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.plate;
		}
		//seaweed
		if(game.physics.arcade.overlap(this.seaweed, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.seaweed;
		}
		if(game.physics.arcade.overlap(this.seaweed, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.seaweed;
		}
			// rice collisions with paws
		if(game.physics.arcade.overlap(this.rice, rightPaw)){
			rightPaw.overlap = true;
			rightPaw.overlapObject = this.rice;
		}
		if(game.physics.arcade.overlap(this.rice, leftPaw)){
			leftPaw.overlap = true;
			leftPaw.overlapObject = this.rice;
		}
			// salmon collisions with paws
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
	},
	checkRicePotCollision: function() {
		if(this.rice != undefined) {
			if(!this.rice.isHeldByRight && !this.rice.isHeldByLeft){
				if(game.physics.arcade.overlap(this.rice, this.ricePot)){
					this.rice.kill();
					this.ricePot.loadTexture('atlas', 'pot_rice');
					//start timer for rice to cook, currently takes 5 seconds to cook
					var riceTimer = game.time.create(true);
					riceTimer.add(this.RICE_TIMER, this.cookRice, this);
					riceTimer.start();
				}
			}
		}
	}
};
