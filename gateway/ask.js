const Askship = require('../models/askship')
const userIds  = require('../models/userIds')
const logger = require('../utils/logger').logger('gateway-ask')

const postQuestionAnswer = async (userId, param) => {
  const source = param.source
  const questionId = param.questionId ? param.questionId : null
  const answerId = param.answerId 
  const openid = await userIds.getOpenid(userId, source)
  const question = { source, asr: param.questionText, media: param.media }
  const answer = param.answer ? param : null

  if (!answerId || !openid) {
    logger.error('invalid paramter')
    return {}
  }

  const result = await Askship.putQuestion(openid, answerId, questionId, question, answer)
  await Askship.updateAnswerStatus(result._key, "read")
  return {}
}

const getAskingList = async (userId, param) => {
  const source = param.source
  const openid = await userIds.getOpenid(userId, source)
  if (openid) {
    const list = await Askship.askingList(openid)
    return list.filter(item => item.answerStatus == 'unread')
  } else {
    return await []
  }
}

const getAskedList = async (userId, param) => {
  const source = param.source
  const openid = await userIds.getOpenid(userId, source)
  if (openid) {
    const list = await Askship.askedList(openid)
    return list.filter(item => item.questionStatus == 'unread')    
  } else {
    return []
  }
}

module.exports = {
  'post-question-answer': postQuestionAnswer,
  'get-asking-list': getAskingList,
  'get-asked-list': getAskedList
}