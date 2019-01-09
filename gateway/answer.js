const Question  = require('../models/question')
const Askship = require('../models/Askship')

const getAnswer = async (userId, param) => {
  var answer = await Question.getAnswer(param.answerId, param.questionId)
  return answer
}

const postQuestionAnswer = async (userId, param) => {
  const source = param.source
  const questionId = param.questionId ? param.questionId : null
  const answerId = param.answerId
  const openid = userIds.getOpenid(userId, source)
  const question = { source, asr: param.questionText, media: param.media }
  const answer = param.answer

  return await Askship.putQuestion(openid, answerId, questionId, question, answer)
}

module.exports = {
  'get-public-question-answer': getAnswer,
  'post-question-answer': postQuestionAnswer
}