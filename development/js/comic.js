var Comic = function(game){};

//display story comic for a little bit more context
Comic.prototype = {

  create: function() {

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
      game.state.start('Controls');
      this.selectNoise.play('', 0, 1, false);
  }

}
