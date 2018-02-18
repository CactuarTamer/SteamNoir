
var gameStartSplash = {

  init: function () {
    console.log("gameStartSplash init");
  },

  preload: function () {
    console.log("gameStartSplash Preload");
  //preload menu stuff  
   _.each(RenJS.gui.getAssets(),function(asset){
      // console.log(asset);
      if (asset.type == "spritesheet"){
          game.load.spritesheet(asset.key, asset.file, asset.w, asset.h);
      } else {
         game.load[asset.type](asset.key, asset.file);
      }
  });

 
    
  },

  create: function () {

    RenJS.storyManager.setupStory();
    RenJS.gui.init();
    RenJS.initInput();
    _.findWhere(game.sound._sounds, {key:"mainMusic"}).fadeOut(400);
    //
    RenJS.gui.showMenu("main");
    //game.sound._sounds[1].fadeOut(400);
    //RenJS.audioManager.init(function(){
        //RenJS.gui.showMenu("gametop"); 
        //RenJS.gui.showMenu("main");      
    //},false);

  	console.log("In gameStartSplash create, current menu is..."+RenJS.gui.currentMenu);
  }
}

