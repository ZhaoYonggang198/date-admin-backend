const Askship = require('../models/askship')
const userIds  = require('../models/userIds')
const logger = require('../utils/logger').logger('gateway-ask')

const postQuestionAnswer = async (userId, param) => {
  const source = param.source
  const questionId = param.questionId ? param.questionId : null
  const answerId = param.answerId 
  const openid = await userIds.getOpenid(userId, source)
  const question = { source, asr: param.questionText, media: param.media }
  const answer = (param.answer && param.answer.answer)? param.answer : null

  if (!answerId || !openid) {
    logger.error('invalid paramter')
    return {status: "invalid paramter"}
  }

  const result = await Askship.putQuestion(openid, answerId, questionId, question, answer)
  await Askship.updateAnswerStatus(result._key, "read")
  return {status: "ok"}
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

const postAnswer = async (userId, param) => {
  const source = param.source
  const openid = await userIds.getOpenid(userId, source)
  if (!openid) {
    return {}
  }
  
  await Askship.updateAnswerForAsker(param.key, { source, asr: param.answerText, media: param.media, who: openid })
  return {}
}

module.exports = {
  'post-question-answer': postQuestionAnswer,
  'get-asking-list': getAskingList,
  'get-asked-list': getAskedList,
  'post-answer': postAnswer
}