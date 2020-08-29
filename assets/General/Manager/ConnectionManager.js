cc.Class({
    extends: cc.Component,

    properties: {
        tip: cc.Node,
    },
    
    // 子游戏定义
    // [{"DT":"c4ca4238a0b923820dcc509a6f75849b"},
    // {"TDH":"e4da3b7fbbce2345d7772b0674a318d5"},
    // {"XZDD":"c81e728d9d4c2f636f067f89cc14862c"},
    // {"XLCC":"a87ff679a2f3e71d9181a67b7542122c"},
    // {"DDZ":"eccbc87e4b5ce2fe28308fd9f2a7baf3"},
    // {"XZDD_ccc":"6512bd43d9caa6e02c990b0a82652dca"},
    // {"AB":"c20ad4d76fe97759aa27a0c99bff6710"}]

    onLoad: function () {
        window.connMgr = this
        this.logined = false
        this.tries = 0
        this.asking = false
        this.elapsed = 0
        this.isreconnect = false
        this.tip.active = false
        let n = 0
        // this.schedule((dt) => {
        //     this.checkOffline(dt)
        // }, 0.5, 1e7, 0)
    },

    checkOffline: function (dt) {
        // 是否会登录
        if (!this.logined) {
            return
        }
        // 是否是弹框
        if (this.asking) {
            return
        }
        // 心跳
        this.heartbeat()
        this.elapsed += Math.min(0.5, dt)
        if (this.elapsed < 10) {
            return
        }
        cc.log("掉线了,马上重连", this.elapsed)
        this.elapsed = 0
        if (this.tries < 10) {
            this.tries++
            client.reLogin()
            eventMgr.emit('connect-tip', this.tries)
            cc.log("网络中断,拼命连接中.....", this.tries)
            this.showCommonTip(this.tries)
        } else {
            cc.log("弹出重连ui", this.tries)
            this.popAskDialog()
            this.showCommonAsk()
        }
    },

    heartbeat() {
       // if (this.isreconnect) return
        client.send({
            Protocol: 7,
            Protocol2: 81,
            Uid: me.UID
        })
    },

    reset(logined) {
        eventMgr.emit('connect-tip', 0)
        this.isreconnect = false
        this.elapsed = 0
        this.logined = logined
        this.tries = 0
        this.tip.active = false
        cc.log("reset", this.tries)
        if (logined) {
            this.heartbeat()
        }
    },

    popAskDialog() {
        if (this.asking) {
            return
        }
        this.asking = true
        eventMgr.emit('connect-tip', 0)
        eventMgr.emit('connect-dialog')
    },

    reconnect: function () {
        this.asking = false
        this.tries = 1
        this.elapsed = 0
        client.reLogin()
        eventMgr.emit('connect-tip', this.tries)
        cc.log("网络中断,拼命连接中.....", this.tries)
    },

    showCommonTip: function (tries) {
        this.tip.active = (tries > 0)
        if (tries > 0) {
            this.tip.PathChild('val', cc.Label).string = `网络中断，拼命连接中...(${tries})`
        }
    },

    showCommonAsk: function () {
        this.tip.active = false
        UIMgr.show("MessageBox", "游戏已断开连接 请重新连接", 'ok', () => {
            cc.audioEngine.stopAll()
            cc.game.restart()
        })
    },
});
