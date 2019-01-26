const userIds  = require('../models/userIds')
const userStatus  = require('../models/userStatus')
const userInfo = require('../models/userInfo')
const userHeard = require('../models/heard')
const Askship = require('../models/askship')

const getStatusList = async (userId, param) => {
  const openid = userIds.getOpenid(userId, param.source)
  var answer = await userStatus.getUserStatusList(openid, parseInt(param.offset), parseInt(param.count))
  return answer
}

const getUserProfile = async (userId, param) => {
  const openid = await userIds.getOpenid(userId, param.source)
  if (!openid) {
    return {
      status: 'guest',
      profile: null,
      askingList: [],
      askedList: []
    }
  } else {
    const profile = await userInfo.getUserProfile(openid)
    const askingList = await Askship.askingList(openid)
    const askedList = await Askship.askedList(openid)
    return {
      status: 'user',
      profile: profile ? profile.info : null,
      askingList: askingList.filter(item => item.answerStatus == 'unread'),
      askedList: askedList.filter(item => item.questionStatus == 'unread') 
    }
  }
}

const getCurrentStatus = async (userId, param) => {
  const current = await userHeard.getCurrentHeard(param.source, userId)
  return current ? current : {}
}

const getNextStatus = async (userId, param) => {
  const openid = await userIds.getOpenid(userId, param.source)
  if (openid) {
    const profile = await userInfo.getUserProfile(openid)
    const sex  = profile ? profile.info.sex : 'unknown'
    return userHeard.getNextHeardForRegisted(param.source, userId, sex)
  } else {
    return userHeard.getNextHeardForGuest(param.source, userId)
  }
}

const getUserStatus = async (userId, param) => {
  const openid = await userIds.getOpenid(userId, param.source)

  if (!openid) {
    return {}
  }

  let status = await userStatus.getUserStatus(param.openid)
  if (!status) {
    return {}
  }

  return status
} 

module.exports = {
  'get-status-list': getStatusList,
  'get-user-profile': getUserProfile,
  'get-current-status': getCurrentStatus,
  'get-next-status': getNextStatus,
  'get-status': getUserStatus
}