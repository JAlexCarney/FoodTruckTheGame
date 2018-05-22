var Pickupable = function(game, type, x, y){
	this.leftOffsetX = 0;
	this.leftOffsetY = 0;
	this.rightOffsetX = 0;
	this.rightOffsetY = 0;
	
	if(type == 'knife'){
		
		// constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'knife');
		
		// physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor = new PIXI.Point(0.5, 0.5);
		this.scale.setTo(1.5);
		
		// properties
		this.leftOffsetX = -32;
		this.leftOffsetY = -100;
		this.rightOffsetX = -32;
		this.rightOffsetY = -100;
		
	} else if (type == 'salmon'){
		
		// constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'salmon_whole');
		
		// physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor = new PIXI.Point(0.5, 0.5);
		this.scale.setTo(0.5);
		
		// properties
		this.salmonIsChopped = false;
	}
	this.type = type;
	this.isHeldByRight = false;
	this.isHeldByLeft = false;
}

Pickupable.prototype = Object.create(Phaser.Sprite.prototype);

Pickupable.prototype.constructor = Pickupable;

Pickupable.prototype.update = function(){
	if(this.isHeldByRight){
		this.x = rightPaw.x + this.rightOffsetX;
		this.y = rightPaw.y + this.rightOffsetY;
	} else if(this.isHeldByLeft){
		this.x = leftPaw.x + this.leftOffsetX;
		this.y = leftPaw.y + this.leftOffsetY;
	}
}