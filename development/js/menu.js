var Menu = function(game){};
Menu.prototype = {
	create: function() {
		// place assets and initialize variables
		game.add.image(0,0,'menuBackdrop');

		//load UIselect noise
		this.selectNoise = game.add.audio('select');

		// place a play button
		this.start = game.add.sprite( 250, 170,'atlas', 'button_play');
		this.start.inputEnabled = true;
		this.start.events.onInputDown.add(this.startGame, this);

		// place controls screen button
		this.controls = game.add.sprite( 505, 170,'atlas', 'button_controls');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(this.openControls, this);


		//place credits screen button
		this.options = game.add.sprite( 765, 170,'atlas', 'button_credits');
		this.options.inputEnabled = true;
		this.options.events.onInputDown.add(this.openCredits, this);
	},

	//takes player to the "story prologue" state if havent played before
	startGame: function(){
		//play select noise upon clicking button
		this.selectNoise.play('', 0, 1, false);
		// start play by first showing controls if they haven't been seen.
		if(hasSeenControls){
			game.state.start('Comic');
		}else{
			//still take them there for now... lol
		game.state.start('Comic', true, false, true);
		}
	},
	//takes player to Controls screen
	openControls: function() {
		//play select noise upon clicking button
		this.selectNoise.play('', 0, 1, false);
		game.state.start('Controls', true, false, false);
	},
	//takes player to credits state screen
	openCredits:  function(){
			//play select noise upon clicking button
			this.selectNoise.play('', 0, 1, false);
			game.state.start('Credits');
		}
};
