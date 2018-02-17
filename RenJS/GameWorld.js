
var gameWorld = {

  init: function (chapter) {
    console.log(chapter);
    console.log("Gameworld init");

    this.chapterAudio = {};
    this.chapterAudio.music = [];
    this.chapterAudio.sfx = [];
    this.chapter = chapter;
    this.splash = game.add.sprite(game.world.centerX, game.world.centerY, 'splash');
    this.splash.anchor.set(0.5);
    this.loadingBar = game.add.sprite(phaserConfig.loadingPosition[0],phaserConfig.loadingPosition[1] , "loading");
  },

  preload: function () {

    this.load.setPreloadSprite(this.loadingBar);

    //preload backgrounds
    _.each(RenJS.story.chIndex[this.chapter].backgrounds,function(background){
        
        game.load.image(background,RenJS.story.setup.backgrounds[background]);
    });

    // preload background music
    _.each(RenJS.story.chIndex[this.chapter].music,function(music){
      console.log("Inside per-chapter music loader");
      //console.log(filename);
      console.log(music)
      console.log(RenJS.story.setup.music[music]);
      this.chapterAudio.music.push(music);
      game.load.audio(music, RenJS.story.setup.music[music]);
    },this);

    //preload cgs
    //_.each(RenJS.story.setup.cgs,function(filename,background){
    //    game.load.image(background, filename);
    //});


    _.each(RenJS.story.chIndex[this.chapter].sfx,function(sfx){
        console.log("Inside per-chapter sfx loader");
        this.chapterAudio.sfx.push(sfx);
        game.load.audio(sfx, RenJS.story.setup.sfx[sfx]);

    },this);


    //preload sfx
    //_.each(RenJS.story.setup.sfx,function(filename,key){
    //    game.load.audio(key, filename);
    //},this);
    

    //preload characters
    _.each(RenJS.story.setup.characters,function(character,name){
        _.each(character.looks,function(filename,look){
            game.load.image(name+"_"+look, filename);
        });
    });
    if (RenJS.story.setup.extra){
        _.each(RenJS.story.setup.extra,function(assets,type){
            if (type=="spritesheets"){
                _.each(assets,function(file,key){
                    var str = file.split(" ");
                    game.load.spritesheet(key, str[0], parseInt(str[1]),parseInt(str[2]));
                });
            } else {
                _.each(assets,function(file,key){
                    // console.log("loading "+key+ " "+file+" of type "+type);
                    game.load[type](key, file);
                });
            }
        });
        
        
    }

    
  },

  create: function () {
    console.log("The thing in GameWorld"); 
    //debugger;
    var isPlaying = _.findWhere(game.sound._sounds, {isPlaying:true});
    if(isPlaying && typeof isPlaying != "undefined"){
      isPlaying.fadeOut(400);
      //_.findWhere(game.sound._sounds, {isPlaying:true}).fadeOut(400);
    }else{
        game.sound.stopAll();
    }
    RenJS.audioManager.load(function(){console.log("Audio LOAD");},this.chapterAudio);
    //RenJS.audioManager.init(function(){console.log("Audio Iniiiiit");},this.chapterAudio);
    this.startChapter();
    
    //game.sound._sounds[1].fadeOut(400);
    //var chapter = this.chapter;
    //RenJS.audioManager.init(function(chapter){

    //    console.log(chapter);
        
        

    //},this.chapterAudio, this.chapter);
  	
    //RenJS.start(this.chapter);
    
  },

  startChapter: function() {
    
    RenJS.gui.hideMenu("gametop", false);
    RenJS.storyManager.setupStory();
    RenJS.gui.init();
    RenJS.initInput();
    
    console.log("Gameworld is starting");
    RenJS.gui.showHUD();
    RenJS.start(this.chapter);
  }




}

