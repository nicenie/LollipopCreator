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

    },

    onLoad() {
        this.node.onenter = this.onenter.bind(this)
    },

    onMessage(data) {
        if (data.Protocol == 2 && data.Protocol2 == 47) {
            UIMgr.show("MessageBox", "兑换成功", 'ok', () => {
                duihuan.node.PathChild('goldlb', cc.Label).string = '0'
                duihuan.node.PathChild('EditBox', cc.EditBox).string = '0'
            })
            return
        }

        return
    },

    onenter() {
        eventMgr.on('onmessage', this, this.onMessage)
        this.dhcount = 0
        this.refreshGold()
        window.duihuan = this
    },

    sendDH() {
        if (this.dhcount <= 0) return
        // if (me.Masonry >= this.dhcount) {
            let C2GS_DuiHuanCoin = {
                Protocol: 2,
                Protocol2: 46,
                OpenID: me.OpenID,
                Masonry: this.dhcount,
            }
            client.send(C2GS_DuiHuanCoin)
        // } else {
        //     UIMgr.show("MessageBox", "钻石不够", 'ok', () => {
        //     })
        // }

    },

    refreshGold() {
        this.node.PathChild('goldlb', cc.Label).string = this.dhcount * 10
    },

    editEvent(evt, data) {
        if (data == 'end') {
            this.dhcount = parseInt(evt.string)
            this.refreshGold()
        }
    },

    btnEvent(evt, data) {
        cc.log(data)
        audioMgr.playSound('clickbutton')
        if (data == 'close') {
            this.close()
        } else if (data == 'dh') {
            this.sendDH()
        }
    },

    close() {
        window.duihuan = null
        UIMgr.close(this)
        eventMgr.off('onmessage', this)
    },

});
