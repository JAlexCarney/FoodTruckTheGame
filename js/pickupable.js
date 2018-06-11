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
		this.body.setSize(35, 300, 82, 0);
		this.anchor = new PIXI.Point(0.5, 0.5);
		this.scale.setTo(1.5);

		// properties
		this.leftOffsetX = -32;
		this.leftOffsetY = -140;
		this.rightOffsetX = -32;
		this.rightOffsetY = -140;

	} else if (type == 'salmon'){

		// constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'salmon_whole');

		// physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.setSize(225, 110, 32, 50);
		this.anchor = new PIXI.Point(0.5, 0.5);

		// properties
		this.salmonIsChopped = false;
	} else if (type == 'seaweed'){
		// constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'seaweed');

		// physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor = new PIXI.Point(0.5, 0.5);
		this.scale.setTo(1.5);

	} else if (type == 'bowl'){
		// constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'bowl_empty');

		// physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor = new PIXI.Point(0.5, 0.5);

	} else if (type == 'plate') {
		//constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'plate');

		//physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.scale.setTo(0.7);
		this.anchor = new PIXI.Point(0.5, 0.5);

	} else if (type == 'rice_raw'){
		// constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'rice bag');

		// physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.scale.setTo(0.5);
		this.anchor = new PIXI.Point(0.5, 0.5);

	} else if (type == 'rice_cooked'){
		//constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'rice(isolated)');

		//physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.scale.setTo(0.7);
		this.anchor = new PIXI.Point(0.5, 0.5);

	} else if (type == 'pokeBowl'){
		//constructor
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'bowl_salmon');

		//physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.scale.setTo(0.7);
		this.anchor = new PIXI.Point(0.5, 0.5);

	} else if (type == 'sashimi') {
		//construct
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'sashimi');

		//physics
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.enableBody = true;
		this.scale.setTo(0.7);
		this.anchor = new PIXI.Point(0.5, 0.5);

	} else if (type == 'sushiRoll') {
		//construct
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'sushi_roll_uncut');

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.enableBody = true;
		this.scale.setTo(0.8);
		this.anchor = new PIXI.Point(0.5, 0.5);
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
