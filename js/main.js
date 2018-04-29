// create the game object with a...
// resolution (1:2 rectangle)
var game = new Phaser.Game(1536, 1024, Phaser.AUTO);

var Boot = function(game){};
Boot.prototype = {

	preload: function() {
		
		// load assets into cache
			// load scrolling textures
		game.load.image('Hills', 'assets/img/TileHills.png');
		game.load.image('Mountains', 'assets/img/TileMountains.png');
		game.load.image('Clouds', 'assets/img/TileClouds.png');
			// load texture atlas
		game.load.atlas('atlas', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
			// load the background music
		game.load.audio('peacefulHipHop', 'assets/audio/PeacefulHipHopLoopable.mp3');
			// SFX
		game.load.audio('pickup', 'assets/audio/Collect.wav');
		game.load.audio('bounce', 'assets/audio/Bounce.wav');

		console.log("Assets Loaded!");
	},
	
	create: function() {
		// nothing displayed durring boot state
		// I figure that is okay since it loads so fast
	},

	update: function() {
		// proceed to menu
		game.state.start('Menu');
	}
}

var Menu = function(game){};
Menu.prototype = {

	preload: function() {
		// not used, assets loaded in boot state
	},
	
	create: function() {
		// place assets and initialize variables
		
		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";
	
		// Place game title
		var style = {font: "bold 150px Courier New", fill: "#000000", align: "center", boundsAlignH: "center", boundsAlignV: "middle"};
		let title = this.game.add.text(0,30, "Poof Runner", style);
		title.setTextBounds(0, 0, game.world.width, 200);
		// place byline
		var style = {font: "bold 50px Courier New", fill: "#000000", align: "center", boundsAlignH: "center", boundsAlignV: "middle"};
		let byline = this.game.add.text(0, 210, "By Alex Carney", style);
		byline.setTextBounds(0, 0, game.world.width, 100);
		// Place prompt
		style = {font: "bold 75px Arial", fill: "#000000", align: "center", boundsAlignH: "center", boundsAlignV: "middle"};
		let prompt = this.game.add.text(0,650, 'Press SPACE \nto play!', style);
		prompt.setTextBounds(0, 0, game.world.width, 300);
		
		// create idle player
		this.poof = this.add.sprite(this.world.centerX, this.world.centerY, 'atlas', 'Idle0001');
		this.poof.anchor.x = 0.5;
		this.poof.anchor.y = 0.5;
		this.poof.scale.x = 2;
		this.poof.scale.y = 2;
		
		this.poof.animations.add('idle', Phaser.Animation.generateFrameNames('Idle', 1, 2, '', 4), 2, true);
		this.poof.animations.play('idle');

	},

	update: function() {
		// run game loop
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('Play');
		}
	}
}

