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
		
		var openMenu = function(){
			game.state.start('Menu');
			this.selectNoise.play('', 0, 1, false);
			day++;
		};
		this.menu = game.add.sprite(15, 930, 'atlas', 'button_menu');
		this.menu.scale.setTo( .75, .75)
		this.menu.inputEnabled = true;
		this.menu.events.onInputDown.add(openMenu, this);
		
		//add replay button to buttom right
		
		var startGame = function(){
			//play select noise upon clicking button
			this.selectNoise.play('', 0, 1, false);
			// start play by first showing controls if they haven't been seen.
			if(hasSeenControls){
				game.state.start('Play');
			}else{
			game.state.start('Controls', true, false, true);
			}
		};
		// place a button
		this.start = game.add.sprite( 800, 930,'atlas', 'button_play');
		this.start.scale.setTo( .75,.75 )
		this.start.inputEnabled = true;
		this.start.events.onInputDown.add(startGame, this);
		
	},
	
}