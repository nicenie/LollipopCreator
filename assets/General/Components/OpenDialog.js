cc.Class({
    extends: cc.Component,

    properties: {
        dialogName: '',
    },

    onLoad: function () {

    },

    btnOpen: function () {
        UIMgr.show(this.dialogName)
    },
});
