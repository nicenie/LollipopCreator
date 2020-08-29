
cc.Class({
    extends: cc.Component,

    properties: {
        tesp: cc.Node,
        testEdit: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.node.onenter = this.onenter.bind(this)
        this.node.onleave = this.onleave.bind(this)
    },

    // 大厅监听消息实现
    onMessage(data) {
        cc.log('xiaoxi lai l ', data)
        connMgr.reset(false);
        if (data.Protocol == 1 && data.Protocol2 == 8) {
            cc.log("注册玩家到代理！！！");
            var json = {
                Protocol: 7,
                Protocol2: 1,
                Token: globalCfg.gameServerTocken,
                OpenID: data.OpenID,
                LoginType: 1,
            };
            client.send(json)
        } else if (data.Protocol == 10 && data.Protocol2 == 2) {
            
            sceneManager.show('AB_Loading', 'AB_Xmain');
            // --------------------------------------------
            // 数据更新 
            for (let k in data.Player) {
                me[k] = data.Player[k]
            }
            // for (let k in data.GameList) {
            //     for (let kk in data.GameList[k]) {
            //         globalCfg.GameList[kk] = data.GameList[k][kk]
            //     }
            // }
            // --------------------------------------------
        }
    },

    onenter: function (data) {
        eventMgr.on('onmessage', this, this.onMessage)
    },

    onleave: function () {
        cc.game.off(cc.game.EVENT_HIDE, this.node.onHide)
        cc.game.off(cc.game.EVENT_SHOW, this.node.onShow)
        eventMgr.off('onmessage', this)
    },

    start() {

    },

    onUserResult(code, msg) {
        cc.log("on user result action.");
        cc.log("msg:" + msg);
        cc.log("code:" + code);        //这里可以根据返回的 code 和 msg 做相应的处理
        switch (code) {
            case anysdk.UserActionResultCode.kInitSuccess://初始化 SDK 成功回调
                //SDK 初始化成功，login方法需要在初始化成功之后调用
                cc.log('SDK 初始化成功，login方法需要在初始化成功之后调用')
                break;
            case anysdk.UserActionResultCode.kInitFail://初始化 SDK 失败回调
                cc.log('SDK 初始化失败，游戏相关处理')
                // this.user_plugin = null
                break;
            case anysdk.UserActionResultCode.kLoginSuccess: //登陆成功回调
                cc.log('登陆成功后，可使用getUserID()获取用户ID')
                cc.log('getUserID() = ', this.user_plugin.getUserID())
                cc.log('msg = ', msg)
                client.login(msg);
                // sceneManager.show('Xmain');
                break;
            case anysdk.UserActionResultCode.kLoginNetworkError: //登陆网络出错回调
            case anysdk.UserActionResultCode.kLoginCancel: //登陆取消回调
            case anysdk.UserActionResultCode.kLoginFail: //登陆失败回调
        }

    },

    onWXlogin() {
        if (!cc.sys.isMobile) return
        let user_plugin = this.agent.getUserPlugin()
        if (!user_plugin) return
        user_plugin.login()
    },

    btnEvent(evt, data) {
        audioMgr.playSound('clickbutton')
        this.LollipopGo_httpGet(globalCfg.gameServerUrl)
    },

    // 登陸
    LollipopGo_httpGet(url) {
        let loginUrl = url + `/BaBaLiuLiu_DSQ?Protocol=10&Protocol2=1${`&DeviceID=${parseInt(Math.random() * 10000)}`}`
        var xhr = new XMLHttpRequest();
        cc.log("loginUrl:", loginUrl);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 300)) {
                // 对应的处理逻辑--回调处理等
                cc.log("The Server Replied with:" + xhr.responseText);
                //-----------------------------------------------------------
                // 解析json字符串数据
                var obj = eval('(' + xhr.responseText + ')');
                cc.log("Md5_code:", obj.Tocken);     // 发给大厅的 tocken
                cc.log("ServerData:", obj.URL);     // 链接地址：大厅的
                client.login(obj.URL, obj.Tocken);
                globalCfg.gameServerTocken = obj.Tocken;
            }
        };

        xhr.open("GET", loginUrl, true);
        xhr.timeout = 5000
        xhr.send()
    },
});
