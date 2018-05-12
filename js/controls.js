var Controls = function(game){};

Controls.prototype = {
	
	create: function() {
		//load UIselect noise
		this.selectNoise = game.add.audio('select');
		
		//set background color of this stage to white
		game.stage.backgroundColor = "#ffffff";
		
		game.add.image(49, 610, 'atlas', 'wasd controls');
		game.add.image(561, 610, 'atlas', 'ijkl controls');
		game.add.image(0, 0, 'atlas', 'mouse ');
		
		game.add.text(15, 450, 'The cook uses WASD to move the left paw and\nIJKL to move the right paw and uses E and U\nto pick up items.', {fill: '#000', font: '50px curior new'});
		game.add.text(405, 300, 'The cashier clicks on\ncustomers to take their orders', {fill: '#000', font: '50px curior new'});
		
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
	
	}
}