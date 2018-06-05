var UIButton = function(game, type, x, y){
	
	//load UIselect noise
	this.selectNoise = game.add.audio('select');
	
	if(type == 'Play'){
		
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'button_play');
	
	}else if(type == 'Controls'){
	
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'button_controls');
	
	}else if(type == 'Credits'){
	
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'button_credits');
	
	}else if(type == 'Menu'){
			
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'button_menu');
	
	}else if(type == 'Continue'){
			
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'button_continue');
	
	}
	this.type = type;

	var goToState = function(){
		if(type != 'Continue'){
			game.state.start(type);
			this.selectNoise.play('', 0, 1, false);
		}else{
			game.state.start('Play');
		}
	};
	
	this.inputEnabled = true;
	this.events.onInputDown.add(goToState, this);
}

UIButton.prototype = Object.create(Phaser.Sprite.prototype);

UIButton.prototype.constructor = UIButton;

UIButton.prototype.update = function(){

}