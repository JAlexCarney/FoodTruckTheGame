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
		game.stage.backgroundColor = "#ffff88";

		//load controls assets from the atlas, including lined paper background
		var bg = game.add.image(0, 0, 'atlas', 'paper');
		bg.scale.setTo(1.5, 1.75);
		bg.alpha = 0.6;
		var playerOneControls = game.add.image(0, 0, 'atlas', 'mouse 1');
		game.add.image(0, 512, 'atlas', 'controls 1');

		// load divider
		//doesn't need any physics, since it's just a visual to aid the players in understanding the splitscreen mechanics
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider_dotted');

			// make room for buttons
			playerOneControls.scale.setTo(0.8);
			playerOneControls.y += 102;
			playerOneControls.x += 102;

			// spawn buttons
			this.controls = game.add.sprite(305, 0,'atlas', 'button_menu');
			this.controls.inputEnabled = true;
			this.controls.events.onInputDown.add(this.openMenu, this);

			this.controls = game.add.sprite(610, 0,'atlas', 'button_play');
			this.controls.inputEnabled = true;
			this.controls.events.onInputDown.add(this.openStart, this);
	},
	openMenu: function() {
		game.state.start('Menu');
		this.selectNoise.play('', 0, 1, false);
	},
	//either takes player to play or the story comic
	openStart: function() {
		this.selectNoise.play('', 0, 1, false);
		if(hasSeenComic) {
				game.state.start('Play'); //start play if has seen comic
		} else {
			 game.state.start('Comic'); //show them comic for context
		}
	}
}
