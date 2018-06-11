// create the game object with a...
// resolution (1:2 rectangle)
var game;
var day;
var hasSeenControls = false;
var hasSeenComic = false;

window.onload = function(){
	game = new Phaser.Game(1024, 1024, Phaser.AUTO, 'game');
	game.state.add('Preload', Preload);
	game.state.add('Boot', Boot);
	game.state.add('Menu', Menu);
	game.state.add('Controls', Controls);
	game.state.add('Comic', Comic);
	game.state.add('Night', Night);
	game.state.add('Play', Play);
	game.state.add('Over', Over);
	game.state.add('Credits', Credits);
	game.state.start('Boot');

	//set the global day variable so that it can be accessed from any state
	day = 1;
}

// this  should help with the keyboard input bug in itch.io
window.onmousedown = function() {window.setFocus();}

// Boot and preloader adapted from nathans source code on asset loading (assets03.js).
var Boot = function(game){};
Boot.prototype = {
	init: function() {
		// keep game running when not active browser.
		this.stage.disableVisibilityChange = true;
	},

	preload: function() {
		// load minimal assets needed for loading bar
		this.load.image('load', 'assets/img/load.png')
	},

	create: function() {
		// precede to preloader
		game.state.start('Preload');
	}
}

var Preload = function(game){};
Preload.prototype = {
	preload: function() {
		// set appropriate background color
		game.stage.backgroundColor = "#000000";

		// display text
		this.add.text(475, 300, 'Loading...', {fontSize: '32px', fill: '#ffffff'});

		// add preloader bar and set as preloader sprite (auto-crops sprite)
		this.preloadBar = this.add.sprite(this.world.centerX-256, this.world.centerY-64,'load');
		this.load.setPreloadSprite(this.preloadBar);

		// load assets into cache
			// load main texture atlas
		game.load.atlas('atlas', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
			//load register texture atlas
		game.load.atlas('registerAtlas', 'assets/img/register.png', 'assets/img/register.json');
			// load menu backdrop
		game.load.image('menuBackdrop', 'assets/img/menuBackdrop.png');

		//load button for credits page
		game.load.image('links', 'assets/img/links.png');

			// load screen fade
		game.load.image('fade', 'assets/img/fade.png');

			//load comic now
		game.load.image('comic', 'assets/img/storyComic.png');

		//load dialog JSON files
		game.load.text('dialog', 'js/day1dialog.json');
		game.load.text('dialog2', 'js/day2dialog.json');
		game.load.text('dialog3', 'js/day3dialog.json');
		game.load.text('dialog4', 'js/day4dialog.json');
		game.load.text('dialog5', 'js/day5dialog.json');

		//load audio files
		  //ambient noise
		game.load.audio('ambientNoise', 'assets/audio/tokyoSupermarket.ogg');
		  //load UI select SFX
		game.load.audio('select', 'assets/audio/UIselect.ogg');
		  // grab sound
		game.load.audio('grab', 'assets/audio/grab.ogg');
		  // cash register sound
		game.load.audio('register', 'assets/audio/register.ogg');
		  // chopping sound
		game.load.audio('chop', 'assets/audio/chop.ogg');
		  // paper crinkling sound
		game.load.audio('cashGrab', 'assets/audio/cash.ogg');
		// alarm sound
	 game.load.audio('alarm', 'assets/audio/alarm.ogg');
		// newspaper crinkle sound
	 game.load.audio('newspaper', 'assets/audio/newspaper close short.ogg');
	 // night time ambient noise sound
	 game.load.audio('ambientNight', 'assets/audio/summer midnight crickets.ogg');
	 // ambient menu noise
 		game.load.audio('ambientMenu', 'assets/audio/Hiroo Street.ogg');
	},

	update: function() {
		// wait for first ogg to properly decode
		this.state.start('Menu');
	}
}
// end of nathans code addaption

var Over = function(game){};
Over.prototype = {

	preload: function() {
		// load assets into cache
	},

	create: function() {
		// place assets
	},

	update: function() {
		// run game loop
	}
}
