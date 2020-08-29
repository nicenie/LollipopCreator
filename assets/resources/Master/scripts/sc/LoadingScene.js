cc.Class({
    // 继承的关系
    extends: cc.Component,

    // 定义属性
    properties: {
        progress: cc.Node,
        model: {
            visible: false,
            get() {
                return this._model
            }
        }
    },

    // 加载函数
    onLoad: function () {
        // 定义了一个结构
        this._model = {
            args: [],
            done: false,
            curPercent: 0,
            dstPercent: 0,
            moduleName: '',
            sceneName: '',
            status: 0,
        }
     
        // 定义了一个状态
        this.Status = {
            None: 0,
            Master: 1,
            Module: 2,
            Scene: 3,
        }
       
        // 百分比
        this.ConstPercent = {
            Master: 0.2,
            Module: 0.4,
        }

        // 定时器 
        this.schedule((dt) => {
            if (this.model.done) {
                return
            }

            if (this.model.status == this.Status.Scene && this.model.curPercent == 1) {
                this.model.done = true
                sceneManager.show.apply(sceneManager, this.model.args)
                // args 是空的数据操作，是场景文件操作的数据
                return
            }

            if (this.model.curPercent < this.model.dstPercent) {
                let step = (this.model.dstPercent == 1) ? 1 : 0.25
                this.model.curPercent = Math.min(this.model.curPercent + step * dt, this.model.dstPercent)
                // 修改文字和进度条的数据
                this.progress.PathChild('slider', cc.Sprite).fillRange = this.model.curPercent
                this.progress.PathChild('info', cc.Label).string = "正在努力加载中, 当前加载"+Math.ceil(this.model.curPercent*100) +'%'
            }

        }, 0.02, 1e7, 0)

        // 加载场景文件操作，加载内存
        this.node.onenter = this.onenter.bind(this)
        this.node.onprogress = this.onprogress.bind(this)
        this.node.ondone = this.ondone.bind(this)
    },

    // 中心函数
    onenter: function () {
        let args = Array.prototype.slice.call(arguments)
        let sceneName = args[0]

        cc.info('Loading Scene name', sceneName)

        this.model.args = args
        this.model.done = false
        this.model.status = this.Status.None
        this.model.curPercent = 0
        this.model.dstPercent = 0
        this.model.sceneName = sceneName
        this.model.moduleName = sceneName.split(':')[0]

        this.progress.PathChild('slider', cc.Sprite).fillRange = 0
        this.progress.PathChild('info', cc.Label).string = ''

        this.loadScene()
    },

    // 继承函数
    onprogress: function (done, total, item) {
        let percent = (total > 0) ? done / total : 1
        percent = this.ConstPercent.Module + percent * (1 - this.ConstPercent.Module)
        percent = Math.floor(percent * 100) / 100

        if (done == total) {
            this.model.dstPercent = 1
        } else {
            this.model.dstPercent = percent
        }
    },

    // 执行函数
    ondone: function () {
        this.model.dstPercent = 1 
    },

    // 加载场景
    loadScene: function () {
        this.model.status = this.Status.Scene
        sceneManager.asyncLoad(this.model.sceneName)
    },
});
