"use strict"
const Wechat = require('wechat4u')
const debug = require('debug')('wxbot')

class WxBot extends Wechat {

  constructor() {
    super()

    this.replyUsers = new Set()
    this.on('text-message', msg => this._botReply(msg))

    this.superviseUsers = new Set()
    this.openTimes = 0
    this.on('mobile-open', () => this._botSupervise())
  }
  // friendList
  // username, nickname, py
  get autoReplyList() {
    let members = this.friendList 

    for (let member of members) {
      member.switch = this.replyUsers.has(member.username)
    }

    return members
  }
  
  get superviseList() {
    let members = this.friendList

    for (let member of members) {
      member.switch = this.superviseUsers.has(member.username)
    }

    return members
  }

  _tuning(word) {
    let params = {
      'key': '2ba083ae9f0016664dfb7ed80ba4ffa0',
      'info': word
    }
    return this.axios({
      method: 'GET',
      url: 'http://www.tuling123.com/openapi/api',
      params: params
    }).then(res => {
      const data = res.data
      if (data.code == 100000) {
        return data.text + '[微信机器人]'
      }      throw new Error("tuning返回值code错误", data)
    }).catch(err => {
      debug(err)
      return "现在思路很乱，最好联系下我哥 T_T..."
    })
  }

  _botReply(msg) {
    if (this.replyUsers.has(msg['FromUserName'])) {
      this._tuning(msg['Content']).then((reply) => {
        this.sendMsg(reply, msg['FromUserName'])
        debug(reply)
      })
    }
  }

  _botSupervise() {
    const message = '我的主人玩微信' + ++this.openTimes + '次啦！'
    for (let user of this.superviseUsers.values()) {
      this.sendMsg(message, user)
      debug(message)
    }
  }

}

exports = module.exports = WxBot
