cc.Class({
    extends: cc.Component,

    properties: {
        model: {
            visible: false,
            get() {
                return this._model
            }
        }
    },

    onLoad: function () {
        this._model = {
            deltaArr: [],
            total: 0,
            elapsed: 0,
        }
    },

    update: function (dt) {
        if (this.model.deltaArr.length > 0) {
            this.model.total -= this.model.deltaArr.shift()
        }
        this.model.deltaArr.push(dt)

        this.model.total += dt
        this.model.elapsed += dt
        if (this.model.elapsed > 0.5) {
            this.model.elapsed = 0
            let avg = this.model.total / this.model.deltaArr.length
            let fps = Math.floor(100 / avg) / 100
            this.node.PathChild('val', cc.Label).string = fps
        }
    },
});
