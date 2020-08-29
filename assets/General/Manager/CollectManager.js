class CollectManager {
    constructor() {
        this.bucket = {}
        this.urls = {}
    }

    register(pfbURL) {
        if (this.urls[pfbURL]) {
            return
        }

        let deps = cc.loader.getDependsRecursively(pfbURL)

        cc.log('collectMgr.register...', deps.length)

        deps.forEach((path) => {
            let cnt = this.bucket[path] || 0
            this.bucket[path] = ++cnt
        })

        this.urls[pfbURL] = true
    }

    release(pfbURL) {
        if (!this.urls[pfbURL]) {
            cc.log('pbfURL is not exist', pfbURL)
            return
        }

        let deps = cc.loader.getDependsRecursively(pfbURL)
        let arr = []

        deps.forEach((path) => {
            let cnt = this.bucket[path] || 0
            if (cnt > 1) {
                this.bucket[path] = cnt - 1
            } else {
                if (cnt == 1) {
                    delete this.bucket[path]
                }
                arr.push(path)
            }
        })

        cc.loader.release(arr)

        delete this.urls[pfbURL]

        arr.forEach((path, i) => {
            cc.log('release data:', i, path)
        })
        cc.log('collectMgr.release', arr.length, pfbURL)
    }
    
    print() {
        for (let key in this.bucket) {
            cc.log(key, this.bucket[key])
        }
    }
}

window.collectMgr = new CollectManager()

