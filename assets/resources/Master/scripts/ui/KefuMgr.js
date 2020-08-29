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

    onLoad () {
        this.node.onenter = this.onenter.bind(this)
    },

    onenter(data){
        this.content.removeAllChildren()
        for (let k in data) {
            let info = data[k]
            let it = cc.instantiate(this.item)
            it.PathChild('wxlb',cc.Label).string = info.WeiXin
            // it.PathChild('namelb',cc.Label).string = Utf8ToUnicode(info.Name)
            it.parent = this.content
        }
    },


    close(){
        UIMgr.close('KefuBox');
    }

    // update (dt) {},
});
