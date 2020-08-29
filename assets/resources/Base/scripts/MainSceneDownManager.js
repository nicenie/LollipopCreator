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
        window.downMgr = this

        this._model = {

        }
    },

    checkExist: function (moduleName) {
        return true
    },

    clickModule: function (data) {
        switch (data) {
            case 'YQS':
                sceneManager.show('YQS:Room')
                break
            default:
                sceneManager.show(`${data}:Loading`, `${data}:${data}`)
                break
        }
    }
});
