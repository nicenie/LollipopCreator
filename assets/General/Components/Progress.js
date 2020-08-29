cc.Class({
    extends: cc.Component,

    properties: {
        bar : cc.Node,
        progress : cc.Sprite,
        percentChange : [cc.Component.EventHandler],
    },

    onLoad: function () {
        let thiz = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            thiz.setButtonPos(event.getLocation())
        });

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            thiz.setButtonPos(event.getLocation())
        });

    },

    setPercent : function(percent) {
        let startX = this.bar.width / 2 - this.node.width * this.node.anchorX
        percent = Math.min(Math.max(percent, 0), 1)
        this.bar.x = startX + (this.node.width - this.bar.width) * percent
        
        this.percent = percent
        if (this.progress)
            this.progress.fillRange = percent;

        for (let i = 0; i < this.percentChange.length; i++) {
            this.percentChange[i].emit([percent])
        }
    },

    setButtonPos : function(pos) {
        let startX = this.bar.width / 2 - this.node.width * this.node.anchorX
        let localPos = this.node.convertToNodeSpaceAR(pos)
        let percent = (localPos.x - startX) / (this.node.width - this.bar.width)
        this.setPercent(percent)
    },
});
