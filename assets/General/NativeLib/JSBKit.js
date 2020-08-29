class NativeKit {
    constructor() {

    }

    get searchPaths() {
        if (CC_JSB) {
            return jsb.fileUtils.getSearchPaths()
        } else {
            return []
        }
    }

    setSearchPaths(arr) {
        if (CC_JSB) {
            jsb.fileUtils.setSearchPaths(arr)
        }
    }

    getWritablePath(path) {
        let root = (CC_JSB) ? jsb.fileUtils.getWritablePath() : './'
        return (path) ? root + path : root
    }

    isFileExist(path) {
        return jsb.fileUtils.isFileExist(path)
    }

    getStringFromFile(path) {
        return jsb.fileUtils.getStringFromFile(path)
    }

    captureNode(node, holder, title, content) {
        // 注意：需要截屏的节点node的父节点不能是holder，否则所截的图片内容显示位置不好控制，甚至跑出图片外。
        // 缺点：node在截屏的时候会被移动导致闪一下。
        if (node.parent == holder) {
            return cc.error('The parent of parameter node can NOT be parameter holder!')
        }
        if (node.width == 0 || node.height == 0) {
            this.captureScreen()
            return cc.error('The size of node is 0, so capture the whole screen instead.')
        }

        let originPos = node.getPosition()
        node.setPosition(cc.p(node.width / 2, node.height / 2))

        if (CC_JSB) {
            //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
            let renderTexture = cc.RenderTexture.create(node.width, node.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES)

            //把 renderTexture 添加到场景中去，否则截屏的时候，场景中的元素会移动
            holder._sgNode.addChild(renderTexture)
            //把 renderTexture 设置为不可见，可以避免截图成功后，移除 renderTexture 造成的闪烁
            renderTexture.setVisible(false)

            renderTexture.begin()
            node._sgNode.visit()
            renderTexture.end()

            renderTexture.saveToFile("demo.png", cc.ImageFormat.PNG, true, function () {
                cc.log("capture node successfully!");
                renderTexture.removeFromParent()
                node.setPosition(originPos)
                nativeApi.share(true, title, content, jsb.fileUtils.getWritablePath() + "demo.png", null, () => {
                    cc.log("分享回调")
                })
            });
        }
    }

    captureScreen() {
        if (CC_JSB) {
            //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
            let canvas = cc.director.getScene().children[0].getComponent(cc.Canvas)
            let width = canvas.designResolution.width
            let height = canvas.designResolution.height
            let renderTexture = cc.RenderTexture.create(width, height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);

            cc.director.getScene()._sgNode.addChild(renderTexture);
            renderTexture.setVisible(false)
            //实际截屏的代码
            renderTexture.begin();
            cc.director.getScene()._sgNode.visit();
            renderTexture.end();

            renderTexture.saveToFile("demo.png", 1, true, function () {
                cc.log("capture screen successfully!");
                renderTexture.removeFromParent()

                nativeApi.share(true, "【蚂蚁西昌麻将】", "战绩分享", jsb.fileUtils.getWritablePath() + "demo.png", null, () => {
                    cc.log("分享回调")
                })
            });
        }
    }
}

window.jsbkit = new NativeKit()
