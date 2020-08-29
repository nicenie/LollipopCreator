cc.Class({
    extends: cc.Component,

    properties: {
        fonts: [cc.Font],
    },

    onload: function () {

    },

	setFont: function (idx) {
        cc.assert(idx < this.fonts.length)

		let label = this.getComponent(cc.Label)
		label.font = this.fonts[idx]
	},
});
