// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        myMusic:cc.Node,
        mySound:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    close(){
        UIMgr.close('SettingBox');
    },

    sliderEvent(evt,data){
         if(data=='yinyue'){
            // this.myMusic.cc.ProgressBar.progress = evt.progress;
            this.myMusic.getComponent(cc.ProgressBar).progress = evt.progress;
            audioMgr.musicVolume = evt.progress
         }

         if(data=='yinxiao'){
            // this.myMusic.cc.ProgressBar.progress = evt.progress;
            this.mySound.getComponent(cc.ProgressBar).progress = evt.progress;
            audioMgr.soundVolume = evt.progress
         }
    },

    backGameEvent(){
        cc.game.end();
    },

    // update (dt) {},
});
