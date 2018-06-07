var Credits = function(game){};

Credits.prototype = {
	
	create: function() {
		//load UIselect noise
		this.selectNoise = game.add.audio('select');
		
		//set background color of this stage to white
		game.stage.backgroundColor = "#000000";
		
		//text box
			// font style
		this.creditsStyle = { font: 'bold 23px Courier New', fill: '#ffffff', align: "center",  boundsAlignH: "middle", boundsAlignV: "middle"};
			// credit text
		this.credits = game.add.text(15, 180, 'Food Truck is by Team Double A Double J:\nJ. Alexander Carney - Programming & Design\nJanel Catajoy - Art, Programming & Design\nAmanda Leiserowitz - Writing, Sound Editing & Design\n\nSound\nTokyo - Supermarket by manuke\nUI Cute Select Major 6th by plasterbrain\nUI Completed Status Alert Notification SFX001 by Headphaze\nknife&cuttingboard by SamKolber \nCutting Almonds with Knife by Australopithecusman\nPaper Crinkle by josepharaoh99\nKingston NY late summer midnight crickets - with distant train by samwd\nalarm clock short by ZyryTSounds\nNewspaper_close by rambler52\nTokyo - Hiroo street by manuke', this.creditsStyle);
		this.credits.setTextBounds(30, 10, 610, 374);
		this.credits.wordWrap = true;
		this.credits.wordWrapWidth = 610;
		
		// make a button
		var openMenu = function(){
			game.state.start('Menu');
			this.selectNoise.play('', 0, 1, false);
		};
		this.controls = game.add.sprite(700, 50,'atlas', 'button_menu');
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(openMenu, this);
		
		game.add.image(730, 250, 'atlas', 'alex chibi');
		game.add.image(730, 500, 'atlas', 'janel chibi');
		game.add.image(730, 750, 'atlas', 'amanda chibi');
	
		
		//http://www.html5gamedevs.com/topic/9707-embedding-a-hyperlink/
		button = game.add.button(100, 750, 'links', function() {  
			// open in the same window (like clicking a link)  
			window.location.href = "https://bit.ly/2siBPSe";  
			}, this);
	
	},
}