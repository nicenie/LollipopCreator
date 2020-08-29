cc.Class({
    extends: cc.Component,

    properties: {
        captureHolder: cc.Node,
        sceneParent: cc.Node,
        mask: cc.Node,
        progress: cc.Node,
        loginPrefab: cc.Prefab,
    },

    onLoad: function () {
        window.sceneManager = this
        this.CurrentModule = null
        this.current = null
        this.next = null
        // 显示登录的 prefab;
        this.actualShow(cc.instantiate(this.loginPrefab))
        this.mask.active = false
        this.progress.active = false
        this.schedule(() => {
        }, 30, 1e7, 0)
    },

    asyncLoad: function (key, cb) {
        let progressCB = (done, total, item) => {
            if (this.current && this.current.onprogress) {
                this.current.onprogress(done, total, item)
            }
        }

        let subs = key.split(':')
        let url = (subs.length == 2) ? `SubModules/${subs[0]}/prefabs/sc/${subs[1]}` : `Master/prefabs/sc/${key}`
        this.CurrentModule = (subs.length == 2) ? subs[0] : null
        cc.log('asyncLoad:', url)
        this.mask.active = true
        cc.loader.loadRes(url, progressCB, (err, prefab) => {
            if (this.current && this.current.ondone) {
                this.current.ondone()
            }

            this.mask.active = false
            this.progress.active = false
            if (err) {
                return cc.log(err)
            }
            if (cb) {
                let it = cc.instantiate(prefab)
                it.pfbURL = url
                it.name = key
                it.autoCollect = true
                collectMgr.register(url)
                cb(it)
            }
        })
    },

    show: function (name) {
        let args = Array.prototype.slice.call(arguments)
        let key = args.shift()

        cc.info('SceneManager show', key)

        if (this.current && key == this.current.name) {
            return
        }

        this.asyncLoad(key, (next) => {
            this.actualShow(next, args)
        })
    },

    actualShow: function (next, args) {
        UIMgr.clear()

        this.next = next
        this.next.parent = this.sceneParent
        this.next.zIndex = 0

        if (this.current) {
            this.current.zIndex = 1
        }

        cc.log('args', args)
        let wait = (next.onenter && next.onenter.apply(null, args))
        if (!wait) {
            this.ready()
        }
    },

    ready: function () {
        if (!this.next) {
            return
        }

        let prev = this.current
        if (prev) {
            if (prev.onleave) {
                prev.onleave()
            }
            if (prev.autoCollect) {
                this.collect(prev)
            }
            prev.parent = null
        }

        this.current = this.next
        this.next = null

        if (this.sceneParent.children.length > 1) {
            cc.error('children count of scene parent is more than 1.', this.sceneParent.children.length)
        }
    },

    // 释放场景，之所有取那么奇怪的名字是为了避免跟底层冲突。
    // 释放资源时，自动忽略正在被当前场景使用的资源。
    collect: function (sc) {
        if (!sc || sc == this.current) {
            return
        }

        let url = sc.pfbURL
        let name = sc.name
        sc.parent = null

        if (globalCfg.memoryCollectImmediate) {
            sc.destroy()
            this.sceneParent.runAction(cc.sequence(
                cc.delayTime(2),
                cc.callFunc(() => {
                    cc.sys.garbageCollect()
                    cc.info('cc.sys.garbageCollect...')
                })
            ))
            collectMgr.release(url)
        }
        cc.info('release scene...', name)
    },

    // 注意：该函数仅用于子节点的截图，如果是想要截全屏的话则调用ut.captureScreen()
    makeCapture: function (node) {
        if (node.width == 0 || node.height == 0) {
            return cc.error('The size of node can NOT be zero')
        }

        this.captureHolder.removeAllChildren()
        let it = cc.instantiate(node)
        it.active = true
        it.parent = this.captureHolder
        this.captureHolder.stopAllActions()
        this.captureHolder.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.callFunc(() => {
                cc.log('start make capture...')
                ut.captureNode(it, node)
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.captureHolder.removeAllChildren()
            })
        ))
    }
});