var Play = function(game){};
Play.prototype = {

	preload: function() {
		// load assets into cache
			// not used at this time
	},
	create: function() {
		// place assets and initialize variables
		
		// set appropriate background color
		game.stage.backgroundColor = "#ffffff";

		// play music
		this.backgroundMusic = game.add.audio('peacefulHipHop');
		this.backgroundMusic.loopFull(0.2);
		// start soft and rise to half real volume.
		this.backgroundMusic.fadeTo(2000, 0.5);

		// add sounds
		this.pickupSound = game.add.audio('pickup');
		this.bounceSound = game.add.audio('bounce');		

		// physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// load Scrolling background
		this.BGClouds = game.add.tileSprite(0, 32, game.world.width, game.world.height, 'Clouds');
		this.BGMountains = game.add.tileSprite(0, 32, game.world.width, game.world.height, 'Mountains');
		this.BGHills = game.add.tileSprite(0, 32, game.world.width, game.world.height, 'Hills');
		
		// initialize/reset scrollSpeed 
		this.scrollSpeed = 8;
		// initialize spawn delay to something easy
		this.spawnDelay = 1000;
		// set a scaling factor that relates scrollSpeed to velocity of objects
		this.velocityScale = -75;
		// remeber that game is not over :P
		this.gameover = false;

		// create platforms group
		this.platforms = game.add.group();
		this.platforms.enableBody = true;
		// fill bottom of screen with platforms to create a safe start for the player
		for(i = 0; i <= game.world.width+128; i+= 128){
			platform = this.platforms.create(i, 768, 'atlas', 'TempIslandMiddle');
			platform.body.setSize(128, 240, 0, 16);
			platform.body.immovable = true;
			platform.body.velocity.x = this.velocityScale * this.scrollSpeed;
			platform.body.friction.x = 0;
			platform.body.friction.y = 0;
		}
		// spawn end platform
		platform = this.platforms.create(game.world.width+256, 768, 'atlas', 'TempIslandEnd');
		platform.body.setSize(128, 240, 0, 16);
		platform.body.immovable = true;
		platform.body.velocity.x = this.velocityScale * this.scrollSpeed;
		platform.body.friction.x = 0;
		platform.body.friction.y = 0;

		// create decorations group
		this.decor = game.add.group();
		this.decor.enableBody = true;

		// create initial decorations for the starting platform
		tree = this.decor.create(1024, 520, 'atlas', 'Tree');
		tree.body.velocity.x = this.velocityScale * this.scrollSpeed;
		sign = this.decor.create(1250, 652, 'atlas', 'Arrow');
		sign.body.velocity.x = this.velocityScale * this.scrollSpeed;
		flower = this.decor.create(512, 712, 'atlas', 'Decor0003');
		flower.body.velocity.x = this.velocityScale * this.scrollSpeed;

		// create pickup group with a physics body
		this.pickups = game.add.group();
		this.pickups.enableBody = true;


		// spawn easy to grab pickup to introduce them to player
		var coin = this.pickups.create(game.world.width+256, 512, 'atlas', 'Coin0001');
		coin.body.velocity.x = this.velocityScale * this.scrollSpeed;
		// adjust hit box
		coin.body.setSize(32,32,16,16);
		// animate it
		coin.animations.add('spin', Phaser.Animation.generateFrameNames('Coin', 1, 10, '', 4), 10, true);
		coin.animations.play('spin');

		// create running player
		this.poof = this.add.sprite(128, game.world.height-240-128, 'atlas', 'Run0001');
		
		//  We need to enable physics on the player
		game.physics.arcade.enable(this.poof);

		// fix hitbox
		this.poof.body.setSize(105, 128, 10, 0);
		
		//  Player physics properties. Give the little guy a slight bounce.
		this.poof.body.bounce.y = 0.5;
		this.poof.body.friction.x = 0;
		this.poof.body.friction.y = 0;
		this.poof.body.gravity.y = 300;
		
		this.poof.animations.add('run', Phaser.Animation.generateFrameNames('Run', 1, 6, '', 4), 10, true);
		this.poof.animations.play('run');
		
		// Setup score-keeper and distance tracker
		this.score = 0;
		this.distance = 0;
		this.scoreText = game.add.text(16, 16, 'distance: 0', { fontSize: '32px', fill: '#000000'});
		

		// Place prompt
		this.style = {font: "bold 40px Arial", fill: "#000000", align: "right"};
		this.game.add.text(1110, 16, 'Press W to bounce.\nHold A to slow down.\nHold D to speed up.\nPress Q to end game.\n ', this.style);
	},

	update: function() {
		// run game loop

		// PLAYER CONTROLS
		{
			//  Collide the player and the platforms
			var hitPlatform = game.physics.arcade.collide(this.poof, this.platforms);
			// proccess collisions between the player and pickups
			game.physics.arcade.overlap(this.poof, this.pickups, collect, null, this);

			// pickup pickup
			function collect (poof, pickup) {
				// Play sound effect
				this.pickupSound.play();
				// Remove star from screen
				pickup.kill();	
				// Add to the score
				this.score += 100;
			}

			// Allow the player to jump only if they are on the ground within 200ms.
			if(game.input.keyboard.downDuration(Phaser.Keyboard.W, 200) && this.poof.body.touching.down && hitPlatform)
			{
				// Set vertical speed (will be slowed down by gravity)
				this.poof.body.velocity.y = -500;
				// play sound effect
				this.bounceSound.play();
			}
			// Allow player to slow down scroll speed while holding down A and speed it up while holding D
			if(game.input.keyboard.justPressed(Phaser.Keyboard.A) && this.scrollSpeed != 4 && !this.gameover){
				this.scrollSpeed = 4;
				this.poof.animations.currentAnim.speed = 3;
				//console.log('Slow...');
				// loop through all platforms and change their speed
				for(i = 0; i < this.platforms.children.length; i++){
					this.platforms.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}
			
				// loop through all decor and change their speed
				for(i = 0; i < this.decor.children.length; i++){
					this.decor.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}

				// loop through all pickups and change their speed
				for(i = 0; i < this.pickups.children.length; i++){
					this.pickups.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}
			}
			if(game.input.keyboard.justPressed(Phaser.Keyboard.D) && this.scrollSpeed != 12 && !this.gameover){
				this.scrollSpeed = 12;
				this.poof.animations.currentAnim.speed = 14;
				//console.log('Fast!');
				// loop through all platforms and change their speed
				for(i = 0; i < this.platforms.children.length; i++){
					this.platforms.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}
			
				// loop through all decor and change their speed
				for(i = 0; i < this.decor.children.length; i++){
					this.decor.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}

				// loop through all pickups and change their speed
				for(i = 0; i < this.pickups.children.length; i++){
					this.pickups.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}
			}
			if(((game.input.keyboard.upDuration(Phaser.Keyboard.A, 100) || game.input.keyboard.upDuration(Phaser.Keyboard.D, 100)) && this.scrollSpeed != 8) || this.gameover){
				this.scrollSpeed = 8;
				this.poof.animations.currentAnim.speed = 7;
				//console.log('normal.');
				// loop through all platforms and change their speed
				for(i = 0; i < this.platforms.children.length; i++){
					this.platforms.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}
			
				// loop through all decor and change their speed
				for(i = 0; i < this.decor.children.length; i++){
					this.decor.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}

				// loop through all pickups and change their speed
				for(i = 0; i < this.pickups.children.length; i++){
					this.pickups.children[i].body.velocity.x = this.scrollSpeed * this.velocityScale;
				}
			}
		}

		// Parallax Scroll backgrounds
		this.BGClouds.tilePosition.x -= this.scrollSpeed * .3;
		this.BGMountains.tilePosition.x -= this.scrollSpeed * .5;
		this.BGHills.tilePosition.x -= this.scrollSpeed;

		// TERRAIN & PICKUP SPAWNING
		{
			// spawn new platforms with decorations when delay is reached
			this.spawnDelay -= this.scrollSpeed;
			if(this.spawnDelay <= 0){
				// make a start platform
				startPlatform = this.platforms.create(game.world.width, 768, 'atlas', 'TempIslandStart');
				startPlatform.body.setSize(128, 240, 0, 16);
				startPlatform.body.immovable = true;
				// make it frictionless
				startPlatform.body.friction.x = 0;
				startPlatform.body.friction.y = 0;
				// Scroll it
				startPlatform.body.velocity.x = this.velocityScale * this.scrollSpeed;

				// spawn a random amount of inner platforms
				var i = 1;
				for(i = 1; i <= game.rnd.integerInRange(2, 5); i++){
					// spawn middle platform
					let spawnPosX = game.world.width+(i*128);
					platform = this.platforms.create(spawnPosX, 768, 'atlas', 'TempIslandMiddle');
					platform.body.setSize(128, 240, 0, 16);
					platform.body.immovable = true;
					// make it frictionless
					platform.body.friction.x = 0;
					platform.body.friction.y = 0;
					// Scroll it
					platform.body.velocity.x = this.velocityScale * this.scrollSpeed;

					// chance to spawn random decoration
					if(Math.random() <= 0.8){
						// spawn one of 3 decoration sizes
						let size = Math.random();
						var decoration = null;
						if(size <= .6){ // small 60% of the time
							// spawn one of 4 random decorations
							let type = game.rnd.integerInRange(1,4);
							if(type == 1){
								// spawn grass 1
								decoration = this.decor.create(spawnPosX + game.rnd.integerInRange(0,64), 712, 'atlas', 'Decor0001');
								decoration.body.velocity.x = this.velocityScale * this.scrollSpeed;
							}else if(type == 2){
								// spawn grass 2
								let decoration = this.decor.create(spawnPosX + game.rnd.integerInRange(0,64), 712, 'atlas', 'Decor0002');
								decoration.body.velocity.x = this.velocityScale * this.scrollSpeed;
							}else if(type == 3){
								// spawn flower 1
								let decoration = this.decor.create(spawnPosX + game.rnd.integerInRange(0,64), 712, 'atlas', 'Decor0003');
								decoration.body.velocity.x = this.velocityScale * this.scrollSpeed;
							}else if(type == 4){
								// spawn flower 2
								let decoration = this.decor.create(spawnPosX + game.rnd.integerInRange(0,64), 712, 'atlas', 'Decor0004');
								decoration.body.velocity.x = this.velocityScale * this.scrollSpeed;
							}
						}else if(size <= .80){ // medium 20% of the time
							// spawm one of 2 random decorations
							let type = game.rnd.integerInRange(1,2);
							if(type == 1){
								// spawn bush
								let decoration = this.decor.create(spawnPosX, 660, 'atlas', 'Bush');
								decoration.body.velocity.x = this.velocityScale * this.scrollSpeed;
							}else{
								// spawn berry bush
								let decoration = this.decor.create(spawnPosX, 660, 'atlas', 'BerryBush');
								decoration.body.velocity.x = this.velocityScale * this.scrollSpeed;
							}
						}else/*size == 3*/{ // large 20% of the time.
							// spawn a tree
							let decoration = this.decor.create(spawnPosX, 520, 'atlas', 'Tree');
							decoration.body.velocity.x = this.velocityScale * this.scrollSpeed;
						}
					}

					// chance to spawn pickup
					if(Math.random() <= .5){
						// spawn pickup
						var coin = this.pickups.create(spawnPosX, 512, 'atlas', 'Coin0001');
						coin.body.velocity.x = this.velocityScale * this.scrollSpeed;
						// adjust hit box
						coin.body.setSize(32,32,16,16);
						// animate it
						coin.animations.add('spin', Phaser.Animation.generateFrameNames('Coin', 1, 10, '', 4), 10, true);
						coin.animations.play('spin');	
					}

				}
				// spawn end platform
				endPlatform = this.platforms.create(game.world.width+(i*128), 768, 'atlas', 'TempIslandEnd');
				endPlatform.body.setSize(128, 240, 0, 16);
				endPlatform.body.immovable = true;
				// make it frictionless
				endPlatform.body.friction.x = 0;
				endPlatform.body.friction.y = 0;	
				// Scroll it
				endPlatform.body.velocity.x = this.velocityScale * this.scrollSpeed;

				// reset spawn delay
				this.spawnDelay = 1000;

			}
		}

		// TERRAIN & PICKUP DESPAWNING
		{
			//loop through all decorations and check if they should be destroyed
			for(i = 0; i < this.decor.children.length; i++){
				//Delete decorations that go off the edge
				if(this.decor.children[i].x <= -128){
					this.decor.children[i].destroy();
				}
			}

			// loop through all platforms and check if they need to be destroyed
			for(i = 0; i < this.platforms.children.length; i++){
				//Delete platforms that go off the edge
				if(this.platforms.children[i].x <= -128){
					this.platforms.children[i].destroy();
				}
			}

			// loop through all pickups and check if they need to be destroyed
			for(i = 0; i < this.pickups.children.length; i++){
				//Delete platforms that go off the edge
				if(this.pickups.children[i].x <= -128){
					this.pickups.children[i].destroy();
				}
			}
		}
		
		// update score
		if(!this.gameover){
		this.distance += this.scrollSpeed;
		}
		this.scoreText.text = 'Distance: ' + this.distance.toLocaleString() + ' cm\nScore: ' + this.score.toLocaleString();
		
		// change state when space is pressed
		if(game.input.keyboard.isDown(Phaser.Keyboard.Q) || this.poof.y >= game.world.height){
			// fade out music
			this.backgroundMusic.fadeOut(500);
			this.gameover = true;
		}
		// end game when music fades out
		if(this.backgroundMusic.volume == 0){
			game.state.start('Over', true, false, this.distance, this.score);
		}
	}
}

