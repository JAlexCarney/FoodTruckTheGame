var Controls = function(game){};

Controls.prototype = {
	
	create: function() {
		//set background color of this stage to white
		game.stage.backgroundColor = "#ffffff";
		
		game.add.image(49, 0, 'atlas', 'wasd controls');
		game.add.image(561, 0, 'atlas', 'ijkl controls');
		game.add.image(0, 610, 'atlas', 'mouse ');
		
		game.add.text(0, 410, 'keyboard instructions go here', {fill: '#000', font: '50px curior new'});
		game.add.text(410, 610, 'mouse instructions go here\nPress M to return to menu', {fill: '#000', font: '50px curior new'});
	},
	
	update: function() {
		// replace with button later
		if(game.input.keyboard.justPressed(Phaser.Keyboard.M)){
			game.state.start('Menu');
		}
	}
}