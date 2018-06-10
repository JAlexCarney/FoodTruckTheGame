var Night = function(game){};

Night.prototype = {
	
	preload: function() {
		// load assets into cache
		// load texture atlas
		game.load.atlas('newspaper', 'assets/img/newspaper.png', 'assets/img/newspaper.json');
		game.load.atlas('spritesheet', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
		game.load.image('ipad with paw', 'assets/img/ipad with paw.png');
	
	},
	
	create: function() {
		//for debug purposes set day to a random number 1-8
		//day = game.rnd.integerInRange(1,8);
		//console.log(day);
		
		// set backgroundColor as black
		game.stage.backgroundColor = "#000000";
		
		// load select sound
		this.selectNoise = game.add.audio('select');
		
		//check the day variable and use it to load the correct newspaper day sprite from the newspaper atlas
		this.newspaper = this.add.sprite(0, 512, 'newspaper', 'newspaper' + day);
		
		//add counter to the top half of screen
		this.add.sprite(0, 0, 'spritesheet', 'counter');
		
		//add the ipad to the top half of the screen
		this.add.sprite(0, 0, 'ipad with paw');
		
		// load divider
		//doesn't need any physics, since it is just a visual to aid the players in understanding the splitscreen mechanics
		this.divider = this.add.sprite(0, 502, 'spritesheet', 'divider');
		
		//var money = game.rnd.intengerInRange(132, 571);
		var money = Math.floor(Math.random() * 439) + 132;
		
		//set up dayName variable to display M-F 
		if(day == 1){ var dayName = "Monday"; }
		else if (day == 2) { dayName = "Tuesday"; }
		else if (day == 3) { dayName = "Wednesday"; }
		else if (day == 4) {dayName = "Thursday"; }
		else {dayName = "Friday"; }
		
		
		//add text
		this.txtStyle = { font: 'bold 30px Courier New', fill: '#000000', align: "center",  boundsAlignH: "middle", boundsAlignV: "middle"};
		this.txt = game.add.text(340, 15, dayName + "\nYou made $" + money, this.txtStyle);
		this.txt.setTextBounds(30, 10, 290, 374);
		this.txt.wordWrap = true;
		this.txt.wordWrapWidth = 290;

		
		// make a menu button
		var openMenu = function(){
			game.state.start('Menu');
			this.selectNoise.play('', 0, 1, false);
			day++;
		};
		this.controls = game.add.sprite(220, 270, 'atlas', 'button_menu');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(openMenu, this);
		
		
		// make a continue button
		var openPlay = function(){
			this.selectNoise.play('', 0, 1, false);
			day++;
			game.state.start('Play');
		};
		this.controls = game.add.sprite(500, 270, 'atlas', 'button_continue');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(openPlay, this);
		},
}