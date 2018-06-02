var Controls = function(game){};

Controls.prototype = {

	init: function(prePlay) {
			this.isPrePlay = prePlay;
	},

	create: function() {
		// overide prePlayControls if player has seen controls already.
		hasSeenControls = true;

		//load UIselect noise
		this.selectNoise = game.add.audio('select');

		//set background color of this stage to white
		game.stage.backgroundColor = "#ffffff";

		//load controls assets from the atlas, including lined paper background
		game.add.image(0, 0, 'atlas', 'mouse 1');
		game.add.image(0, 512, 'atlas', 'controls 1');
		game.add.image(0, 0, 'atlas', 'paper');

		// load divider
		//doesn't need any physics, since it is just a visual to aid the players in understanding the splitscreen mechanics
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider_dotted');


		if(this.isPrePlay == false) {

			//set up menu button
			this.menuButton = game.add.sprite(405, 100,'atlas', 'button_menu');
			this.menuButton.inputEnabled = true;
			this.menuButton.events.onInputDown.add(this.openMenu, this);


			this.playButton = game.add.sprite(710, 100,'atlas', 'button_play');
			this.playButton.inputEnabled = true;
			this.playButton.events.onInputDown.add(this.openStart, this);
		} else {
			//proceed to play
			this.playButton = this.playButton = game.add.sprite(710, 100,'atlas', 'button_play');
			this.playButton.inputEnabled = true;
			this.playButton.events.onInputDown.add(this.openStart, this);
		}
	},
	//takes player back to menu
	openMenu: function(){
		game.state.start('Menu');
		this.selectNoise.play('', 0, 1, false);

	},
	//if player hasn't seen comic, take them to it
	openStart: function() {
		if(!hasSeenComic) {
			game.state.start('Comic');
			this.selectNoise.play('', 0, 1, false);
		} else {
			game.state.start('Play');
			this.selectNoise.play('', 0, 1, false);
		}

	}
}
