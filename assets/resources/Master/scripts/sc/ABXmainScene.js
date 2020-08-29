
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        audioMgr.playMusic('hall_background_music')
        eventMgr.on('onmessage', this, this.onMessage)
        this.node.onenter = this.onenter.bind(this)
        this.node.onleave = this.onleave.bind(this)
        this.refreshUser()
    },

    onMessage(data) {
        cc.log('xmain msg :::', data)
        connMgr.reset(false);
        if (data.Protocol == 10 && data.Protocol2 == 4) {
            if (data.Bsucc){
                sceneManager.show('AB_Loading', 'DSQ:dsq');
            }
        }
    },

    start() {
    },

    onenter: function (data) {
        this.model = 1
        window.mainscene = this
    },

    onleave: function () {
        cc.game.off(cc.game.EVENT_HIDE, this.node.onHide)
        cc.game.off(cc.game.EVENT_SHOW, this.node.onShow)
        eventMgr.off('onmessage', this)
    },

    BtnEvent(evt, data) {
        audioMgr.playSound('clickbutton')
        cc.log(data);
        if (data == 'mycenter') {
            UIMgr.show('ABMyCenter')
        }
        if (data == 'abgame') {
            sceneManager.show('AB_Loading', 'AB:PlayAB');
        }
        if (data == 'match') {
            // 发送协议
            let SendMsg = {
                Protocol: 10,
                Protocol2: 3,
                OpenID: me.OpenID,
            }
            client.send(SendMsg);
        }
    },

    refreshUser() {
        // if (me.Avatar && me.Avatar != "")  // Avatar = '2' ;
        //     avatarMgr.setByURL(this.node.PathChild('user/head_url'), Number(me.Avatar));
        // if (me.Wealth == 0) {
        //     this.node.PathChild('qianban/num_coin', cc.Label).string = '0.0 cr'
        // } else {
        //     this.node.PathChild('qianban/num_coin', cc.Label).string = me.Wealth + ' cr'
        // }
    },
});
