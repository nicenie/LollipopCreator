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
        content:cc.Node,
        item:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.onenter = this.onenter.bind(this)
    },

    onenter(data) {
        let count = 0
        this.content.removeAllChildren()
        for (let k in data) {
            let info = data[k]
            let it = cc.instantiate(this.item)
            if(info.Itype == 1){
                it.PathChild('wsp').active = true
                it.PathChild('wscorelb').active = true
                it.PathChild('wscorelb',cc.Label).string = info.Coin
            }else{
                it.PathChild('lsp').active = true
                it.PathChild('lscorelb').active = true
                it.PathChild('lscorelb',cc.Label).string = info.Coin
            }
            
            it.PathChild('namelb',cc.Label).string = Utf8ToUnicode(info.Name) 
            it.PathChild('sclb',cc.Label).string = Utf8ToUnicode(info.ChangCi) 
            it.parent = this.content
            count++
        }
        
        this.content.height = count*60
    },

    close(){
        audioMgr.playSound('clickbutton')
        UIMgr.close('RecordBox');
    }


    // update (dt) {},
});
