var Credits = function(game){};

Credits.prototype = {
	
	create: function() {
		//load UIselect noise
		this.selectNoise = game.add.audio('select');
		
		//set background color of this stage to white
		game.stage.backgroundColor = "#ffffff";
		
		//text box
			// font style
		this.creditsStyle = { font: 'bold 35px Courier New', fill: '#000000', align: "center",  boundsAlignH: "middle", boundsAlignV: "middle"};
			// credit text
		this.credits = game.add.text(15, 0, 'Food Truck is by Team Double A Double J:\nJ. Alexander Carney - Programming & Design\nJanel Catajoy - Art, Programming & Design\nAmanda Leiserowitz - Writing, Sound & Design\n\nSound\nAll sounds have been cropped to shorter lengths for use in this game.\nTokyo - Supermarket by manuke\nUI Cute Select Major 6th by plasterbrain\nUI Completed Status Alert Notification SFX001 by Headphaze\nknife&cuttingboard by SamKolber \nCutting Almonds with Knife by Australopithecusman\nItem_05 by timmy_h123\nPaper Crinkle by josepharaoh99\nKingston NY late summer midnight crickets - with distant train by samwd\nalarm clock short by ZyryTSounds\nTokyo - Hiroo street by manuke\nShaking Maracas by CyrileneRossouw', this.orderStyle);
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
		
		game.add.image(700, 200, 'atlas', 'alex chibi');
		game.add.image(700, 450, 'atlas', 'janel chibi');
		game.add.image(700, 700, 'atlas', 'amanda chibi');
	
		
		//http://www.html5gamedevs.com/topic/9707-embedding-a-hyperlink/
		button = game.add.button(256, 820, 'links', function() {  
			// open in the same window (like clicking a link)  
			window.location.href = "https://bit.ly/2siBPSe";  
			}, this);
	
	},
}