let UUID = require('uuid')

cc.Class({
	extends: cc.Component,

	properties: {
		manifests: [cc.RawAsset], // 避免构建的时候漏了将manifest文件加入到包里。
	},

	onLoad: function () {
		audioMgr.load()
		avatarMgr.load()

		if (!globalCfg.setting.deviceID) {
			globalCfg.setting.deviceID = UUID.create().toString().substring(0, 12)
			globalCfg.saveSetting()
		}

		cc.game.setFrameRate(60)

		cc.director.setDisplayStats(false)
		// if (ut.isBrowser()) {
		// 	cc.director.setDisplayStats(false) // 注意: 若前一个版本与下一个版本，分别切换了参数的bool值，将会在cc.sys.garbageCollect的时候出现闪退（必现），只测了Debug包。
		// }

		let bgTime = null
		let forceReboot = false

		cc.game.on(cc.game.EVENT_HIDE, () => {
			cc.audioEngine.pauseAll()
			// client.send("enterBG", true)
			bgTime = new Date().getTime()
		})

		cc.game.on(cc.game.EVENT_SHOW, () => {
			cc.audioEngine.resumeAll()
			// client.send("enterBG", false)

			// 切换到后台6个小时则强行重启
			if (bgTime && new Date().getTime() - bgTime >= 6 * 60 * 3600) {
				forceReboot = true
			}
		})

		if (CC_JSB) {
			let counter = 0

			window.__errorHandler = (filename, nline, msg) => {
				if (++counter > 10) {
					return
				}

				cc.log('JSB catch an error: ', msg, filename, nline)
				ut.httpRequest({
					url: globalCfg.logServer,
					method: 'POST',
					params: {
						username: me.nickname || 'empty',
						from: '__errorHandler',
						curScene: sceneManager.CurrentModule,
						curDialog: UIMgr.topName(),
						msg: msg || '',
						latestPKGs: client.latestMessages || '',
						filename: filename,
						nline: nline,
					},
				})
			}
		}
	},

	btnForceReboot: function () {
		UIMgr.show('MessageBox', '确定要重启游戏?', 'ok|cancel', (op) => {
			if (op == 'ok') {
				cc.audioEngine.stopAll()
				cc.game.restart()
			}
		})
	},

	btnShowSlotsTester: function () {
		UIMgr.show('SlotsTester')
	},
});
