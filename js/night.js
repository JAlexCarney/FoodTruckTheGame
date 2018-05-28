var Night = function(game){};

Night.prototype = {
	
	preload: function() {
		// load assets into cache
		// load texture atlas
		game.load.atlas('newspaper', 'assets/img/newspaper.png', 'assets/img/newspaper.json');
		game.load.atlas('spritesheet', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
		//for testing
		//game.load.image('ipad with paw', 'assets/img/ipad with paw.png');
	
	},
	
	create: function() {
		//for debug purposes set day to a random number 1-8
		//day = game.rnd.integerInRange(1,8);
		//console.log(day);
		
		//check the day variable and use it to load the correct newspaper day sprite from the newspaper atlas
		this.newspaper = this.add.sprite(0, 512, 'newspaper', 'newspaper' + day);
		
		//add counter to the top half of screen
		this.add.sprite(0, 0, 'spritesheet', 'counter');
		
		//add the ipad to the top half of the screen
		//this.add.sprite(0, 0, 'ipad with paw'); //for testing
		this.add.sprite(0, 0, 'spritesheet', 'ipad with paw');
		
		// load divider
		//doesn't need any physics, since it is just a visual to aid the players in understanding the splitscreen mechanics
		this.divider = this.add.sprite(0, 502, 'spritesheet', 'divider');
		
		//add text
		this.txt = game.add.text(256, 256, "Day" + day + "You made money! Continue");
		this.txt.setTextBounds(30, 10, 290, 374);
		this.txt.wordWrap = true;
		this.txt.wordWrapWidth = 290;
			},
}