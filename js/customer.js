var Customer = function(game, type){
	if(type == 0){
		Phaser.Sprite.call(this, game, 0, 0, 'atlas', 'customer_alpaca');
	}else if(type == 1){
		Phaser.Sprite.call(this, game, 0, 72, 'atlas', 'customer_bird');
	}else if(type == 2){
		Phaser.Sprite.call(this, game, 0, 112, 'atlas', 'customer_frog');
	}else if(type == 3){
		Phaser.Sprite.call(this, game, 0, 132, 'atlas', 'customer_axolotl');
	}else if(type == 4){
		Phaser.Sprite.call(this, game, 0, 42, 'atlas', 'customer_bat');
	}else if(type == 5){
		Phaser.Sprite.call(this, game, 0, -8, 'atlas', 'customer_shark');
	}else if(type == 6){
		Phaser.Sprite.call(this, game, 0, 162, 'atlas', 'customer_mouse');
	}
	this.type = type;
}

Customer.prototype = Object.create(Phaser.Sprite.prototype);

Customer.prototype.constructor = Customer;

Customer.prototype.update = function(){

}