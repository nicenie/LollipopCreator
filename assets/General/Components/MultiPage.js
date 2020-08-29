cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {

    },

    setPage: function (name) {
        this.node.children.forEach((it) => {
            it.active = (it.name == name)
        })
    },

    setPageByIdx: function (idx) {
        this.node.children.forEach((it, i) => {
            it.active = (i == idx)
        })
    },
});