var Over = function(game){};
Over.prototype = {
	
	init: function(distance, score){
		// initialize variables passed from the Play state
		this.distance = distance;
		this.score = score;
	},

	preload: function() {
		// load assets into cache
			// not used at this time
	},
	
	create: function() {
		// place assets
		game.stage.backgroundColor = "#999999";
	
		// Place game title
		var style = {font: "150px Impact", fill: "#000000", align: "center", boundsAlignH: "center", boundsAlignV: "middle"};
		let text1 = this.game.add.text(0, 200, "Game Over\n", style);
		text1.setTextBounds(0, 0, game.world.width, 300);
		// Place Score
		style = {font: "125px Impact", fill: "#ffffff", align: "center", boundsAlignH: "center", boundsAlignV: "middle"};
		let text2 = this.game.add.text(0, 350, "Distance: " + this.distance.toLocaleString() + "cm\nScore: " + this.score.toLocaleString(), style);
		text2.setTextBounds(0, 0, game.world.width, 300);
		// Place prompt
		style = {font: "bold 75px Arial", fill: "#000000", align: "center", boundsAlignH: "center", boundsAlignV: "middle"};
		let text3 = this.game.add.text(0, 600, 'Press SPACE \nto play again', style);
		text3.setTextBounds(0, 0, game.world.width, 300);
	},

	update: function() {
		// run game loop
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('Play');
		}
	}
}

game.state.add('Boot', Boot);
game.state.add('Menu', Menu);
game.state.add('Play', Play);
game.state.add('Over', Over);
game.state.start('Boot');