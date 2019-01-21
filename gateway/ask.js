const Askship = require('../models/askship')
const userIds  = require('../models/userIds')

const postQuestionAnswer = async (userId, param) => {
  const source = param.source
  const questionId = param.questionId ? param.questionId : null
  const answerId = param.answerId
  const openid = await userIds.getOpenid(userId, source)
  const question = { source, asr: param.questionText, media: param.media }
  const answer = param.answer

  return await Askship.putQuestion(openid, answerId, questionId, question, answer)
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