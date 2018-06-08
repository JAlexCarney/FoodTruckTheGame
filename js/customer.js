var Customer = function(game, type){
	if(type === 'alpaca'){
		Phaser.Sprite.call(this, game, 0, 0, 'atlas', 'customer_alpaca');
	}else if(type === 'bird'){
		Phaser.Sprite.call(this, game, 0, 72, 'atlas', 'customer_bird');
	}else if(type === 'frog'){
		Phaser.Sprite.call(this, game, 0, 112, 'atlas', 'customer_frog');
	}else if(type === 'axolotl'){
		Phaser.Sprite.call(this, game, 0, 132, 'atlas', 'customer_axolotl');
	}else if(type === 'bat'){
		Phaser.Sprite.call(this, game, 0, 42, 'atlas', 'customer_bat');
	}else if(type === 'shark'){
		Phaser.Sprite.call(this, game, 0, -8, 'atlas', 'customer_shark');
	}else if(type === 'mouse'){
		Phaser.Sprite.call(this, game, 0, 162, 'atlas', 'customer_mouse');
	}
	this.type = type;
}

Customer.prototype = Object.create(Phaser.Sprite.prototype);

Customer.prototype.constructor = Customer;

Customer.prototype.update = function(){
}
