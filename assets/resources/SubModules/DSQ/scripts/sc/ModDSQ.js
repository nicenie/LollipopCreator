/**
 * 桌面总控制
 * 1. 游戏的所有的逻辑处理
 * 2. 行走逻辑，吃的逻辑的显示、认输的逻辑的显示
 * 3. 结算的界面的显示
 */
cc.Class({
	extends: cc.Component,
	properties: {
		fanpai: "",
		iturnID: 0,  // 轮到了谁
		iseatID: 0   //  座位ID
	},

	onLoad() {
		cc.log("开始游戏，创建对象池-------------------------------------");
		// 数据块 --------
		this._model = {
			bgTime: 0,
		}

		// 注册游戏场景
		globalSceneVarManager.register('dsq', this)
		// 注册消息
		eventMgr.on('onmessage', this, (data) => {
			msgMJAB.prototype.onMessage(data)
		})
		this.node.onHide = this.hide.bind(this)
		this.node.onShow = this.show.bind(this)
		cc.game.on(cc.game.EVENT_HIDE, this.node.onHide)
		cc.game.on(cc.game.EVENT_SHOW, this.node.onShow)
		this.node.onenter = this.onenter.bind(this)
		this.node.onleave = this.onleave.bind(this)
		return
	},

	/*
	   编辑器按钮（棋子按钮），绑定的函数
	   1. 发送固定的参数（1 - 16：位置信息等），需要客户端发送翻牌协议
	   2. 翻牌成功，服务器会返回相应的数据（1-16：大象、狮子、老虎等）
	*/
	BtnEvent(evt, data) {
		audioMgr.playSound('clickbutton')
		if (data == 'fanhui') {
			sceneManager.show('AB_Loading', 'AB_Xmain');
			return
		}

		if (data == 'bangzhu') {
			UIMgr.show('DSQ:rule')
			return
		}

		if (data == 'renshu') {
			// 发送翻盘协议
			let Sendmsg = {
				Protocol: 10,
				Protocol2: 9,
				OpenID: me.OpenID,
			}
			cc.log("------------认输协议", Sendmsg)
			client.send(Sendmsg)
			return
		}

		// 发送翻盘协议
		let Sendmsg = {
			Protocol: 10,
			Protocol2: 5,
			OpenID: me.OpenID,
			StrPos: data,
		}
		cc.log("------------发送玩家翻牌协议：", Sendmsg)
		this.fanpai = data
		if (this.iturnID != this.iseatID) return;
		client.send(Sendmsg)
		// if (data == "1") {
		// 	cc.loader.loadRes("SubModules/DSQ/data/ui/chess/bao2", cc.SpriteFrame, function (err, spriteFrame) {
		// 		cc.log("SubModules/DSQ/data/ui/chess/bao2", spriteFrame)
		// 		this.node.PathChild('chess/0_0', cc.Button).addComponent(cc.Sprite).spriteFrame = spriteFrame
		// 	}.bind(this))
		// }

	},
	//---------------------------------------------------------------------------------------

	// 游戏的初始化操作
	onenter: function (data) {
		cc.log("ab. on enter--------------------", data)
		this.initGame(data)
	},

	onleave: function () {
		cc.log("mj. on onleave ")
		cc.game.off(cc.game.EVENT_HIDE, this.node.onHide)
		cc.game.off(cc.game.EVENT_SHOW, this.node.onShow)
		eventMgr.off('onmessage', this)
		globalSceneVarManager.unregister('dsq')
	},

	hide: function () {
		this.IsBackGround = true
		this._model.bgTime = new Date().getTime()
	},

	show: function () {
	},

	// 初始化牌桌
	initGame(data) {
		if (data == null) return
		cc.log('加入房间协议+++++++++++++++++++++++++RoomData', data.RoomData)
		cc.log('加入房间协议+++++++++++++++++++++++++SeatData', data.RoomData.SeatData)
		if (data.RoomData.SeatData.length == 2) {
			cc.log('加入房间协议+++++++++++++++++++++++++Avatar', data.RoomData.SeatData[0].PlayerData.Avatar)
			cc.log('加入房间协议+++++++++++++++++++++++++Avatar', data.RoomData.SeatData[1].PlayerData.Avatar)
			// 显示头像信息
			avatarMgr.setByURL(this.node.PathChild('duizhan/player1/head'), Number(data.RoomData.SeatData[0].PlayerData.Avatar));
			avatarMgr.setByURL(this.node.PathChild('duizhan/player2/head'), Number(data.RoomData.SeatData[1].PlayerData.Avatar));
			// 名字
			this.node.PathChild('duizhan/player1/name', cc.Label).string = data.RoomData.SeatData[0].PlayerData.Name;
			this.node.PathChild('duizhan/player2/name', cc.Label).string = data.RoomData.SeatData[1].PlayerData.Name;
		}
		// 判断回合的数据
		if (data.RoomData.SeatData[0].PlayerData.OpenID == me.OpenID) {
			// 是我的回合
			this.node.PathChild('huihe/desc', cc.Label).string = "我的回合"
			this.iturnID = 0
			this.iseatID = 0
		} else {
			this.node.PathChild('huihe/desc', cc.Label).string = "对手的回合"
			this.iseatID = 1
		}
	},

	GameFanPai(data) {
		if (data == null) return
		cc.loader.loadRes("SubModules/DSQ/data/ui/chess/" + data.IChess, cc.SpriteFrame, function (err, spriteFrame) {
			this.node.PathChild('chess/' + data.StrPos, cc.Button).getComponent(cc.Sprite).spriteFrame = spriteFrame
		}.bind(this))
		// 修改另外一个数据的值，对手的回合
		if (data.OpenID != me.OpenID) {
			// 是我的回合
			this.node.PathChild('huihe/desc', cc.Label).string = "我的回合"
		} else {
			this.node.PathChild('huihe/desc', cc.Label).string = "对手的回合"
		}

		// 前端控制
		if (data.SeatID == 0) {
			this.iturnID = 1
		} else {
			this.iturnID = 0
		}
	},
	GameXingZou(data) {
	},

});


/*
cc.loader.loadRes("SubModules/MJ/data/ui/huase/" + name, cc.SpriteFrame, function (err, spriteFrame) {
			//调用新建的node的addComponent函数，会返回一个sprite的对象
			cc.log("SubModules/MJ/data/ui/huase/" + name)
			const sprite = this.numberNode.addComponent(cc.Sprite)
			//给sprite的spriteFrame属性 赋值
			sprite.spriteFrame = spriteFrame
			this.numberNode.setPosition(cc.v2(0, -12));
		}.bind(this))
*/