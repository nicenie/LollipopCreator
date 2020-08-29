cc.Class({
    extends: cc.Component,

    properties: {
        interval: 0.1,
        baseNumber: 10,

        model: {
            visible: false,
            get() {
                return this._model
            }
        }
    },

    onLoad: function () {
        this._model = {
            cb: false,
            formator: null,
            unformator: null,
        }

        this.schedule((dt) => {
            if (!this.model.cb) {
                return
            }

            this.model.cb(dt)
        }, this.interval, 1e7, 0)
    },

    setFormator(formator, unformator) {
        this.model.formator = formator
        this.model.unformator = unformator
    },

    play: function (duration, num) {
        let formator = this.model.formator
        let lbl = this.getComponent(cc.Label)
        let beg = (this.model.unformator) ? this.model.unformator(lbl.string) : (parseInt(lbl.string) || 0)

        let diff = num - beg
        let elapsed = 0

        this.model.cb = (dt) => {
            elapsed = Math.min(duration, elapsed + dt)
            let move = Math.floor(diff * elapsed / duration / this.baseNumber) * this.baseNumber

            let val = Math.floor(beg + move)
            if (elapsed == duration) {
                val = num
                this.model.cb = null
            }

            lbl.string = (formator) ? formator(val) : val
        }
    },

    stop: function (text) {
        this.model.cb = null

        let formator = this.model.formator

        if (text !== undefined) {
            this.getComponent(cc.Label).string = (formator) ? formator(text) : text
        }
    }
});
