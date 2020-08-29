cc.Class({
    extends: cc.Component,

    properties: {
        firstly: cc.Node,
        sedly: cc.Node,
        btnly: cc.Node,
        typely: cc.Node,
        backbtn: cc.Node,

        idlb: cc.Label,

        headPerfab: cc.Node,
        addPerfab: cc.Node,

        content1: cc.Node,
        content2: cc.Node,
    },

    onLoad() {
        this.node.onenter = this.onenter.bind(this)
        // this._GoldList = {
        //     'pt': [1500, 3000, 7000],
        //     'wx': [3000, 7000, 15000],
        // }
    },

    onMessage(data) {
        if (data.Protocol == 4 && data.Protocol2 == 2) {
            clubbox.refreshLayer(2, data)
        }

        if (data.Protocol == 4 && data.Protocol2 == 4) {
            //广播退出
            // clubbox.refreshSedLayer(data.RoomData)
        }

        if (data.Protocol == 4 && data.Protocol2 == 6) {
            //join player
            clubbox.refreshSedLayer(data.RoomData)
        }

        if (data.Protocol == 4 && data.Protocol2 == 7) {
            //开始游戏
            data.julebu = true
            cc.log('开始游戏data:::', data)
            sceneManager.show('Loading', 'MJ:PlayMJ', data)
        }
        return
    },

    onenter(data) {
        eventMgr.on('onmessage', this, this.onMessage)
        this.sendID = ''
        this.isSelfSit = false
        this.TypeID = 'pt'
        this.node.PathChild('firstly/edbox', cc.EditBox).string = ''
        if (data.ClubDesc != '') {
            this.node.PathChild('firstly/deslb', cc.RichText).string = Utf8ToUnicode(data.ClubDesc) + '   ID:' + data.ClubID
        } else {
            this.node.PathChild('firstly/deslb', cc.RichText).string = ''
        }

        //默认第一个
        this.refreshLayer(1)
        window.clubbox = this
    },

    refreshLayer(tag, data) {
        this.curTag = tag
        if (tag == 1) {
            this.firstly.active = true
            this.sedly.active = false
            this.btnly.active = false
            this.typely.active = false
            this.backbtn.active = false
        } else if (tag == 2) {
            //界面
            this.firstly.active = false
            this.sedly.active = false
            this.btnly.active = false
            this.typely.active = true
            this.backbtn.active = true
            this.netData = data
        } else if (tag == 3) {
            //界面
            this.firstly.active = false
            this.sedly.active = false
            this.btnly.active = true
            this.typely.active = false
            this.backbtn.active = true
            this.btnly.PathChild('ctlay/chuji/txlb', cc.Label).string = `最低入场${globalCfg._GoldList[this.TypeID][0]}金币`
            this.btnly.PathChild('ctlay/zhongji/txlb', cc.Label).string = `最低入场${globalCfg._GoldList[this.TypeID][1]}金币`
            this.btnly.PathChild('ctlay/gaoji/txlb', cc.Label).string = `最低入场${globalCfg._GoldList[this.TypeID][2]}金币`
            this.netData = data
        } else {
            //房间界面
            this.firstly.active = false
            this.sedly.active = true
            this.btnly.active = false
            this.typely.active = false
            this.backbtn.active = true

            this.idlb.string = data.ClubID
            this.ClubID = data.ClubID
            this.refreshSedLayer(data.RoomData)
        }
    },

    refreshSedLayer(RoomData) {
        for (let k = 1; k < 3; k++) {
            let idx = '' + k + '|' + this.GoldID + '|' + this.TypeID
            let itemData = RoomData[idx]
            let contentNode = this.content2
            if (k == 1) {
                contentNode = this.content1
            }
            contentNode.removeAllChildren()
            for (let key in itemData.seatdataclubst) {
                let info = itemData.seatdataclubst[key]
                let it = null
                if (info.playerdata.openid == '') {
                    it = cc.instantiate(this.addPerfab)
                    // it.parent = contentNode
                } else {
                    if (info.playerdata.openid == me.OpenID) {
                        this.isSelfSit = true
                        this.selfDeskID = idx
                        this.selfSeatID = key
                    }
                    it = cc.instantiate(this.headPerfab)
                    if (info.playerdata.headurl && info.playerdata.headurl != "")
                        avatarMgr.setByURL(it.PathChild('mask/头像'), info.playerdata.headurl)
                    // it.parent = contentNode
                }
                it.DeskID = idx
                it.SeatID = key
                // it.position.y = 0
                it.parent = contentNode
            }
        }
    },

    editBoxEvent(evt, data) {
        if (data == 'end') {
            this.sendID = this.node.PathChild('firstly/edbox', cc.EditBox).string
        }
    },

    goldEvent(evt, data) {
        this.GoldID = data
        this.refreshLayer(4, this.netData)
    },

    typeEvent(evt, data) {
        this.TypeID = data
        this.refreshLayer(3, this.netData)
    },

    backEvent() {
        this.curTag--
        if (this.curTag == 3 && this.isSelfSit == true) {
            UIMgr.show('MessageBox', '确定退出排队吗?', 'ok|cancel', (op) => {
                if (op == 'ok') {
                    let C2GS_OutProto = {
                        Protocol: 4,
                        Protocol2: 3,
                        ClubID: this.ClubID,
                        OpenID: me.OpenID,
                        DeskID: this.selfDeskID,
                        SeatID: this.selfSeatID,
                    }
                    client.send(C2GS_OutProto)
                    this.isSelfSit = false
                    this.refreshLayer(this.curTag, this.netData)
                }else{
                    this.curTag++
                }
            })
        } else {
            this.refreshLayer(this.curTag, this.netData)
        }
    },

    checkEvent() {
        if (this.sendID == '') return
        let C2GM_Send_Club_ID = {
            Protocol: 4,
            Protocol2: 1,
            OpenID: me.OpenID,
            ClubID: this.sendID,
        }
        client.send(C2GM_Send_Club_ID)
    },

    enterEvent(evt, data) {
        let C2GM_EntryClubRoom = {
            Protocol: 4,
            Protocol2: 5,
            ClubID: this.ClubID,
            OpenID: me.OpenID,
            DeskID: evt.currentTarget.DeskID,
            SeatID: evt.currentTarget.SeatID,
        }
        client.send(C2GM_EntryClubRoom)
    },

    realClose() {
        window.clubbox = null
        UIMgr.close(this)
        eventMgr.off('onmessage', this)
    },

    close() {

        if (this.isSelfSit == true) {
            UIMgr.show('MessageBox', '确定退出排队吗?', 'ok|cancel', (op) => {
                let agreeBool = false
                if (op == 'ok') {
                    let C2GS_OutProto = {
                        Protocol: 4,
                        Protocol2: 3,
                        ClubID: this.ClubID,
                        OpenID: me.OpenID,
                        DeskID: this.selfDeskID,
                        SeatID: this.selfSeatID,
                    }
                    client.send(C2GS_OutProto)
                    this.isSelfSit = false
                    this.realClose()
                }
            })
        } else {
            this.realClose()
        }
    }

});
