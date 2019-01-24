const Askship = require('../models/askship')
const userIds  = require('../models/userIds')

const postQuestionStatus = async (userId, param) => {
  const source = param.source
  const openid = await userIds.getOpenid(userId, source)
  if (!openid) {
    return {}
  }
  
  await Askship.updateQuestionStatus(param.key, param.status)
  return {}
}

const postAnswerStatus = async (userId, param) => {
  const source = param.source
  const openid = await userIds.getOpenid(userId, source)
  if (!openid) {
    return {}
  }
  
  await Askship.updateAnswerStatus(param.key, param.status)
  return {}
}

module.exports = {
  'post-question-status': postQuestionStatus,
  'post-answer-status': postAnswerStatus,
}
