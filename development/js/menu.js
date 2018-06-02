var Menu = function(game){};
Menu.prototype = {
	create: function() {
		// place assets and initialize variables
		game.add.image(0,0,'menuBackdrop');

		//load UIselect noise
		this.selectNoise = game.add.audio('select');

		var startGame = function(){
			//play select noise upon clicking button
			this.selectNoise.play('', 0, 1, false);
			// start play by first showing controls if they haven't been seen.
		 	if(hasSeenControls){
		 		game.state.start('Play');
		 	}else{
		 	game.state.start('Comic', true, false, true);
		 	}
		 };
		// place a button
		this.start = game.add.sprite( 250, 170,'atlas', 'button_play');
		this.start.inputEnabled = true;
		this.start.events.onInputDown.add(startGame, this);
		// place a button
		var openControls = function(){
			//play select noise upon clicking button
			this.selectNoise.play('', 0, 1, false);
			game.state.start('Comic', true, false, false);
		};
		this.controls = game.add.sprite( 505, 170,'atlas', 'button_controls');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(openControls, this);
		// place a button
		var openCredits = function(){
			//play select noise upon clicking button
			this.selectNoise.play('', 0, 1, false);
			game.state.start('Credits');
		};
		this.options = game.add.sprite( 765, 170,'atlas', 'button_credits');
		this.options.inputEnabled = true;
		this.options.events.onInputDown.add(openCredits, this);
	}
};