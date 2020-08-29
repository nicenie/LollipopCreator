class ExpressionManager {
    constructor() {
        this.dynamic = {}
        this.magic = {}
    }

    loadDynamicExp(key, cb) {
        this.dynamic[key] = this.dynamic[key] || { pfb: null, cbs: [], acquire: false }

        let it = this.dynamic[key]

        if (it.pfb) {
            cb(it.pfb)
            return
        }

        it.cbs.push(cb)

        if (!it.acquire) {
            it.acquire = true
            cc.loader.loadRes(`Prefabs/DynamicExp/${key}`, (err, prefab) => {
                if (err) {
                    it.cbs.length = 0
                    return cc.log(err)
                }

                cc.log("成功加载表情", key)

                it.pfb = prefab

                it.cbs.forEach((tcb) => { tcb(prefab) })

                it.cbs.length = 0
            })
        }
    }

    loadMagicExp(key, cb) {
        this.magic[key] = this.magic[key] || { pfb1: null, pfb2: null, cbs: [], acquire: false }

        let it = this.magic[key]

        if (it.pfb1 && it.pfb2) {
            cb(it.pfb1, it.pfb2)
            return
        }

        it.cbs.push(cb)

        if (!it.acquire) {
            it.acquire = true

            cc.loader.loadResDir(`Prefabs/MagicExp/${key}`, cc.Prefab, (err, prefabs) => {
                if (err) {
                    it.cbs.length = 0
                    return cc.log(err)
                }

                let mm = {}

                prefabs.forEach((pfb) => {
                    mm[pfb.name] = pfb
                })

                it.pfb1 = mm[`${key}_a`]
                it.pfb2 = mm[`${key}_b`]

                it.cbs.forEach((tcb) => { tcb(it.pfb1, it.pfb2) })

                it.cbs.length = 0
            })
        }
    }
}

window.expMgr = new ExpressionManager()
