class GlobalSceneVarManager {
    constructor() {
        
    }

    register(name, target) {
        if (window[name]) {
            cc.error('GlobalSceneVarManager.register failed, already exist:', name)
            return
        }

        cc.log('globalSceneVarManager.register', name)

        window[name] = target
    }

    unregister(name, target) {
        if (!window[name]) {
            cc.error('GlobalSceneVarManager.unregister failed, NOT exist:', name)
            return
        }

        cc.log('globalSceneVarManager.unregister', name)

        window[name] = null
    }
}

window.globalSceneVarManager = new GlobalSceneVarManager()

