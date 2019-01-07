const userIds  = require('../models/userIds')
const userStatus  = require('../models/userStatus')

const getStatusList = async (userId, param) => {
  const openid = userIds.getOpenid(userId, param.source)
  var answer = await userStatus.getUserStatusList(openid, param.start, param.end)
  return answer
}

module.exports = {
  'get-status-list': getStatusList
}