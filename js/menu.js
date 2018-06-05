var Menu = function(game){};
Menu.prototype = {
	create: function() {
		// place assets and initialize variables
		game.add.image(0,0,'menuBackdrop');

		// place buttons
		this.play = new UIButton(game, 'Play', 250, 160);
		game.add.existing(this.play);
		
		this.controls = new UIButton(game, 'Controls', 500, 160);
		game.add.existing(this.controls);
		
		this.credits = new UIButton(game, 'Credits', 750, 160);
		game.add.existing(this.credits);
	}
}
