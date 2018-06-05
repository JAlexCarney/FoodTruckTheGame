var Comic = function(game){};

//display story comic for a little bit more context
Comic.prototype = {

  create: function() {

    //set the comic as seen
    hasSeenComic = true;

    //load UIselect noise
    this.selectNoise = game.add.audio('select');

    //set background color for this state
		game.stage.backgroundColor = "#ffffff";

    //add comic image
    game.add.image(0, 0, 'comic');

    //add play button and go to controls state afterwards
    let playButton = game.add.sprite(750, 900,'atlas', 'button_play');
    playButton.inputEnabled = true;
    playButton.events.onInputDown.add(this.startPlay, this);
  },
  //activated when player clicks on play button
  startPlay: function() {
      //if haven't seen controls, take them there!
    if (!hasSeenControls) {
      game.state.start('Controls');
      this.selectNoise.play('', 0, 1, false);
    } else {
      //else start the game
      game.state.start('Play');
      this.selectNoise.play('', 0, 1, false);
   }
  }
}
