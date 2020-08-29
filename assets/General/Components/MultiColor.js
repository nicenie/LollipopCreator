cc.Class({
    extends: cc.Component,

    properties: {
        colors: [cc.Color],
    },

    onLoad: function () {

    },

    setColor: function (idx) {
        cc.assert(idx < this.colors.length)
        this.node.color = this.colors[idx]
    },
});
