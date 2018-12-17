const logger = require('../utils/logger').logger('controller QuestionAnswer');
const Question = require('../models/question')

const questionAnswer = async (openid) => {
  const questions = await Question.questionList()
  const answers = await Question.getAnswerList(openid)
  return questions.map(item => {
    var questionId = item._key
    var qa = Object.assign(item, {questionId})
    var answer = answers.filter(ans => {
      return ans.questionId === questionId
    })
    return answer.length > 0 ? Object.assign(qa, answer[0]) : qa
  })
}

const updateAnswer = async (ctx) => {
  try {
    const result = await Question.putAnswer(ctx.request.body.session_key, 
      ctx.request.body.questionId,
      ctx.request.body.answer);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {result};
  } catch (err) {
      ctx.response.status = 404;
      ctx.response.type = "application/json";
      ctx.response.body = {error: err.toString()};
      logger.error('get Question Answer failed: ' + err.message);
  }
}

const getQuestionAnswer = async (ctx) => {
  try {
    const data = await questionAnswer(ctx.query.session_key);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {data};
  } catch (err) {
      ctx.response.status = 404;
      ctx.response.type = "application/json";
      ctx.response.body = {error: err.toString()};
      logger.error('get Question Answer failed: ' + err.message);
  }  
}

module.exports = {
  'GET /question-answer': getQuestionAnswer,
  'POST /answer': updateAnswer,
  'PUT /answer': updateAnswer
}