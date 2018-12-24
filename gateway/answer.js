const Question  = require('../models/question')

const getAnswer = async (userId, param) => {
  var answer = await Question.getAnswer(param.answerId, param.questionId)
  return answer
}

module.exports = {
  'get-public-question-answer': getAnswer
}