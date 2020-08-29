
cc.Class({
    extends: cc.Component,

    properties: {
        linenode: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.allMap = []
        this.curplayidx = 0
        // for (let i = 0; i < 2; i++) {
            
        //     let str = `<color=#ffffff>恭喜暴怒鳄鱼${i}获得</c><color=#0fffff>6000.0</color><color=#ffffff>元</c>`
        //     if(i==1)str = '金狐麻将欢迎您~祝您玩的开心'
        //     this.addItem(str)
        // }
    },

    addItem(it) {
        let itnode = cc.instantiate(this.linenode)
        let lb = itnode.PathChild('lb', cc.RichText).string = Utf8ToUnicode(it) 
        itnode.parent = this.node
        itnode.x = 400
        itnode.y = 0
        let item = {}
        item.len = itnode.PathChild('lb').width
        item.node = itnode
        this.allMap.push(item)
       
    },

    update(dt) {
        if (this.allMap.length < 1) { return }
        //获取当前滚动     //移动一半 获取下一条  //移动结束滚蛋
        let curit = this.allMap[this.curplayidx]
        curit.node.x -= 1
        if (curit.node.x < (0-400-curit.len)){
            curit.node.x = 400 
            
            if(this.allMap.length>10){
                curit.node.destroy()
                this.allMap.shift()
            }
            
            this.curplayidx ++
            if(this.curplayidx > this.allMap.length-1){
                this.curplayidx = 0
            }
        }
    },
});
