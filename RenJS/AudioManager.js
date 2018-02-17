function AudioManager(){
    this.musicList = {};
    this.audioHist = [false, false, false];
    this.sfx = {};

    // this.muted = false;
    this.audioLoaded = false;

    this.current = {
        bgm : null,
        bgs : null
    }


    this.load = function(callback, toLoad, chapter){
        //stuff goes here
        console.log("maybe separate from init?");
        var audioList = [];
        console.log("inside audio manager LOAD");
        console.log(RenJS.story.setup.music);
        console.log(game.sound);

        console.log("Okay. so already loaded in sound._sounds are...");
        var alreadyInSounds = game.sound._sounds.map(a => a.key);
        console.log(alreadyInSounds);

        console.log("first, playing sounds.");
        var playingsounds = _.where(game.sound._sounds, {isPlaying: true});
        console.log(playingsounds);


        console.log("Woo, now we're going to load....");
        var chapterMusic = toLoad.music;
        console.log(chapterMusic);


        console.log("Find unloaded?");
        var unloadedMusic = _.difference(chapterMusic, alreadyInSounds);
        console.log(unloadedMusic);

        console.log("okies now check out the story thing");
        console.log(RenJS.story.setup.music);

        _.each(RenJS.story.setup.music,function(filename,key){
            console.log("hello now we are looping");
            if(_.contains(unloadedMusic, key)){
                console.log("Filename (unloaded) is ...."+filename+" Key is..."+key);
                console.log(this.musicList);
                RenJS.audioManager.musicList[key] = game.add.audio(key);
                console.log(game.sound._sounds);
            }else{
                console.log(key+" is already loaded");
            }

        callback(chapter);

        });





   }

    this.init = function(callback, toLoad, chapter){
        var audioList = [];
        console.log("inside audio manager init");
        console.log(RenJS.story.setup.music);
        console.log(game.sound);

        //This thing loops through all music in
        if(toLoad === false){
            console.log("You told AudioManager toLoad was false. We're not loading anything new.");
            callback(chapter);
        }else{
            if(typeof toLoad == "undefined"){
                console.log("You didn't tell AudioManager what to load, shame on you.");
                toLoad = RenJS.story.setup;
            }else{
                console.log("Good on you for telling AudioManager what to load, it's a simple creature and gets confused easily.");
            }

            console.log("bwuh?")

            var musicKeys = Object.keys(toLoad.music);
            var sfxKeys = Object.keys(toLoad.sfx);
            console.log(musicKeys);
            console.log(sfxKeys);
            var alreadyInSounds = game.sound._sounds.map(a => a.key);
            console.log(alreadyInSounds);
            var unloadedMusic = _.difference(musicKeys, alreadyInSounds);
            var unloadedSFX = _.difference(sfxKeys, alreadyInSounds);




            //var unloadedMusic = ._reject(musicKeys, function(sound){
            //    return ._findWhere(game.sound._sounds, {key:sound}) !== "undefined";
            //    });
            //console.log(unloadedMusic);


            _.each(RenJS.story.setup.music,function(filename,key){
                console.log(game.sound._sounds);
                console.log(key);

                 //_.findWhere(game.sound._sounds, {key:thismusic.key}).fadeOut(400);
                 //_.findWhere(game.sound._sounds, )
                
                if(_.contains(unloadedMusic,key)){
                    console.log(key+" is already loaded!");
                }else{
                    this.musicList[key] = game.add.audio(key);
                    console.log("adding "+this.musicList[key]+" to audioList!");
                    audioList.push(this.musicList[key]);                
                }
                console.log("audioList...");
                console.log(audioList);
                

                // music.onDecoded.add(function({
                //     console.log("adding music");
                //     console.log(key);
                //     console.log(music);
                //     this.musicList[key] = music;
                // }, this);
            },this);
            





            _.each(RenJS.story.setup.sfx,function(filename,key){
                if(_.contains(unloadedSFX, key)){
                    console.log(key+" is already loaded!");
                }else{
                    this.sfx[key] = game.add.audio(key);            
                    audioList.push(this.sfx[key]);
                }
                
            },this);




            console.log("about to decode");
            console.log("audioList...");
            console.log(audioList);
            //game.sound.setDecodedCallback(audioList, function(){

            //    console.log("Audio loaded");
            //    this.audioLoaded = true;
             //   callback();
            //}, this);


            //no actual checking has occured. :/
            callback(chapter);







        }


    }

    this.mute = function(){
        if (config.settings.muted){
            if (this.current.bgm) {
                this.musicList[this.current.bgm].play("",0,1,true);
            }
            if (this.current.bgs) {
                this.musicList[this.current.bgs].play("",0,1,true);
            }
        } else {
            if (this.current.bgm) {
                this.musicList[this.current.bgm].stop();
            }
            if (this.current.bgs) {
                this.musicList[this.current.bgs].stop();
            }
        }
        config.settings.muted = !config.settings.muted;
        
        // RenJS.resolve();
    }

    this.changeVolume = function(type,volume){
        console.log("changing value to "+volume);
        game.sound.volume = volume;
    }

    this.set = function (current) {
        if (current.bgm){
            this.play(current.bgm,"bgm",true,"FADE");
        }
        if (current.bgs){
            this.play(current.bgs,"bgs",true,"FADE");
        }

    }

    this.historyUpdate = function(musicname){
        console.log("Updating Audio History");
        this.audioHist.shift();
        this.audioHist.push(musicname);
        console.log(this.audioHist);
    }

    this.play = function(key,type,looped,transition){
        // debugger;
        console.log("in AudioManager PLAY");
        if (looped == undefined){
            looped = true;
        }

        //var oldAudio = this.musicList[key];
        



        console.log(this.audioHist);
        this.current[type] = true;
        //console.log(key);

        //fade bgm if already playing
        if (!config.settings.muted && this.current[type]) {
            console.log("In the first IF");
            
            if (transition == "FADE") {
                console.log("Gonna fade.");
                //console.log(_.findWhere(game.sound._sounds,{key:key}));
                thissong = _.findWhere(game.sound._sounds,{key:key});
                //debugger;
                console.log(thissong);
                console.log(thissong.isPlaying);

                //thissong.play("",0,1,looped);
                if(!thissong.isPlaying){
                    console.log("going to fade in I guess");
                    console.log(thissong);
                    thissong.fadeIn(1500,looped);
                    thissong.play("",0,1,looped);
                }else{
                    console.log("gonna fade out for a bit.");
                    thissong.fadeOut(750);
                    setTimeout(function() {
                     console.log("aaand fading back in.");
                     thissong.fadeIn(750);
                   }, 500); 

                }
                //_.findWhere(game.sound._sounds,{key:key}).play("",0,1,looped);
                this.historyUpdate(key);
                //this.musicList[key].fadeIn(1500,looped);
                //if (oldAudio) {
                //    oldAudio.fadeOut(1500);
                //};
            } else {
                console.log("not gonna fade");
                if (this.audioHist[1] != false) {
                    _.findWhere(game.sound._sounds,{key:this.audioHist[1]}).stop();
                }

                this.musicList[key].play("",0,1,looped);
                this.historyUpdate(key);
            }
        }

        if (type == "bgm") {
            RenJS.resolve();    
        }
    }

    this.stopAll = function(){
        this.stop("bgs","FADE");
        this.stop("bgm","FADE");
    }


    this.stop = function(type, transition){
        if (!this.current[type]){
            return;
        }
        //this should work???
        var oldAudio = this.musicList[this.audioHist[2]];
        this.current[type] = null;
        if (!config.settings.muted) {
            if (transition == "FADE") {
                oldAudio.fadeOut(1500);
            } else {
                oldAudio.stop();
            }
        }
        if (type == "bgm") {
            RenJS.resolve();    
        }
    }

    this.playSFX = function(key){
        if (this.audioLoaded && !config.settings.muted){
            // debugger;
            this.sfx[key].volume = config.settings.sfxv;
            this.sfx[key].play();    

        }
        
        // var fx = game.add.audio(key);
        // fx.onStop.add(function(){
        //     RenJS.resolve();
        // });
    }
}

