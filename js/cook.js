var Paw = function (game, isLeftHand, x, y){
	// call sprite constructor
	Phaser.Sprite.call(this, game, x, y, 'atlas', 'CookPawOpen');
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.setSize(206, 226, 20, 30);
	this.body.collideWorldBounds = true;
	//this.scale.setTo(0.75);
	this.alpha = 0.5;
	this.anchor = new PIXI.Point(0.5, 0.5);

	//give custom properties
	this.isLeft = isLeftHand;
	this.isHolding = false;
	this.overlap = false;
	
	if(isLeftHand){
		this.anchor.x = 1;
		this.scale.setTo(-1,1);
	}
}

// inherit prototype from Phaser.Sprite and set constructor to Barrier
// the Object.create method creates a new object w/ the specified prototype object and properties
Paw.prototype = Object.create(Phaser.Sprite.prototype);
// since we used Object.create, we need to explicitly set the constructor
Paw.prototype.constructor = Paw;

Paw.prototype.update = function(){
	// movement controls.
		// left paw
	if(this.isLeft){
			// movement
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			this.body.velocity.y = -750;
			//console.log('moving Up!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
			this.body.velocity.y = 750;
			//console.log('moving Down!');
		}else{
			this.body.velocity.y = 0;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.body.velocity.x = -750;
			//console.log('moving Left!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			this.body.velocity.x = 750;
			//console.log('moving right!');
		}else{
			this.body.velocity.x = 0;
		}
			// grabbing
		if(game.input.keyboard.justPressed(Phaser.Keyboard.E)){
			this.loadTexture('atlas', 'CookPawClosed');
			if(this.overlap){
				console.log('grabed knife with left paw');	
				this.isHolding = true;
			}
		}
		if(game.input.keyboard.upDuration(Phaser.Keyboard.E)){
			this.loadTexture('atlas', 'CookPawOpen');	
			if(this.isHolding){
				this.isHolding = false;
			}
		}
	// right paw
	}else{
			// movement
		if(game.input.keyboard.isDown(Phaser.Keyboard.I) || game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			this.body.velocity.y = -750;
			//console.log('moving Up!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.K) || game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			this.body.velocity.y = 750;
			//console.log('moving Down!');
		}else{
			this.body.velocity.y = 0;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.J) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			this.body.velocity.x = -750;
			//console.log('moving Left!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.L) || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			this.body.velocity.x = 750;
			//console.log('moving right!');
		}else{
			this.body.velocity.x = 0;
		}
			//grabbing
		if(game.input.keyboard.justPressed(Phaser.Keyboard.U)){
			this.loadTexture('atlas', 'CookPawClosed');
			if(this.overlap){
				console.log('grabed knife with right paw');
				this.isHolding = true;
			}
		}
		if(game.input.keyboard.upDuration(Phaser.Keyboard.U)){
			this.loadTexture('atlas', 'CookPawOpen');
			if(this.isHolding){
				this.isHolding = false;
			}
		}
	}
	// keep it on the bottum screen
	if(this.y <= 490){
		this.y = 490;
	}
}