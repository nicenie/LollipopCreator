class Client {
	constructor() {
		this.latestMessages = []
		this.cbs = []
		this.cbIdx = 1
		this.user = null
		this.passwd = null
	}

	onMessage(data) {
		cc.log('svr data888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888', data)
		if (data.Protocol == 7 && data.Protocol2 == 81) {
			// cc.log("------------------------datadatadatadatadata82828288282828---", data);
		} else {
			// 发送消息，可以认为是派发消息到监听组件的模块
			// cc.log("------------------------999999999999999999999999999999999999999999999999---", data);
			eventMgr.emit('onmessage', data)
		}
	}

	// 登陸協議
	login(ServerData, gameTocken) {
		//let url = 'ws://' + ServerData + '/DSQ?data={1}'; // lollipopGo框架的
		let url = 'ws://' + ServerData+"/?{'new':3}";      // leaf 框架的
		this.createWS(url, () => {
			globalCfg.gameServer = url;
			let realargs = {
				Protocol: 10,
				Protocol2: 1,
				Tocken: gameTocken,
			}
			//this.send(realargs)  // LollipopGo框架的
			let senn = {
				C2G_Player_Login:realargs  // leaf 框架的
			}
			this.send(senn)
		})
	}

	guestLogin() {
		this.createWS(`${globalCfg.gameServer}`)
	}

	reLogin() {
		this.send({
			Protocol: 3,
			Protocol2: 2,
			OpenID: me.OpenID
		})
	}

	/*
	CONNECTING	0	连接还没开启。
	OPEN	1	连接已开启并准备好进行通信。
	CLOSING	2	连接正在关闭的过程中。
	CLOSED	3	连接已经关闭，或者连接无法建立
	*/
	createWS(url, cb) {
		cc.log("createWS start...")
		if (this._socket) {
			this._socket.close()
			cc.log("close old socket")
		}
		this.cbs = []
		cc.info("websocket connect:", url)
		let ws = new WebSocket(url)
		this._socket = ws
		ws.binaryType = "arraybuffer"
		ws.onopen = (event) => {
			cc.log("onopen")
			if (ws != this._socket) {
				return
			}
			if (cb)
				cb()
			connMgr.elapsed = 0
			connMgr.showCommonTip(0)
			connMgr.reset(true);
		}

		ws.onmessage = (event) => {
			if (ws == this._socket) {
				let data = JSON.parse(base64decode(event.data))
				if (data.route != 'MsgHandlers.ping') {
					if (data.Protocol != 3 && data.Protocol2 != 1 || globalCfg.showHB)
						cc.log("response text msg: " + base64decode(event.data))
					this.latestMessages.push(data)
					if (this.latestMessages.length > 20) {
						this.latestMessages.shift()
					}
				}
				connMgr.elapsed = 0
				try {
					this.onMessage(data)
				} catch (err) {
					if (ut.isBrowser()) {
						cc.error(err)
					} else {
						ut.httpRequest({
							url: globalCfg.logServer,
							method: 'POST',
							params: {
								username: me.nickname || 'empty',
								msg: err.message || '',
								name: err.name || '',
								pkg: data,
								latestPKGs: this.latestMessages || '',
								stack: err.stack || '',
								err: err,
							},
						})
					}
				}
			}
		}

		ws.onerror = (event) => {
			// ut.tip("网络出错,请检查你的网络!")
			cc.log("ws error", event)
			cc.log("onerror", event)
			connMgr.isreconnect = true
		}

		ws.onclose = (event) => {
			cc.log("onclose", event)
			if (ws == this._socket) {
				cc.log("onclose cur")
				cc.log("ws close", event)
				this._socket = null
				if (connMgr.logined) {
					connMgr.isreconnect = true
					// connMgr.reconnect()
				}
			}
		}
	}

	pushCb(cb) {
		this.cbs[this.cbIdx++] = cb
		return this.cbIdx - 1
	}

	peekCb(cbId) {
		let cbItem = this.cbs[cbId]
		cc.assert(cbItem)
		delete this.cbs[cbId]

		return cbItem
	}

	sendProxy(openID) {
		if (this._socket == null) {
			return
		}

		if (this._socket.readyState != 1) {
			return
		}
		let realargs = {
			Protocol: 1,
			Protocol2: 7,
		}
		if (openID) {
			realargs = {
				Protocol: 1,
				Protocol2: 7,
				OpenID: openID,
			}
		}

		let msgStr = JSON.stringify(realargs)
		cc.log('sendProxy: ', msgStr)
		// msgStr = this.msgEncrypt(msgStr)
		this._socket.send(msgStr)
	}

	send(realargs) {
		// if (this._socket == null) {
		// 	this.createWS(`${globalCfg.gameServer}`, () => {
		// 		this.send(args)
		// 	})
		// 	return
		// }
		// if (this._socket.readyState != 1) {
		// 	return
		// }
		let msgStr = JSON.stringify(realargs)
		// msgStr = this.msgEncrypt(msgStr)
		this._socket.send(msgStr)
	}

	close() {
		if (this._socket) {
			this._socket.close()
		}
		this._socket = null
	}
}

window.client = new Client()
