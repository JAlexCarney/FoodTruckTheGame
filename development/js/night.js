var Night = function(game){};
Night.prototype = {

  preload: function() {
    //load newspaper atlas

  },

  create: function() {
    //create newspaper and divider stuff

      //check which day it is
        //spawn whichever relative newspaper
        //if day === x;
            //add news paper for day x

      //create divider
      this.divider = this.add.sprite(0, 502, 'atlas', 'divider');
      this.physics.arcade.enable(this.divider);
  		this.divider.enableBody = true;
  		this.divider.body.immovable = true;

    //we should probably have a temp button to go on to next day
    //if we want to test switching between day & night
      //start play state

    //have a menu button to go back (?)
      //as of now, send player back to menu
      //will have some sort of warning for players that they may restart
      //the entire game if they go back to menu.
      this.menuButton = game.add.sprite(405, 100,'atlas', 'button_menu');
  		this.menuButton.inputEnabled = true;
  		this.menuButton.events.onInputDown.add(backToMenu, this);

      //as of now, go back to menu with no warning
      var backToMenu() = function() {
        //start the menu state
        game.state.start('Menu');
      }

      //function for when player clicks on the menu button
      // var openMenuWarning = function() {
        //spawn new textbox with warning
           //if player clicked on yes
              //go back to menu state
          // else, destroy this entire menu warning
      // }
  },

  update: function() {

  }

}
