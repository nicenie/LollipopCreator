cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
        buttons: cc.Node,

        model: {
            visible: false,
            get() {
                return this._model
            }
        }
    },

    onLoad: function () {
        this._model = {
            cb: null
        }

        this.node.onenter = this.onenter.bind(this)
    },

    onenter: function (str, buttons, cb) {
        buttons = buttons || 'ok'

        this.buttons.children.forEach((btn) => {
            btn.active = false
        })
        this.node.PathChild('close').active = false
        
        this.model.cb = cb
        this.text.string = str

        buttons.split('|').forEach((btn) => {
            if (btn == 'close') {
                this.node.PathChild('close').active = true
            } else {
                this.buttons.PathChild(btn).active = true
            }
        })
    },

    onClick: function (evt) {
        if (this.model.cb) {
            this.model.cb(evt.target.name)
        }
        UIMgr.close(this)
    },
});
