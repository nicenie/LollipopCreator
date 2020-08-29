
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.node.onenter = this.onenter.bind(this)
    },

    onenter() {
        cc.log("------------------------------:onenter,", me);
        // 个人中心的数据的重置
        this.node.PathChild('playername', cc.Label).string = Utf8ToUnicode(me.Nickname);
        this.node.PathChild('id', cc.Label).string = me.UID;
        this.node.PathChild('num_coin', cc.Label).string = me.Wealth + ' cr';
        if (me.Avatar && me.Avatar != "")  // Avatar = '2' ;
            avatarMgr.setByURL(this.node.PathChild('head/head_url'), Number(me.Avatar));
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
});
