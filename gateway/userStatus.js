const userIds  = require('../models/userIds')
const userStatus  = require('../models/userStatus')
const userInfo = require('../models/userInfo')

const getStatusList = async (userId, param) => {
  const openid = userIds.getOpenid(userId, param.source)
  var answer = await userStatus.getUserStatusList(openid, parseInt(param.start), parseInt(param.end))
  return answer
}

const getUserProfile = async (userId, param) => {
  const openid = userIds.getOpenid(userId, param.sourse)
  if (!openid) {
    return {
      status: 'guest',
      profile: null
    }
  } else {
    const profile = await userInfo.getUserProfile(openid)
    return {
      status: 'user',
      profile: profile ? profile.info : null
    }
  }
}

module.exports = {
  'get-status-list': getStatusList,
  'get-user-profile': getUserProfile
}