var Fade = function(game, AutoFade){
	
	Phaser.Sprite.call(this, game, 0, 0, 'fade');
	
	if(AutoFade){
		// be opaque
		this.alpha = 1;
	}else{
		// be invisable
		this.alpha = 0;
	}

	// fade in immediatly on spawn.
	this.isFadingIn = AutoFade;
	this.isFadingOut = false;
	this.fadeRate = 2/255;
	
}

Fade.prototype = Object.create(Phaser.Sprite.prototype);

Fade.prototype.constructor = Fade;

Fade.prototype.update = function(){

	if(this.isFadingIn){
		// stop bringing paws to top layer while fading
		leftPaw.fading = true;
		rightPaw.fading = true;
		// make sure it's on top
		game.world.bringToTop(this);
		
		this.alpha -= this.fadeRate;
		
		if(this.alpha <= 0){
			this.alpha = 0;
			this.isFadingIn = false;
		}
		
	}
	
	if(this.isFadingOut){
		// stop bringing paws to top layer while fading
		leftPaw.fading = true;
		rightPaw.fading = true;
		// make sure it's on top
		game.world.bringToTop(this);
	
		this.alpha += this.fadeRate;
		
		if(this.alpha >= 1){
			this.alpha = 1;
			this.isFadingOut = false;
		}
	
	}
	
}