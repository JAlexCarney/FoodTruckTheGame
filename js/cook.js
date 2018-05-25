var Paw = function (game, isLeftHand, x, y){
	// call sprite constructor
	Phaser.Sprite.call(this, game, x, y, 'atlas', 'CookPawOpen');
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.setSize(206, 206, 20, 20);
	this.body.collideWorldBounds = true;
	//this.scale.setTo(0.75);
	this.alpha = 0.7;
	this.anchor = new PIXI.Point(0.5, 0.5);
	this.drag = 50;
	
	//give custom properties
	this.isLeft = isLeftHand;
	this.isHolding = false;
	this.overlap = false;
	this.overlapObject = null;
	this.heldObject = null;
	//load grab noise
	this.grabNoise = game.add.audio('grab');
	
	if(isLeftHand){
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
		}else if(this.body.velocity.y > 0){
			this.body.velocity.y -= this.drag;
		}else if(this.body.velocity.y < 0){
			this.body.velocity.y += this.drag;
		}else{
			this.body.velocity.y = 0;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.body.velocity.x = -750;
			//console.log('moving Left!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			this.body.velocity.x = 750;
			//console.log('moving right!');
		}else if(this.body.velocity.x > 0){
			this.body.velocity.x -= this.drag;
		}else if(this.body.velocity.x < 0){
			this.body.velocity.x += this.drag;
		}else{
			this.body.velocity.x = 0;
		}
		
					// grabbing
		if(game.input.keyboard.justPressed(Phaser.Keyboard.E) && this.isHolding === false && this.overlap){
			this.loadTexture('atlas', 'CookPawClosed');
			this.grabNoise.play();
			this.isHolding = true;
			if(this.overlapObject != null){
				this.heldObject = this.overlapObject;
				this.heldObject.isHeldByLeft = true;
			}
		}else if(game.input.keyboard.justPressed(Phaser.Keyboard.E)){
			this.loadTexture('atlas', 'CookPawOpen');
			this.isHolding = false;
			if(this.heldObject != null){
				this.heldObject.isHeldByLeft = false;
			}
			this.heldObject = null;
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
		}else if(this.body.velocity.y > 0){
			this.body.velocity.y -= this.drag;
		}else if(this.body.velocity.y < 0){
			this.body.velocity.y += this.drag;
		}else{
			this.body.velocity.y = 0;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.J) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			this.body.velocity.x = -750;
			//console.log('moving Left!');
		}else if(game.input.keyboard.isDown(Phaser.Keyboard.L) || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			this.body.velocity.x = 750;
			//console.log('moving right!');
		}else if(this.body.velocity.x > 0){
			this.body.velocity.x -= this.drag;
		}else if(this.body.velocity.x < 0){
			this.body.velocity.x += this.drag;
		}else{
			this.body.velocity.x = 0;
		}
		
			// grabbing
		if(game.input.keyboard.justPressed(Phaser.Keyboard.U) && this.isHolding === false && this.overlap){
			this.loadTexture('atlas', 'CookPawClosed');
			this.grabNoise.play();
			this.isHolding = true;
			if(this.overlapObject != null){
				this.heldObject = this.overlapObject;
				this.heldObject.isHeldByRight = true;
			}
		}else if(game.input.keyboard.justPressed(Phaser.Keyboard.U)){
			this.loadTexture('atlas', 'CookPawOpen');
			this.isHolding = false;
			if(this.heldObject != null){
				this.heldObject.isHeldByRight = false;
			}
			this.heldObject = null;
		}
	}
	
	// keep it on the bottum screen
	if(this.y <= 620){
		this.y = 620;
	}
	// keep paw on top of food
	game.world.bringToTop(this);
	this.overlap = false
}