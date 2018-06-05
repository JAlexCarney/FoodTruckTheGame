
var Over = function(game){};
Over.prototype = {

	preload: function () {
		//load the ending comic
		game.load.image('game over comic', 'assets/img/game over comic.png');
	},
	create: function () {
		
		//place game over comic to cover entire screen w/ origin at top left
		this.add.sprite(0, 0, 'game over comic');
		
		//add menu button to bottom left
		this.menu = new UIButton(game, 'Menu', 15, 930);
		game.add.existing(this.menu);
		this.menu.scale.setTo(.75);
		
		//add replay button to buttom right
		this.play = new UIButton(game, 'Play', 800, 930);
		game.add.existing(this.play);
		this.play.scale.setTo(.75);
		
		
	},
	
}