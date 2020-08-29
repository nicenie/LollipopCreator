'use strict'

class MsgHandlers {
	syncGold(gold) {
		me.gold = gold
		eventMgr.emit('gold', gold)
	}

	login(info) {
		if (info.err != "" && info.err != null) {
			ut.alert(info.err)
			return
		}

		if (info.type == 0) { // 表示游客登陆
			client.user = info.username
			client.passwd = ''
		}

		cc.log("msgHandler登陆成功回调")
		connMgr.reset(true)

		for (let k in info) {
			me[k] = info[k]
		}

		if (!info.inRoom) {
			switch (sceneManager.current.name) {
				case 'Login':
				case 'SceneXCMJ':
					sceneManager.show('Main')
					break
			}
		}

		eventMgr.emit('login')
	}

	logout(reason) {
		connMgr.reset(false)
		ut.clearWxOpenId()
		client.close()

		sceneManager.show('Login')

		ut.alert(reason, 'close')
	}

	worldMsg(msg) {
		eventMgr.emit('worldMsg', msg)
	}

	ping() {
		connMgr.reset(true)
	}
}

module.exports = MsgHandlers
