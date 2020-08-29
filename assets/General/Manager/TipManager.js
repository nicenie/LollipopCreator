cc.Class({
    extends: cc.Component,

    properties: {
        labelNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        window.TipMgr = this
        // this.labelNode.active = true
        this.grass = false
        this.schedule((dt) => {
            this.checkTimer(dt)
        }, 1, 1e7, 0)
    },

    start() {

    },

    showType(type) {
        if (type == 1) {
            this.labelNode.PathChild('value1').active = true
            this.labelNode.PathChild('value').active = false
        } else {
            this.labelNode.PathChild('value').active = true
            this.labelNode.PathChild('value1').active = false
        }
    },

    show(str, time, cb) {
        if (str == null || str == "") return
        if (this.labelNode.active) return
        time = time || 2
        this.labelNode.active = true
        this.showType(0)
        this.labelNode.PathChild('value', cc.Label).string = str
        this.labelNode.Run(cc.delayTime(2),
            // cc.fadeOut(0.5),
            cc.callFunc(() => {
                this.labelNode.active = false
                if (cb)
                    cb()
            })
        )
    },

    checkTimer(dt) {
        if (!this.grass) return
        if (this.time < 0) {
            sceneManager.mask.active = false
            this.labelNode.active = false
            this.grass = false
            if (this.CB)
                this.CB()
            return
        }

        this.time -= dt
        this.labelNode.PathChild('value1', cc.Label).string = this.str + '...' + Math.ceil(this.time)
        // cc.log(this.str + '...' + Math.ceil(this.time))
    },

    showTimerTip(str, time, cb) {
        if (str == null || str == "") return
        if (this.labelNode.active) return
        sceneManager.mask.active = true
        this.labelNode.active = true
        this.str = str
        this.CB = cb
        this.time = time || 30
        this.showType(1)
        this.labelNode.PathChild('value1', cc.Label).string = this.str + '...' + this.time
        this.grass = true
    },

    closeAll() {
        this.labelNode.active = false
        sceneManager.mask.active = false
        this.grass = false
        // if (this.CB)
        //     this.CB()
    },
});
