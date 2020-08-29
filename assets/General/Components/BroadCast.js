cc.Class({
    extends: cc.Component,

    properties: {
        broadcast: cc.Node,    // 喇叭文字
        mask: cc.Node, // 喇叭mask
    },

    // use this for initialization
    onLoad: function () {
        this.schedule((dt) => {
            let obj = this.broadcast
            obj.x -= 30 * dt
            if (obj.x + obj.width + 10 < 0) {
                obj.x = this.mask.width + 10
            }
        }, 0.02, 1e7, 0)
    },
});
