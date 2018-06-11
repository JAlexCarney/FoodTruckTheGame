var Menu = function(game){};
Menu.prototype = {
	create: function() {
		// place assets and initialize variables
		game.add.image(0,0,'menuBackdrop');

		//load UIselect noise
		this.selectNoise = game.add.audio('select');
		//load ambient noise
		this.bgNoise = game.add.audio('ambientMenu');

		//play BG menu sound
		this.bgNoise.play();

			// button object
		this.start = game.add.sprite( 250, 160,'atlas', 'button_play');
		this.start.inputEnabled = true;
		this.start.events.onInputDown.add(this.startGame, this);

		// place a button
			// on press funtion
		var openControls = function(){

		};
			// button object
		this.controls = game.add.sprite( 500, 160,'atlas', 'button_controls');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(this.openControls, this);

		// place a button
			// on press funtion
		var openCredits = function(){

		};
			// button object
		this.options = game.add.sprite( 750, 160,'atlas', 'button_credits');
		this.options.inputEnabled = true;
		this.options.events.onInputDown.add(this.openCredits, this);
	},
	startGame: function(){
		this.bgNoise.pause(); //pause BG sound
		//play select noise upon clicking button
		this.selectNoise.play('', 0, 1, false);
		// start play by first showing controls if they haven't been seen.
		if(!hasSeenControls){
			//still take them there for now... lol
			game.state.start('Controls', true, false, true);
		}else if(!hasSeenComic){
			game.state.start('Comic', true, false, true);
		}else if(hasSeenControls && hasSeenComic){
			game.state.start('Play');
	}
},
	openControls: function() {
		//play select noise upon clicking button
		this.selectNoise.play('', 0, 1, false);
		this.bgNoise.pause(); //pause BG sound
		game.state.start('Controls', true, false, false);
	},
	openCredits: function() {
		//play select noise upon clicking button
		this.selectNoise.play('', 0, 1, false);
		this.bgNoise.pause(); //pause BG sound
		game.state.start('Credits');

	}
}
