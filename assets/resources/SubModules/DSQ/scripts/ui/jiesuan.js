
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.node.onenter = this.onenter.bind(this)
    },

    onenter(data) {
        this.refresh(data);
    },
    
    // 解析数据操作
    refresh(data) {
        // 显示结算数据信息
        cc.log("-------显示结算数据信息:", data)
        // PlayerWin  *Player_DSQ.PlayerData // 胜利的玩家
        // PlayerFail *Player_DSQ.PlayerData // 失败的玩家
        // GameName   string                 // 游戏的名字
        // WinSeatID  int                    // 胜利人的位置信息，0或者1的位置信息
        // Score      int                    // 胜利人获取的分数信息
        avatarMgr.setByURL(this.node.PathChild('s_l/kuang/head'), 1);
        this.node.PathChild('s_l/name_kuang/name', cc.Label).string = me.Name;
    },

    BtnEvent(evt, data) {
        audioMgr.playSound('clickbutton')
        if (data == 'rule') {
            UIMgr.show('DSQ:rule')
            return
        }
        if (data == 'tuichu') {
            sceneManager.show('AB_Loading', 'AB_Xmain');
        }
    },
});
