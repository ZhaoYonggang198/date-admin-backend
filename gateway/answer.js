const Question  = require('../models/question')
const Askship = require('../models/askship')

const getAnswer = async (userId, param) => {
  var answer = await Question.getAnswer(param.answerId, param.questionId)
  return answer?answer:{}
}

module.exports = {
  'get-public-question-answer': getAnswer
}