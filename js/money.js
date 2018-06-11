var Money = function(game, x, y){
	// give money prefab properties of a sprite
	Phaser.Sprite.call(this, game, x, y, 'atlas', 'money_paper');

	// give money physics
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.anchor = new PIXI.Point(0.5, 0.5);
	this.body.collideWorldBounds = true;
	this.body.gravity.y = 300;
	this.inputEnabled = true;

	// resize it
	this.scale.setTo(1.5);

	// custom properties
	this.beingHeld = false;
	this.grabSound = game.add.audio('cashGrab');

	// make money clickable (grab and realese)
	var grab = function() {
		this.body.gravity.y = 0;
		this.beingHeld = true;
		this.grabSound.play();
	}
	this.events.onInputDown.add(grab, this);

	var release = function() {
		this.body.gravity.y = 300;
		this.beingHeld = false;
	}
	this.events.onInputUp.add(release, this);
}

Money.prototype = Object.create(Phaser.Sprite.prototype);

Money.prototype.constructor = Money;

Money.prototype.update = function(){
	// make money follow mouse while being held
	if(this.beingHeld){
		this.x = game.input.mousePointer.x;
		if(game.input.mousePointer.y < 420){
			this.y = game.input.mousePointer.y;
		}
	}
	// make money always apear on top
	game.world.bringToTop(this);

	//handles if money goes beyond below the counter
	  //....in a silly way though
	if(this.y > 475) {
		this.body.velocity.y = -10;
  }
}
