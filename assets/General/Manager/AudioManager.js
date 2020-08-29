class AudioManager {
    constructor() {
        this.model = {
            musicID: -1,
            musicFile: null
        }
    }

    get soundVolume() {
        return globalCfg.setting.soundVolume
    }

    set soundVolume(percent) {
        globalCfg.setting.soundVolume = Math.max(0, Math.min(1, percent))
    }

    get musicVolume() {
        return globalCfg.setting.musicVolume
    }

    set musicVolume(percent) {
        globalCfg.setting.musicVolume = Math.max(0, Math.min(1, percent))

        if (this.model.musicID >= 0) {
            cc.audioEngine.setVolume(this.model.musicID, globalCfg.setting.musicVolume)
        }
    }

    get soundEnable() {
        return this.soundVolume > 0
    }

    get musicEnable() {
        return this.musicVolume > 0
    }

    set soundEnable(val) {
        this.soundVolume = val ? 0.5 : 0
    }

    set musicEnable(val) {
        this.musicVolume = val ? 0.5 : 0
    }

    save() {
        ut.storageSave('audio_setting', {
            sound: globalCfg.setting.soundVolume,
            music: globalCfg.setting.musicVolume,
        })
    }

    load() {
        let setting = ut.storageLoad('audio_setting', { sound: 0.5, music: 0.5 })
        this.soundVolume = setting.sound
        this.musicVolume = setting.music
    }

    playSound(file, moduleName) {
        if (file && this.soundVolume > 0) {
            moduleName = moduleName || 'master'

            let modPath = (moduleName == 'master') ? 'Master/data/sound' : `SubModules/${moduleName}/data/sound`
            let url = cc.url.raw(`resources/${modPath}/${file}.mp3`)
            cc.log(url)
            return cc.audioEngine.play(url, false, this.soundVolume)
        }

        return -1
    }

    playMusic(file, moduleName) {
        moduleName = moduleName || 'master'
        let modPath = (moduleName == 'master') ? 'Master/data/sound' : `SubModules/${moduleName}/data/sound`
        let url = cc.url.raw(`resources/${modPath}/${file}.mp3`)

        if (this.model.musicFile == url) {
            return
        }

        this.stopMusic()

        cc.log(url)
        cc.log('musicVolumn', this.musicVolume)
        this.model.musicID = cc.audioEngine.play(url, true, this.musicVolume)

        if (this.model.musicID >= 0) {
            this.model.musicFile = url
        } else {
            this.model.musicFile = null
            this.model.musicID = -1
        }
    }

    stopSound(audioID) {
        if (audioID >= 0) {
            cc.audioEngine.stop(audioID)
        }
    }

    stopMusic() {
        if (this.model.musicID >= 0) {
            cc.audioEngine.stop(this.model.musicID)
            this.model.musicFile = null
            this.model.musicID = -1
        }
    }
}

window.audioMgr = new AudioManager()
