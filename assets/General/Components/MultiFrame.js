cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
		frames:[cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function () {

    },

	setFrame: function (idx) {
		cc.assert(idx < this.frames.length)
		let sp = this.getComponent(cc.Sprite)
		sp.spriteFrame = this.frames[idx]
	},

	getFrame: function(idx) {
		return this.frames[idx]
	}



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
