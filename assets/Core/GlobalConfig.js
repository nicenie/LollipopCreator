class GlobalConfig {
    constructor() {
        this.showOpen = true
        this.gameServer = ''      // 运营-游戏服务器
        this.logServer = ''     // 运营-异常捕捉服       
        this.registerServer = ''
        this.gameServerServerID = ''
        this.gameServerServerData = ''
        this.gameServerTocken = ''   // 客户端保存tocken信息
        this.gameServer7_2 = false
        this.gameServerUrl = "http://172.20.10.6:4001" // "http://120.25.80.44:7600"
        this.GameList = {}

        this.showHB = false  //心跳显示
        // NOTE: 不要使用ut.isBrowser()，因为有初始化顺序的问题
        if (cc.sys.os != cc.sys.OS_ANDROID && cc.sys.os != cc.sys.OS_IOS) {
            // this.gameServer = 'ws://192.168.2.233:5000'
        }
    }

    get setting() {
        if (!this.__static_val_setting) {
            this.__static_val_setting = {
                soundVolume: 0.5,
                musicVolume: 0.5,
            }

            let str = cc.sys.localStorage.getItem('slots_settings')

            if (str) {
                try {
                    this.__static_val_setting = JSON.parse(str)
                } catch (err) {
                    cc.error(err)
                }
            }
        }

        return this.__static_val_setting
    }

    get appstore() {
        return false
    }

    get hotStorage() {
        return 'hellokitty'
    }

    get memoryCollectImmediate() {
        return false
    }

    saveSetting() {
        cc.sys.localStorage.setItem('slots_settings', JSON.stringify(this.setting))
    }
}

window.globalCfg = new GlobalConfig()
