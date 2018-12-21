const Question  = require('./question')


const getAnswer = async (userId, param) => {
  return await Question.getAnswer(param.answerId, param.questionId)
}

module.exports = {
  'get-public-question-answer': getAnswer
}