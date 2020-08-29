'use strict'

class EventManager {
    constructor() {
        this.events = {}
    }

    unique(name, target, cb) {
        this.events[name] = []
        this.on(name, target, cb)
    }

    on(name, target, cb) {
        this.events[name] = this.events[name] || []
        this.events[name].push({
            target: target,
            cb: cb,
            name: name,
        })
    }

    off(name, target) {
        let list = this.events[name] || []
        let arr = []
        let cnt = 0

        list.forEach((it) => {
            if (name == null || it.name == name) {
                if (it.target == target) {
                    ++cnt
                    return
                }
            }
            arr.push(it)
        })

        if (cnt > 0) {
            this.events[name] = arr
        }
    }

    emit(name) {
        let list = this.events[name] || []
        let args = Array.prototype.slice.call(arguments)

        args.shift()
        cc.log("eventMgr.emit", name, list.length, JSON.stringify(args))

        list.forEach((it) => {
            try {
                it.cb.apply(null, args)
            } catch (err) {
                cc.error('EventManager emit error.', name, err)
            }
        })
    }
}

window.eventMgr = new EventManager()
