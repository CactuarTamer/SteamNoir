function SimpleGUI(meta){
    this.elements = meta ;

    this.getAssets = function(){
        var assets = _.map(this.elements.assets.images,function(asset,key){
            return {key:key, file:asset, type: "image"};
        });
        var list = _.map(this.elements.assets.spritesheets,function(asset,key){
            var e = asset.split(" ");
            return {key:key,file:e[0],w:parseInt(e[1]),h:parseInt(e[2]), type: "spritesheet"};
        });
        assets = _.union(assets,list);
        list = _.map(this.elements.assets.audio,function(asset,key){
            //dont't load duplicates of music
            
            return {key:key, file:asset, type: "audio"};
        });
        assets = _.union(assets,list);
        return assets;
    }

    // this.getSpriteInfo = function(spriteInfo){
    //     var info = spriteInfo.split(" ");
    //     return {x: parseInt(info[1]), y:parseInt(info[2]), key:info[0]};
    // }

    // this.getBoundingBoxInfo = function(bbInfo){
    //     var info = bbInfo.split(" ");
    //     return {x: parseInt(info[0]), y:parseInt(info[1]), w:parseInt(info[2]), h:parseInt(info[3])};
    // }

    this.init = function(){
        this.initHUD();
        this.initChoices();
        

        this.menus = {};
        _.each(this.elements.menus,function(menu,name){
            this.initMenu(name,menu);
        },this);
    }

    

    this.getTextStyle = function(textStyle){
        return _.extend(_.clone(config.defaultTextStyle),textStyle);
    }

    this.initHUD = function(){
        this.hud = {
            group: game.add.group()
        };
        // this.hud.group.alpha = 0;
        this.hud.area = [];
        _.each(this.elements.hud.area,function(area){
            var a = area.split(" ");
            // debugger;
            var x = parseInt(a[0])+240;
            var y = parseInt(a[1])+60;
            var w = parseInt(a[2])-(x+240);
            var h = parseInt(a[3])-(y+60);
            this.hud.area.push(new Phaser.Rectangle(x,y,w,h));
        },this);
        this.hud.group.visible = false;
        var messageBox = this.elements.hud.message;
        this.hud.messageBox = game.add.image(messageBox.position.x,messageBox.position.y,"messageBox",0,this.hud.group);
        var style = this.getTextStyle(messageBox.textStyle);

        // var messageBox = this.getSpriteInfo(this.elements.hud.message.box);
        // this.hud.messageBox = game.add.image(messageBox.x,messageBox.y,messageBox.key,0,this.hud.group);
        this.hud.messageBox.visible = false;
        // messageBox = this.getBoundingBoxInfo(this.elements.hud.message.text.boundingBox);
        // var textStyle = _.extend(config.defaultTextStyle,
        //     this.elements.hud.message.text,
        //     {wordWrap:true, wordWrapWidth:messageBox.w});
        
        // textStyle.wordWrap = true;
        // textStyle.wordWrap = true;
            
        // };
        // console.log(messageBox);
        this.hud.text = game.add.text(messageBox.textPosition.x,messageBox.textPosition.y, "", style,this.hud.group);
        this.hud.messageBox.addChild(this.hud.text);

        if (this.elements.hud.name){
            var name = this.elements.hud.name;
            this.hud.nameBox = game.add.image(name.position.x,name.position.y,"nameBox",0,this.hud.group);            
            this.hud.messageBox.addChild(this.hud.nameBox);
            var nameStyle = this.getTextStyle(name.textStyle);
            this.hud.name = game.add.text(0,0, "", nameStyle,this.hud.group);
            if (name.textBounds){
                this.hud.name.setTextBounds(name.textBounds.x, name.textBounds.y, name.textBounds.w, name.textBounds.h);
            } else {
                this.hud.name.setTextBounds(0,0, this.hud.nameBox.width, this.hud.nameBox.height);   
            }
            this.hud.nameBox.addChild(this.hud.name);
        }
        if (this.elements.hud.ctc) {
            var ctc = this.elements.hud.ctc;
            this.hud.ctc = game.add.sprite(ctc.position.x,ctc.position.y,"ctc");
            this.hud.ctc.animated = ctc.animated;
            if (this.hud.ctc.animated){
                this.hud.ctc.animations.add('click');

            }
            this.hud.messageBox.addChild(this.hud.ctc);
        }
        this.HUDButtons = this.initButtons(this.elements.hud.buttons,this.hud.group);   
    }

    this.initButtons = function(buttonsMeta,group){
        var buttons = {};
        _.each(buttonsMeta,function(btn,action){
            // console.log("Adding button");
            // console.log(btn);
            // button(x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group)
            if (!btn.frames){
                btn.frames = [0,1,0,1];
            }
            if(typeof btn.chapter != "undefined"){
                buttons[action] = game.add.button(btn.position.x,btn.position.y,btn.sprite,this.buttonActions["indexButton"],
                    {menu:this,chapter:btn.chapter},btn.frames[0],btn.frames[1],btn.frames[2],btn.frames[3],group);    
            }else{
                buttons[action] = game.add.button(btn.position.x,btn.position.y,btn.sprite,this.buttonActions[action],
                    this,btn.frames[0],btn.frames[1],btn.frames[2],btn.frames[3],group);
            }

        },this);
        return buttons;
    }

    this.initMenu = function(name,menu){
        this.menus[name] = {
            group: game.add.group()
        };
        // this.menus[name].group.alpha = 0;
        this.menus[name].group.visible = false;
        this.menus[name].background = game.add.image(0,0,name+"Background",0,this.menus[name].group);

        console.log("in initMenu, about to add music");

        if (typeof menu.music != "undefined" && !config.settings.muted){
            console.log("actually inside music-adder");
            var musicExists = _.find(game.sound._sounds, function(soundd){
                return soundd.key == menu.music;
            });
         
            //if already exists, set music object to pre-existing object
            if(typeof musicExists !== "undefined"){
                console.log("that music already exists.");
                //console.log(musicExists);
                this.menus[name].music = RenJS.audioManager.musicList[musicExists.name];
            }else{
                console.log(menu.music);
                console.log(typeof menu.music);
                RenJS.audioManager.musicList[menu.music] = game.add.audio(menu.music);
                this.menus[name].music = RenJS.audioManager.musicList[menu.music];
            }
                //this.menus[name].music = game.add.audio(menu.music);}
                //debugger;
                //RenJS.audioManager.musicList[this.menus[name].
                //debugger;
                //console.log(this.menus[name].music);
            this.menus[name].music.onDecoded.add(function(){
                this.menus[name].music.ready = true;
                RenJS.audioManager.current.bgm = true;
            }, this);           

        };


        this.menus[name].buttons = this.initButtons(menu.buttons,this.menus[name].group);
        this.initSliders(menu.sliders,this.menus[name].group);

    }

    this.initSliders = function(slidersMeta,group){
        _.each(slidersMeta,function(slider,prop){
            var sliderFull = game.add.image(slider.position.x,slider.position.y,slider.sprite,0,group);
            var sliderMask = game.add.graphics(slider.position.x,slider.position.y,group);
            sliderMask.beginFill(0xffffff);
            
            var currentVal = config.settings[prop];
            var limits = config.limits[prop];
            var maskWidth = sliderFull.width*(currentVal-limits[0])/(limits[1]-limits[0]);
            sliderMask.drawRect(0,0,maskWidth,sliderFull.height);
            sliderFull.mask = sliderMask;
            sliderFull.inputEnabled=true;
            sliderFull.limits = limits;
            sliderFull.prop = prop;
            sliderFull.events.onInputDown.add(function(sprite,pointer){
                var val = (pointer.x-sprite.x);
                sprite.mask.width = val;
                var newVal = (val/sprite.width)*(sprite.limits[1] - sprite.limits[0])+sprite.limits[0];
                this.sliderValueChanged[sprite.prop](newVal);
            }, this);
        },this);
    }

    

    this.sliderValueChanged = {
        textSpeed: function(newVal){
            config.settings.textSpeed = newVal;
        },
        autoSpeed: function(newVal){
            config.settings.autoSpeed = newVal;
        },
        bgmv: function(newVal){
            config.settings.bgmv = newVal;
            RenJS.audioManager.changeVolume("bgm",newVal);
        },
        sfxv: function(newVal){
            config.settings.sfxv = newVal;
        },
    }

    //menu actions
    this.buttonActions = {
        start: function(){
            RenJS.gui.hideMenu("main", false);
            //game.state.add("gameTop",gameTop);
            game.state.start("gameTop");
        },
        prologue: function(){
            console.log("prologue button firing...");
            //console.log(RenJS.gui.currentMenu);
            RenJS.gui.hideMenu("gametop", false);
            
            game.state.start('gameWorld',true,false,"prologue");

        },
        indexButton:function(){
            console.log(this.menu);
            console.log("index button firing...");

            //game.state.add('gameWorld',gameWorld);
            game.state.start('gameWorld',true,false,this.chapter);
        },
        load: function(){
            RenJS.gui.hideMenu("main", true);
            RenJS.load(0);
        },
        auto: RenJS.auto,
        skip: RenJS.skip,
        save: function (argument) {
            RenJS.save(0);
        },
        settings: function(){
            // RenJS.onTap();
            RenJS.pause();
            RenJS.resolve();
            RenJS.gui.showMenu("settings");
        },
        return: function(){
            RenJS.gui.hideMenu();  
            RenJS.unpause();
        },
        mute: function (argument) {
            RenJS.audioManager.mute();
        }
        
    }

    //show menu
    this.showMenu = function(menu){
        console.log("Showing menu... "+menu);
        RenJS.pause();
        this.previousMenu = this.currentMenu;
        this.currentMenu = menu;
        console.log("Current menu is..."+this.currentMenu);
        this.menus[menu].group.visible = true;
        console.log(this.menus[menu].group);
        game.add.tween(this.menus[menu].group).to( {alpha:1}, 750,null,true);

        if (this.menus[menu].music){
            var music = this.menus[menu].music;
            console.log("In show menu music handler");
            console.log(music);
            //debugger;
            if (music.ready){
                if(!music.isPlaying){
                    console.log("Music is ready, isPlaying is ..."+music.isPlaying);
                    music.fadeIn(1000);
                    RenJS.audioManager.historyUpdate(music.name);
                    music.volume = 1;
                }else{
                    console.log("music is ready, volume is... ");
                    console.log("gonna fade out for a bit.");
                    music.fadeOut(750);
                    setTimeout(function() {
                     console.log("aaand fading back in.");
                     music.fadeIn(750);
                     RenJS.audioManager.historyUpdate(music.name);
                   }, 500); 
                    //music.fadeTo(1000, 1);
                }
                
                    
            } else {
               setTimeout(function() {
                 console.log("music is not ready, fade in in a bit I guess");
                 music.fadeIn(1000);
                 RenJS.audioManager.historyUpdate(music.name);
               }, 1000); 
            }
            
        };        
    };

    //hide menu
    this.hideMenu = function(menu, goback = false){  
        if(!menu || typeof menu == null){
            var menu = this.currentMenu;
        }else {
            //menu is menu
        }
        console.log("Hiding menu... "+menu);
        console.log(this);
        var tween = game.add.tween(this.menus[menu].group).to( {alpha:0}, 400);
        tween.onComplete.add(function(){
            this.menus[menu].group.visible = false;
            this.currentMenu = null;
            if (this.previousMenu && goback){
                this.showMenu(this.previousMenu);
                console.log("Going back to previous menu!");   
            }else{
                this.currentMenu = menu;
            }
        },this);


        var thismusic = this.menus[menu].music;

        if (this.menus[menu].music && this.menus[menu].music.ready){
            //absolutely nothing works
            console.log("In music fader, fading...");
            console.log(thismusic);
            _.findWhere(game.sound._sounds, {key:thismusic.key}).fadeOut(400);
            thismusic.fadeOut(400);
        };   

        tween.start();
        
    }

    this.initChoices = function(type){
        this.hud.choices = {
            group: game.add.group(),
            map: {},
            textStyles:{
                choice:this.getTextStyle(this.elements.hud.choice.textStyle),
                interrupt:this.getTextStyle(this.elements.hud.interrupt.textStyle)
            },
        };
        // var choiceSprite = this.elements.hud.choice.box;
        // var dimensions = this.getSpriteInfo(this.elements.assets.spritesheets[choiceSprite]);
        // var choiceStyle = _.extend(config.defaultTextStyle,this.elements.hud.choice.text);
        // this.hud.choice = {
        //     normal: {
        //         box:choiceSprite

        //     w: dimensions.x,
        //     h: dimensions.y,
        //     style: choiceStyle,
        // }
    }

    //choice and interrupt buttons
    this.showChoices = function(choices){
        // this.hud.choices.boxes = []; 
        // this.hud.choices = {
        //     key: choiceSprite,
        //     w: dimensions.x,
        //     h: dimensions.y,
        //     style: choiceStyle,
        //     boxes: game.add.group()
        // }
        this.hideChoices();
        // var box = this.hud.choice;
        // var yOffset = (choices.length*box.h)/2;
        var position = this.elements.hud.choice.position;
        if (!position){
            position = {x:game.world.centerX};
            position.y = game.world.centerY - (choices.length*this.elements.hud.choice.separation)/2;
            position.anchor = {x:0.5,y:0};
        }

        

        _.each(choices,function(choice,index){
            console.log("Showing choice");
            console.log(choice);

            var y = position.y + this.elements.hud.choice.separation*index;
            var key = "choice";
            var frames = [0,1,0,1];
            var textStyle = this.hud.choices.textStyles.choice;
            
            if (choice.interrupt){
                key = "interrupt";
                textStyle = this.hud.choices.textStyles.interrupt;
                if (choice.remainingSteps==1){
                    frames = [2,3,2,3];
                }
            }
            var chBox = game.add.button(position.x, y, key, function(){
                RenJS.logicManager.choose(index,choice.choiceText);
            }, RenJS.logicManager, frames[0],frames[1],frames[2],frames[3],this.hud.choices.group);
            if (position.anchor){
                chBox.anchor.set(position.anchor.x,position.anchor.y);    
            }
            
            var chText = game.add.text(0,0, choice.choiceText, textStyle);
            var textPosition = this.elements.hud.choice.textPosition;
            if (!textPosition){
                textPosition = !position.anchor ? [0,0] : [-chBox.width*position.anchor.x,-chBox.height*position.anchor.y];
            }
            chText.setTextBounds(textPosition[0],textPosition[1], chBox.width, chBox.height);
            //chText.anchor.set(0.5,0.5);
            chBox.addChild(chText);
            this.hud.choices.map[choice.choiceId]=chBox;
            // debugger;
            // this.choiceBoxes.push(chBox);            
        },this);
    }

    this.changeToLastInterrupt = function(choiceId){
        if (this.hud.choices.map[choiceId]){
            this.hud.choices.map[choiceId].setFrames(2,3,2,3);
        }
    }

    this.hideChoice = function(choiceId){
        if (this.hud.choices.map[choiceId]){
            this.hud.choices.group.remove(this.hud.choices.map[choiceId]);
            delete this.hud.choices.map[choiceId];
        }
    }

    this.hideChoices = function(){
        this.hud.choices.map = {};
        this.hud.choices.group.removeAll(true);
    }

    this.clear = function(){
        //clears choices and text
        this.hideChoices();
        this.hideText();
    }

    this.showHUD = function(){
        this.hud.group.visible = true;
    }

    this.hideHUD = function(){
        this.hud.group.visible = false;
    }

    //dialogue and text
    this.showText = function(text,title,colour,callback){
        // console.log("Showing");
        if  (title && this.hud.nameBox) {            
            this.hud.name.clearColors();
            this.hud.name.addColor(colour,0);  
            this.hud.nameBox.visible = true; 
            this.hud.name.text = title;
        } else {
            this.hud.nameBox.visible = false; 
        }
        // if (this.hud.ctc){
        //     this.hud.ctc.visible = true;
        // }
        if (RenJS.control.skipping || config.settings.textSpeed < 10){
            this.hud.text.text = text;
            this.hud.messageBox.visible = true;
            RenJS.gui.showCTC();
            callback();
            return;
        }
        var textObj = this.hud.text;        
        textObj.text = "";
        var words = text.split("");
        var count = 0;
        var loop = setInterval(function(){
                     
            textObj.text += (words[count]);
            count++;
            if (count >= words.length){
                clearTimeout(loop);
                // debugger;
                RenJS.gui.showCTC();
                callback();
            }   
        }, config.settings.textSpeed);
        // this.hud.group.visible = true;
        this.hud.messageBox.visible = true;
        if (!RenJS.control.auto){
            RenJS.waitForClick(function(){
                clearTimeout(loop);
                textObj.text = text;
                RenJS.gui.showCTC();
                callback();
            });    
        }
        
    }

    this.hideText = function(){
        // console.log("hiding text");
        this.hud.messageBox.visible = false;
        this.hideCTC();
    }

    this.hideCTC = function(){
        if (this.hud.ctc){
            this.hud.ctc.visible = false;
            if (this.hud.ctc.animated){
                this.hud.ctc.animations.stop();
            } else {
                if (this.hud.ctc.tween){
                    this.hud.ctc.tween.stop();        
                }                
            }
        }
    }

    this.showCTC = function(){
        // console.log("Showing ctc");
        var ctc = RenJS.gui.hud.ctc;
        ctc.visible = true;
        if (ctc.animated) {
            ctc.animations.play('click', 15, true);
        } else {
            ctc.alpha = 0;
            ctc.tween = game.add.tween(ctc).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None,true,0,-1);
        }
    }

    this.ignoreTap = function(pointer){
        // Tap should be ignored if the player clicked on a hud button.
        var inside = _.find(RenJS.gui.hud.area,function(area){
            return area.contains(pointer.x,pointer.y);
        });
        return inside != null && inside != undefined;
    }
}