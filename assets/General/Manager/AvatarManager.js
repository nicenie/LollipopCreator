'use strict'


class AvatarManager {
    constructor() {
        this.textures = {}
        this.staticHead = {}
    }

    load() {
        cc.loader.loadResDir('Base/data/ABhead', cc.SpriteFrame, (err, assets) => {
            if (err) {
                return cc.error(err)
            }
            assets.forEach((it) => {
                this.staticHead[it.name] = it
            })
        })
    }

    // load() {
    //     cc.loader.loadResDir('Base/data/ABhead', cc.SpriteFrame, (err, assets) => {
    //         if (err) {
    //             return cc.error(err)
    //         }
    //         assets.forEach((it) => {
    //             this.staticHead[it.name] = it
    //         })
    //     })
    // }

    // getHeadImgByIdx(idx) {
    //     return this.staticHead[`x${idx + 1}`]
    // }

    getHeadImgByIdx(idx) {
        // return this.staticHead[`tx_${idx + 1}`]
        if (idx == 0)
            idx = 1;
        return this.staticHead[`tx_${idx}`]
    }

    setByTex(node, tex) {
        let sp = node.getComponent(cc.Sprite)
        sp.spriteFrame = new cc.SpriteFrame(tex)
        // node.width = node.width
        // node.height = node.height
    }

    setByURL(node, url) {
        // if (!cc.sys.isNative || !url) {
        let sp = node.getComponent(cc.Sprite)
        // sp.spriteFrame = null
        sp.spriteFrame = this.getHeadImgByIdx(url);

        // 读取网络的数据
        if (!url) {
            return
        }

        if (this.textures[url]) {
            this.setByTex(node, this.textures[url])
        } else {
            cc.loader.load({ url: url, type: "jpg" }, (err, tex) => {
                if (err) {
                    return cc.log('setByURL fail to load ', url)
                }

                this.textures[url] = tex
                this.setByTex(node, tex)
            })
        }
    }
}

window.avatarMgr = new AvatarManager