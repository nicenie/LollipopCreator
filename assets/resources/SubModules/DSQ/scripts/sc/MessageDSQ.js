'use strict'
class MessageAB {
    constructor() {
        this.latestMessages = []
        this.cbs = []
        this.cbIdx = 1

        this.user = null
        this.passwd = null
    }
    /*
       斗兽棋的消息处理
       1. 所有的消息（游戏中涉及到的消息）处理
       2. 行走、吃、认输消息等
    */
    onMessage(data) {
        cc.log('DSQ 游戏消息进入-------ByteEdu.Com: ')
        if (data.Protocol == 10 && data.Protocol2 == 4) {
            if (data.Bsucc) {
                cc.log('匹配成功！------------', data.Bsucc)
                if (data.Bsucc) {
                    dsq.initGame(data)
                }
            }
        }
        if (data.Protocol == 10 && data.Protocol2 == 6) {
            dsq.GameFanPai(data)
        }
        // 作业
        if (data.Protocol == 10 && data.Protocol2 == 8) {
            dsq.GameXingZou(data)
        }
        // 结算协议处理
        if (data.Protocol == 10 && data.Protocol2 == 10) {
            UIMgr.show('DSQ:jiesuan', data)
        }
    }
}
window.msgMJAB = MessageAB