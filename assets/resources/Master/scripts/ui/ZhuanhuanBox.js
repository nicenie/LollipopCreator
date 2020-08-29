cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        
        this.zscount = 0
        this.friendid = 0
        this.node.onenter = this.onenter.bind(this)
    },

    onMessage(data) {
        if (data.Protocol == 2 && data.Protocol2 == 45) {
            UIMgr.show("MessageBox", "赠送成功", 'ok', () => {
                // duihuan.node.PathChild('goldlb', cc.Label).string = '0'
                // duihuan.node.PathChild('EditBox', cc.EditBox).string = '0'
            })
            return
        }

        if (data.Protocol == 2 && data.Protocol2 == 51) {
            // UIMgr.show("MessageBox", "查询成功", 'ok', () => {
            //     // duihuan.node.PathChild('goldlb', cc.Label).string = '0'

            // })
            zhuanhuan.node.PathChild('namelb', cc.Label).string = Utf8ToUnicode(data.Name)
            return
        }

        return
    },

    onenter() {
        eventMgr.on('onmessage', this, this.onMessage)
        this.zscount = 0
        this.friendid = 0
        this.node.PathChild('namelb', cc.Label).string = ''
        this.node.PathChild('IDEditBox', cc.EditBox).string = ''
        this.node.PathChild('ZSEditBox', cc.EditBox).string = ''
        window.zhuanhuan = this
    },

    sendZS() {
        if (this.zscount <= 0 || this.friendid <= 0) return
        // if (me.Masonry >= this.zscount) {
            let C2GS_SongCoin = {
                Protocol: 2,
                Protocol2: 44,
                OpenID: me.OpenID,
                OpenIDFriend: '' + this.friendid,
                CoinNum: this.zscount,
            }
            client.send(C2GS_SongCoin)
        // } else {
        //     UIMgr.show("MessageBox", "钻石不够", 'ok', () => {
        //     })
        // }
    },

    sendGETNAME(id) {
        if (id == '') return
        let C2GS_GetNameByID = {
            Protocol: 2,
            Protocol2: 50,
            ID: id,
        }
        client.send(C2GS_GetNameByID)
    },

    editEvent(evt, data) {
        if (data == 'idend') {
            this.friendid = parseInt(evt.string)
            this.sendGETNAME(evt.string)
        } else if (data == 'zsend') {
            this.zscount = parseInt(evt.string)
        }
    },

    btnEvent(evt, data) {
        cc.log(data)
        audioMgr.playSound('clickbutton')
        if (data == 'close') {
            this.close()
        } else if (data == 'zs') {
            this.sendZS()
        }
    },

    close() {
        window.zhuanhuan = null
        UIMgr.close(this)
        eventMgr.off('onmessage', this)
    },

});
