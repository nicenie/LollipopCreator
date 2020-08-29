class NewConnectionManager {

    constructor() {
        this.logined = false
        this.tries = 0
        this.asking = false
        this.elapsed = 0
        let n = 0
    }

    checkOffline(dt) {
        cc.log('22')
        if (!this.logined) {
            return
        }

        if (this.asking) {
            return
        }

        this.heartbeat()

        this.elapsed += Math.min(1, dt)
        if (this.elapsed < 4) {
            return
        }

        // cc.log("掉线了,马上重连", this.elapsed)
        if(window.circle){
            circle.isRelink = true;
            circle.reqReward = false;
        }
        cc.log("掉线了,马上重连")

        this.elapsed = 0

        if (this.tries < 10) {
            this.tries++
            client.reLogin()
            eventMgr.emit('connect-tip', this.tries)
            UIMgr.show('ConnectDialog', this.tries)
            cc.log("网络中断,拼命连接中.....", this.tries)
            // this.showCommonTip(this.tries)
        } else {
            cc.log("弹出重连ui", this.tries)
            this.asking = true
            eventMgr.emit('connect-dialog')
            UIMgr.show('ConnectDialog')
            // this.popAskDialog()
            // this.showCommonAsk()
        }
    }

    heartbeat() {
        client.send({
            Protocol: 7,
            Protocol2: 81,
            Uid: me.UID
        })
    }

    reset(logined) {
        eventMgr.emit('connect-tip', 0)

        this.elapsed = 0
        this.logined = logined
        this.tries = 0
        // this.tip.active = false
        cc.log("reset", this.tries)
        if (window.connectDialog) {
            window.connectDialog.close()
        }
        if (logined) {
            this.heartbeat()
        }
    }

    popAskDialog() {
        if (this.asking) {
            return
        }

        this.asking = true

        eventMgr.emit('connect-tip', 0)
        eventMgr.emit('connect-dialog')
    }

    reconnect() {
        this.asking = false
        this.tries = 1
        this.elapsed = 0
        client.reLogin()
        eventMgr.emit('connect-tip', this.tries)
        cc.log("网络中断,拼命连接中.....", this.tries)
    }

    showCommonTip(tries) {
        // this.tip.active = (tries > 0)
        // if (tries > 0) {
        //     this.tip.PathChild('val', cc.Label).string = `网络中断，拼命连接中...(${tries})`
        // }
        if (window.connectDialog) {
            window.connectDialog.close()
        }
    }

    showCommonAsk() {
        UIMgr.show("MessageBox", "游戏已断开连接 请重新连接", 'ok', () => {
            this.reconnect()
        })
    }
}
if (cc.sys.connMgr == null)
    cc.sys.connMgr = new NewConnectionManager()
window.connMgr = cc.sys.connMgr

