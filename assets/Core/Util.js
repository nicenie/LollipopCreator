'use strict'

let Util = {
	convertSpace(src, des, pos) {
		pos = pos || cc.p(0, 0)
		let wp = src.convertToWorldSpaceAR(pos)
		let np = des.parent.convertToNodeSpaceAR(wp)
		return np
	},

	randInt(range) {
		return Math.floor(Math.random() * range)
	},

	tip(msg) {
		UIMgr.showTip(msg);
	},

	alert(str, buttons, cb) {
		buttons = buttons || 'ok'
		UIMgr.show({ name: "MessageBox", multi: true }, str, buttons, cb)
	},

	storageLoad(key, defVal) {
		let str = cc.sys.localStorage.getItem(key)
		return (str) ? JSON.parse(str) : defVal
	},

	storageSave(key, val) {
		cc.sys.localStorage.setItem(key, JSON.stringify(val))
	},

	isBrowser() {
		return cc.sys.isBrowser
	},

	printCallStack() {
		console.trace()
	},

    scoreFormator: function (val) {
        if (val < 1e3) {
            return String(val)
        }

        let str = String(val)
        let arr = []
        for (let i = 0; i < str.length; i++) {
            if (i > 0 && i % 3 == 0) {
                arr.push(',')
            }
            arr.push(str[str.length - 1 - i])
        }
        arr.reverse()

        return arr.join('')
    },

    scoreUnFormator: function (str) {
        let arr = []
        for (let i = 0; i < str.length; i++) {
            if (str[i] != ',') {
                arr.push(str[i])
            }
        }
        return parseInt(arr.join(''))
    },


	httpRequest(opts) {
		let xhr = new XMLHttpRequest()
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 400) {
					if (opts.ok) {
						opts.ok(xhr.responseText)
					}
				} else {
					if (opts.error) {
						opts.error(xhr.status, xhr.statusText)
					}
				}
			}
		}

		cc.log("POST: ", opts.url, JSON.stringify(opts.params))
		xhr.open(opts.method, opts.url, true)
		if (opts.method == 'POST') {
			xhr.setRequestHeader("Content-Type", "application/json")
			// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
			// application/x-www-form-urlencoded
		}
		if (opts.params && opts.method == 'POST') {
			// cc.log('send str = =',JSON.stringify(opts.params))
			xhr.send(JSON.stringify(opts.params))
			
			// xhr.send(opts.params)
		} else {
			xhr.send(null)
		}
	},

}//end Util

window.ut = Util
