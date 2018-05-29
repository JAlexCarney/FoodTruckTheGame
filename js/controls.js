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
		game.stage.backgroundColor = "#eeee11";
		
		//load controls assets from the atlas, including lined paper background
		var bg = game.add.image(0, 0, 'atlas', 'paper');
		bg.scale.setTo(1.5, 1.75);
		bg.alpha = 0.9;
		game.add.image(0, 0, 'atlas', 'mouse 1');
		game.add.image(0, 512, 'atlas', 'controls 1');
		
		
		
		// load divider
		//doesn't need any physics, since it is just a visual to aid the players in understanding the splitscreen mechanics
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider_dotted');

		
		if(this.isPrePlay == false){
			var openMenu = function(){
				game.state.start('Menu');
				this.selectNoise.play('', 0, 1, false);
			};
			this.controls = game.add.sprite(405, 100,'atlas', 'button_menu');
			this.controls.inputEnabled = true;
			this.controls.events.onInputDown.add(openMenu, this);
		
			var openStart = function(){
				game.state.start('Play');
				this.selectNoise.play('', 0, 1, false);
			};
			this.controls = game.add.sprite(710, 100,'atlas', 'button_play');
			this.controls.inputEnabled = true;
			this.controls.events.onInputDown.add(openStart, this);
		} else {
			timer = game.time.create(true);
			event = timer.add(Phaser.Timer.SECOND * 5, this.cont, this);
			timer.start();
		}
	},
	cont: function() {
		game.state.start('Play');
	}
}