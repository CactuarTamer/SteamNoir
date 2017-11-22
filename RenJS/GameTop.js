
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
    RenJS.audioManager.init(function(){
    	RenJS.gui.hideMenu();
        RenJS.gui.showMenu("gametop");    
    });
  	console.log("Gametop Top");
  	console.log("In Gametop create, current menu is..."+RenJS.gui.currentMenu);
  }
}

