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

		// set backgroundColor as black
		game.stage.backgroundColor = "#000000";
		// load select sound
		game.load.audio('newspaper', 'assets/audio/newspaper close short.ogg');
		game.load.audio('ambientNight', 'assets/audio/Hiroo Street.ogg');
		this.selectNoise = game.add.audio('select');
		//load newspaper crinkle sound
		this.newspaperNoise = game.add.audio('newspaper');
		//load night ambient sound
		this.ambientNight = game.add.audio('ambientNight');

		//check the day variable and use it to load the correct newspaper day sprite from the newspaper atlas
		this.newspaper = this.add.sprite(0, 512, 'newspaper', 'newspaper' + day);

		//add counter to the top half of screen
		this.add.sprite(0, 0, 'spritesheet', 'counter');

		//add the ipad to the top half of the screen
		this.add.sprite(0, 0, 'ipad with paw');

		// load divider
		//doesn't need any physics, since it is just a visual to aid the players in understanding the splitscreen mechanics
		this.divider = this.add.sprite(0, 502, 'spritesheet', 'divider');

		//showing money amount earned for the day
			//as you can see it doesn't really matter lol
		var money = Math.floor(Math.random() * 150) + 50;
		if(day > 1) {
			money -= (day * 20);
		}

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
		this.controls = game.add.sprite(220, 270, 'atlas', 'button_menu');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(this.openMenu, this);


		// make a continue button
		this.controls = game.add.sprite(500, 270, 'atlas', 'button_continue');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(this.openPlay, this);

		//play newspaper crinkle at beginning of night time state, and night ambient noise
		this.newspaperNoise.play();
		this.ambientNight.fadeIn(3000, true, '');
		this.ambientNight.play('', 0, 1.5, true);

	},
	openMenu: function() {
		game.state.start('Menu');
		this.selectNoise.play('', 0, 1, false);
		this.ambientNight.fadeOut(10);
		this.ambientNight.stop();
		day++;
	},
	openPlay: function() {
		if(day != 5) {
			this.selectNoise.play('', 0, 1, false);
			this.ambientNight.fadeOut(10);
			this.ambientNight.stop();
			day++;
			game.state.start('Play');
		}
		else {
			this.ambientNight.fadeOut(50);
			this.ambientNight.stop();
			game.state.start('Over');
		}

	}
}
