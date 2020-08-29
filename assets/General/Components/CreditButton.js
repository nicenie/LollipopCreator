cc.Class({
    extends: cc.Component,

    properties: {
        duration: 60,
        validText: cc.Node,
        countdown: cc.Label,
        frames: [cc.SpriteFrame],

        model: {
            visible: false,
            get() {
                return this._model
            }
        }
    },

    onLoad: function () {
        this._model = {
            left: 0,
            running: false,
        }

        this.schedule(() => {
            if (!this.model.running) {
                return
            }

            this.model.left--
            if (this.model.left == 0) {
                this.makeValid()
            } else {
                this.countdown.string = `${this.model.left}秒`
            }
        }, 1, 1e7, 0)
    },

    startWait: function () {
        this.model.left = this.duration
        this.model.running = true

        this.countdown.string = `${this.model.left}秒`

        this.switchMode(false)
    },

    makeValid: function () {
        this.model.running = false
        this.switchMode(true)
    },

    switchMode: function (valid) {
        this.countdown.node.active = !valid
        this.validText.active = valid
        this.getComponent(cc.Button).interactable = valid
        this.getComponent(cc.Sprite).spriteFrame = this.frames[valid ? 1 : 0]
    },
});
