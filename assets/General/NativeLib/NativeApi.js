'use strict'

class NativeApi {
    // 开始录音
    startRec(func) {
        cc.audioEngine.setMusicVolume(0)
        cc.audioEngine.setEffectsVolume(0)
        native.callClz("Rec", "startRec", func)
    }
    // 停止录音
    stopRec() {
        if (audioMgr.musicEnable) {
            cc.audioEngine.setMusicVolume(0.5)
        }

        if (audioMgr.soundEnable) {
            cc.audioEngine.setEffectsVolume(1)
        }
        native.callClz("Rec", "stopRec")
    }
    // 播放录音
    playRec(path, duration) {
        cc.audioEngine.setMusicVolume(0)
        setTimeout(() => {
            if (audioMgr.musicEnable) {
                cc.audioEngine.setMusicVolume(0.5)
            }
        }, duration * 1000)
        native.callClz("Rec", "playRec", path)
    }
    // 网络状态
    getNetworkType(f) { //WWAN,2G,3G,4G,WIFI
        native.callClz("gmut", "getNetworkType", f)
    }
    // 网络信号
    getNetStrength(f) { // 0-100
        native.callClz("gmut", "getNetStrength", f)
    }
    // 电池状态
    getBatteryState(f) { //UnKnow,Unplugged,Charging,Full
        native.callClz("gmut", "getBatteryState", f)
    }
    // 电量等级
    getBatteryLevel(f) { //0-100
        native.callClz("gmut", "getBatteryLevel", f)
    }
    // 获取照片
    getPhoto(f) { // ok, spriteFrame, base64

        native.callClz("gmut", "getPhoto", function (ok, path) {
            if (!ok) {
                return f(ok, path)
            }

            cc.textureCache.removeTextureForKey(path)

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                cc.loader.load(path, function (err, tex) {
                    if (err) {
                        cc.error(err)
                        f(false)
                    } else {
                        f(true, new cc.SpriteFrame(tex), readFileAsBase64String(path))
                    }
                })
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                f(true, new cc.SpriteFrame(path), readFileAsBase64String(path))
            }
        })
    }
    // 获取版本
    getVersion() {
        return native.getStr("gmut", "getVersion")
    }

    share(isFriend, title, content, imagepath, url, cb) {
        imagepath = imagepath || ""
        url = url || ""
        native.callClz("WeChat", "share", isFriend, title, content, imagepath, url, cb)
    }

    wxLogin(func) {
        native.callClz("WeChat", "login", func)
    }

    getBKValue() {
        return native._callClz("gmut", "getBKValue", "I", "bk_value")
    }

    getSystemLanguage() {
        return native.getStr("gmut", "getSystemLanguage")
    }

    getSystemVersion() {
        return native.getStr("gmut", "getSystemVersion")
    }

    getSystemModel() {
        let str = native.getStr("gmut", "getSystemModel")
        switch (str) {
            case 'iPhone1,1': str = 'iPhone2G'; break;
            case 'iPhone1,2': str = 'iPhone3G'; break;
            case 'iPhone2,1': str = 'iPhone3GS'; break;
            case 'iPhone3,1': str = 'iPhone 4'; break;
            case 'iPhone3,2': str = 'iPhone 4'; break;
            case 'iPhone3,3': str = 'iPhone 4'; break;
            case 'iPhone4,1': str = 'iPhone 4S'; break;
            case 'iPhone5,1': str = 'iPhone 5'; break;
            case 'iPhone5,2': str = 'iPhone 5'; break;
            case 'iPhone5,3': str = 'iPhone 5c'; break;
            case 'iPhone5,4': str = 'iPhone 5c'; break;
            case 'iPhone6,1': str = 'iPhone 5s'; break;
            case 'iPhone6,2': str = 'iPhone 5s'; break;
            case 'iPhone7,1': str = 'iPhone 6 Plus'; break;
            case 'iPhone7,2': str = 'iPhone 6'; break;
            case 'iPhone8,1': str = 'iPhone 6s'; break;
            case 'iPhone8,2': str = 'iPhone 6s Plus'; break;
            case 'iPhone8,4': str = 'iPhone SE'; break;
            case 'iPhone9,1': str = 'iPhone 7'; break;
            case 'iPhone9,2': str = 'iPhone 7 Plus'; break;
            case 'i386': str = 'iPhone Simulator'; break;
            case 'x86_64': str = 'iPhone Simulator'; break;
        }
        return str
    }

    getDeviceBrand() {
        return native.getStr("gmut", "getDeviceBrand")
    }
}

window.nativeApi = new NativeApi()