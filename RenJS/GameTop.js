
var gameTop = {

  init: function () {
    console.log("Gametop init");
  },

  preload: function () {
    console.log("Gametop Preload");
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
    console.log("The thing in GameTop");
    //debugger;
    var isPlaying = _.findWhere(game.sound._sounds, {isPlaying:true});
    if(isPlaying && typeof isPlaying != "undefined"){
      isPlaying.fadeOut(400);
      //_.findWhere(game.sound._sounds, {isPlaying:true}).fadeOut(400);
    }else{
      game.sound.stopAll();
    }
    
    //
    RenJS.gui.showMenu("gametop");
    //game.sound._sounds[1].fadeOut(400);
    //RenJS.audioManager.init(function(){
    //    RenJS.gui.showMenu("gametop"); 
    //    //RenJS.gui.showMenu("main");   
    //},false);
  	console.log("Gametop Top");
  	console.log("In Gametop create, current menu is..."+RenJS.gui.currentMenu);
  }
}

