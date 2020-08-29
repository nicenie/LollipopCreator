cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        interval: 1,
        duration: 10,
    },

    // use this for initialization
    onLoad: function () {
        this.seconds = 0
        this.countDownCB = this.countDownCB.bind(this)
    },

    begin: function () {
        this.seconds = 0
        this.label.string = this.duration - this.seconds
        this.schedule(this.countDownCB, this.interval, this.duration, 0)
    },

    countDownCB: function () {
        this.seconds++
        if (this.seconds >= this.duration) {
            this.seconds = this.duration
            this.unschedule(this.countDown)
            this.seconds = 0
            this.timeOverCallBack()
        }
        this.label.string = this.duration - this.seconds
    },

    cancel: function () {
        this.seconds = 0
        this.unschedule(this.countDownCB)
    },
    setTimeOverCallBack: function (cb) {
        this.timeOverCallBack = cb
    },

});
