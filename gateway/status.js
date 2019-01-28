const Askship = require('../models/askship')
const userIds  = require('../models/userIds')

const postQuestionStatus = async (userId, param) => {
  const source = param.source
  const openid = await userIds.getOpenid(userId, source)
  if (!openid) {
    logger.error('invalid paramter')
    return {status: "invalid paramter"}
  }
  
  await Askship.updateQuestionStatus(param.key, param.status)
  return {status: "ok"}
}

const postAnswerStatus = async (userId, param) => {
  const source = param.source
  const openid = await userIds.getOpenid(userId, source)
  if (!openid) {
    logger.error('invalid paramter')
    return {status: "invalid paramter"}
  }
  
  await Askship.updateAnswerStatus(param.key, param.status)
  return {status: "ok"}
}

module.exports = {
  'post-question-status': postQuestionStatus,
  'post-answer-status': postAnswerStatus,
}
