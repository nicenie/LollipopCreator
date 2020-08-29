let Effects = {
    "NoEffect": { show: (layer) => { }, hide: (layer, finish) => { finish() }, },
}

cc.Class({
    extends: cc.Component,

    properties: {
        uiParent: cc.Node,
        mask: cc.Node, // 半透明屏蔽层
        tipTempNode: cc.Node,

        model: { // for MVC
            visible: false,
            get: function () {
                return this._model
            }
        }
    },

    onLoad: function () {
        window.UIMgr = this
        this._model = {
            prefabs: {},
            cache: {}, // layers cache
            stack: [], // layers stack
            urls: [],
        }

        this.mask.parent = this.uiParent
        this.mask.active = false
    },

    checkIsLoaded: function (key) {
        return !!this.model.prefabs[key]
    },

    syncLoad: function (key, cb) {
        cb = cb || function () { }

        let subs = key.split(':')
        let url = (subs.length == 2) ? `SubModules/${subs[0]}/prefabs/ui/${subs[1]}` : `Master/prefabs/ui/${key}`
        if (this.model.prefabs[key]) {
            cb()
        } else {
            cc.loader.loadRes(url, (err, prefab) => {
                if (err) {
                    return cc.log(err)
                }
                this.model.prefabs[key] = prefab
                this.model.urls.push(url)
                collectMgr.register(url)
                cb()
            })
        }
    },

    // usage: UIMgr.show({multi:true, effect:'MoveFromLeft', name:"MessageBox"}, ...)
    // usage: UIMgr.show("MessageBox", ...)
    show: function (name) { // params: multi, effect
        if (!name) return;

        let args = Array.prototype.slice.call(arguments)
        let params = {}
        args.splice(0, 1)

        if (typeof (name) != 'string') {
            params = name || {}
            name = params.name
            if (!name) return;
        }

        let setupLayer = (layer) => {
            let count = this.model.stack.push(layer)
            layer.node.zIndex = count * 2 + 2
            layer.node.parent = this.uiParent
            layer.effect = params['effect'] ? Effects[params['effect']] : Effects['NoEffect']
            layer.effect.show(layer)
            if (layer.node.onenter) {
                layer.node.onenter.apply(null, args)
            }
        }

        this.syncLoad(name, (url) => {
            cc.log('show ', name)

            if (params.multi || this.model.cache[name] == null) {
                let layer = {
                    name: name,
                    node: cc.instantiate(this.model.prefabs[name]),
                    pfbURL: url,
                }

                this.model.cache[name] = layer
                setupLayer(layer)
            } else {
                let layer = this.bringToTop(name)
                if (layer) { // 单个实例且此实例已经在显示中
                    if (layer.node.onenter) {
                        layer.node.onenter.apply(null, args)
                    }
                } else {
                    layer = this.model.cache[name]
                    setupLayer(layer)
                }
            }

            this.resetMask()
        })
    },

    bringToTop: function (name) {
        for (let i = 0; i < this.model.stack.length; i++) {
            let layer = this.model.stack[i]
            if (layer.name == name) {
                this.model.stack.splice(i, 1)
                this.model.stack.push(layer)
                return layer
            }
        }
        return null
    },

    topName: function () {
        return this.model.stack.length == 0 ? "" : this.model.stack[this.model.stack.length - 1].name
    },

    topNode: function () {
        return this.model.stack.length == 0 ? "" : this.model.stack[this.model.stack.length - 1].node
    },

    pop: function () {
        if (this.model.stack.length > 0) {
            this.close(this.model.stack[this.model.stack.length - 1].node)
        }
    },

    close: function (node) {
        if (node instanceof cc.Component) {
            node = node.node
        } else if (typeof (node) == 'string') {
            if (this.model.cache[node]) {
                node = this.model.cache[node].node
            } else {
                return
            }
        }

        let found = null
        for (let i = 0; i < this.model.stack.length; i++) {
            let layer = this.model.stack[i]
            if (layer.node == node) {
                this.model.stack.splice(i, 1)[0]
                found = layer
                break
            }
        }

        if (!found) {
            return
        }

        found.effect.hide(found, () => {
            found.node.parent = null
            this.resetMask()
        })
    },

    clear: function () {
        this.model.stack.forEach((layer) => {
            layer.node.parent = null
        })

        if (globalCfg.memoryCollectImmediate) {
            this.model.urls.forEach((url) => {
                collectMgr.release(url)
            })
        }

        this.model.stack.length = 0
        this.model.urls.length = 0
        this.model.cache = {}

        this.resetMask()
    },

    resetMask: function () {
        let count = this.model.stack.length
        this.mask.active = (count != 0)
        this.mask.zIndex = count * 2 + 1
    },

    showTip: function (text) {
        let node = cc.instantiate(this.tipTempNode)
        node.active = true;
        node.parent = this.tipTempNode.parent
        node.getChildByName('value').getComponent(cc.Label).string = text

        node.Run(
            cc.delayTime(2),
            cc.fadeOut(0.5),
            cc.callFunc(() => {
                node.parent = null
            })
        )
    },
});
