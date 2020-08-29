cc.Class({
    extends: cc.Component,

    properties: {
        step: 0.016,
    },

    onLoad: function () {
        this.CB = null
    },

    startPlay: function (cb, end) {
        if (this.CB) {
            this.unschedule(this.CB)
            this.CB = null
        }

        this.CB = cb

        this.schedule((dt) => {
            cb(dt)
            if (end(dt)) {
                this.unschedule(this.CB)
                this.CB = null
            }
        }, this.step, 1e7, 0)
    },
});
