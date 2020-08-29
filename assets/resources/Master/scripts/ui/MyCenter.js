

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.onenter = this.onenter.bind(this)
    },

    onenter() {
        this.node.PathChild('IDLb', cc.Label).string = me.IdentifykeySJ
        this.node.PathChild('NameLb', cc.Label).string = Utf8ToUnicode(me.Name)
        if (me.HeadUrl && me.HeadUrl != "")
            avatarMgr.setByURL(this.node.PathChild('avatarMask/sAvatar'), me.HeadUrl)
        this.node.PathChild('ScoreLb', cc.Label).string = me.IdentifykeyHD || 0.0
        this.node.PathChild('diaLb', cc.Label).string = me.Masonry || 0.0
    },

    btnEvent(evt, data) {
        cc.log(data)
        audioMgr.playSound('clickbutton')
        if (data == 'close') {
            UIMgr.close(this)
        } else if (data == 'dh') {
            UIMgr.show('DuihuanBox')
        } else if (data == 'zs') {
            UIMgr.show('ZhuanhuanBox')
        }
    },

    showHoutai() {
        UIMgr.show('WebViewBox', 'http://game1.golang.ltd/byadmin/login.html')
    },

});
