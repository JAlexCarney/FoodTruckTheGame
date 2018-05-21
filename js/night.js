var Night = function(game){};

Night.prototype = {
	
	preload: function() {
		// load assets into cache
			// load texture atlas
		game.load.atlas('newspaper', 'assets/img/newspaper.png', 'assets/img/newspaper.json');
	},
	
	create: function() {
		// load divider
		//doesn't need any physics, since it is just a visual to aid the players in understanding the splitscreen mechanics
		this.divider = this.add.sprite(0, 502, 'atlas', 'divider');
		
		//for debug purposes set day to a random number 1-8
		day = game.rnd.integerInRange(1,8);
		console.log(day);
		
		//check the day variable and use it to load the correct newspaper day sprite from the newspaper atlas
		this.newspaper = this.add.sprite(0, 512, 'newspaper', 'newspaper' + day);
			
			},
}