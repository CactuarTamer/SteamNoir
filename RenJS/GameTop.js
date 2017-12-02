
var gameTop = {

  init: function () {
    console.log("Gametop init");
  },

  preload: function () {
    console.log("Gametop Preload");
 
    
  },

  create: function () {

    RenJS.storyManager.setupStory();
    RenJS.gui.init();
    RenJS.initInput();
    _.findWhere(game.sound._sounds, {key:"mainMusic"}).fadeOut(400);
    //

    //game.sound._sounds[1].fadeOut(400);
    RenJS.audioManager.init(function(){
        RenJS.gui.showMenu("gametop");    
    },false);
  	console.log("Gametop Top");
  	console.log("In Gametop create, current menu is..."+RenJS.gui.currentMenu);
  }
}

