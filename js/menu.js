var Menu = function(game){};
Menu.prototype = {
	create: function() {
		// place assets and initialize variables
		game.add.image(0,0,'menuBackdrop');
		// place a button
		var startGame = function(){
			game.state.start('Play');
		};
		this.start = game.add.sprite( 250, 300,'atlas', 'button_start');
		this.start.scale.setTo(.5,.5);
		this.start.inputEnabled = true;
		this.start.events.onInputDown.add(startGame, this);
		// place a button
		var openControls = function(){
			game.state.start('Play');
		};
		this.controls = game.add.sprite( 450, 300,'atlas', 'button_controls');
		this.controls.scale.setTo(.5,.5);
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(openControls, this);
		// place a button
		var openOptions = function(){
			game.state.start('Play');
		};
		this.options = game.add.sprite( 650, 300,'atlas', 'button_options');
		this.options.scale.setTo(.5,.5);
		this.options.inputEnabled = true;
		this.options.events.onInputDown.add(openOptions, this);
	}
}