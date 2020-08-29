cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.node.onenter = this.onenter.bind(this)
    },

    onenter(data) {
        this.initWebUrl(data);
    },

    initWebUrl(data) {
        this.node.PathChild('webview').getComponent(cc.WebView).url = data
    },

    closeWebView () {
        UIMgr.close(this);
    },
    
    onWebLoaded (ent,event) {
        var loadStatus = "";
        if (event === cc.WebView.EventType.LOADED) {
            loadStatus = " is loaded!";
        } else if (event === cc.WebView.EventType.LOADING) {
            loadStatus = " is loading!";
        } else if (event === cc.WebView.EventType.ERROR) {
            loadStatus = ' load error!';
        }
        console.log(this.node.PathChild('webview').getComponent(cc.WebView).url + loadStatus)
    },
});
