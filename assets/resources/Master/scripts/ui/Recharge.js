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
        content: cc.Node,
        czitem: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        eventMgr.on('onmessage', this, this.onMessage)
        this.node.onenter = this.onenter.bind(this)
    },

    onenter(data) {

        this.sendGold = 0
        this.infodata = data
        this.changestate(0)
        this.refreshCZ(data.ShopList)
        if (data.Itype == 1) {

        } else {
            this.node.PathChild('qtbtn1').active = false
            this.node.PathChild('qtbtn').active = false
        }

    },

    refreshCZ(data) {
        this.content.removeAllChildren()
        for (let k in data) {
            let info = data[k]
            if (info.ID != 1) {
                let item = cc.instantiate(this.czitem)
                item.CoinNum = info.CoinNum
                item.EWM_Url = info.EWM_Url
                item.parent = this.content

                item.PathChild('rmblb', cc.Label).string = info.CoinNum
            } else {
                this.node.PathChild('dllayer/tijiaobtn').EWM_Url = info.EWM_Url
                this.node.PathChild('dllayer/tijiaobtn').CoinNum = info.CoinNum
            }
        }
    },

    onMessage(data) {

    },

    changestate(state) {
        if (state == 0) {
            this.node.PathChild('dlbtn').active = false
            this.node.PathChild('dlbtn1').active = true
            this.node.PathChild('qtbtn1').active = false
            this.node.PathChild('qtbtn').active = true

            this.node.PathChild('dllayer').active = true
            this.node.PathChild('qtlayer').active = false
            // this.node.PathChild('edbox').active = false
            // this.node.PathChild('textbg').active = true
            this.sendGold = 1800

        } else {
            this.node.PathChild('dlbtn').active = true
            this.node.PathChild('dlbtn1').active = false
            this.node.PathChild('qtbtn1').active = true
            this.node.PathChild('qtbtn').active = false
            // this.node.PathChild('edbox', cc.EditBox).enabled = true
            // this.node.PathChild('edbox', cc.EditBox).string = ''

            this.node.PathChild('dllayer').active = false
            this.node.PathChild('qtlayer').active = true
            this.sendGold = 0
        }
    },

    close() {
        audioMgr.playSound('clickbutton')
        eventMgr.off('onmessage', this)
        UIMgr.close('RechargeBox');
    },

    btnEvent(evt, data) {
        audioMgr.playSound('clickbutton')
        if (data == 'tijiao') {
            this.sendMsg(evt.currentTarget.EWM_Url)
        } else if (data == 'daili') {
            this.changestate(0)
        } else if (data == 'qita') {
            this.changestate(1)
        } else if (data == 'close') {
            this.node.PathChild('secondLayer').active = false
        }
    },

    czItemEvent(evt) {
        audioMgr.playSound('clickbutton')
        cc.log('evt')
        this.sendMsg(evt.currentTarget.EWM_Url)
    },

    sendMsg(url) {
        this.refreshSecond(url)
    },

    refreshSecond(url) {
        this.node.PathChild('secondLayer').active = true
        avatarMgr.setByURL(this.node.PathChild('secondLayer/msp'), url)
    },

    editEvent(evt, data) {
        if (data == 'end') {
            this.sendGold = this.node.PathChild('edbox', cc.EditBox).string
            cc.log('send', this.sendGold)
        }
    },

    // update (dt) {},
});
