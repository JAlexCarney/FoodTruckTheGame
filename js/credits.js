var Credits = function(game){};

Credits.prototype = {
	
	create: function() {
		//set background color of this stage to white
		game.stage.backgroundColor = "#ffffff";
		
		//text box
		
			// font style
		this.creditsStyle = { font: 'bold 35px Courier New', fill: '#000000', align: "center",  boundsAlignH: "center", boundsAlignV: "middle"};
			// text inside of speech bubble
		this.credits = game.add.text(15, 0, 'Team Double A Double J\nJ. Alexander Carney, Janel Catajoy, & Amanda Leiserowitz.\n\nSound\nTokyo - Supermarket by manuke; UI Cute Select Major 6th by plasterbrain; UI Completed Status Alert Notification SFX001 by Headphaze; knife&cuttingboard by SamKolber; Cutting Almonds with Knife by Australopithecusman', this.orderStyle);
		this.credits.setTextBounds(30, 10, 610, 374);
		this.credits.wordWrap = true;
		this.credits.wordWrapWidth = 610;
		
		var openMenu = function(){
			game.state.start('Menu');
		};
		this.controls = game.add.sprite(700, 150,'atlas', 'button_start');
		this.controls.scale.setTo(.5,.5);
		this.controls.inputEnabled = true;
		this.controls.events.onInputDown.add(openMenu, this);
	
	},
}