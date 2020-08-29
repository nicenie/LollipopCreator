'use strict'

class Bit {
	constructor(v) {
		this.v = v || 0
	}

	set(pos, flag) {
		let mask = 0b1 << pos
		if (flag) {
			this.v |= mask
		} else {
			mask = ~mask
			this.v &= mask
		}
	}

	get(pos) {
		let mask = 0b1 << pos
		return this.v & mask ? 1 : 0
	}
}

// let bit = new Bit(0b1001)
// bit.set(1, 1)
// console.log(bit.v)

module.exports = Bit