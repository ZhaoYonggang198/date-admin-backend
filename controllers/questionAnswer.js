const logger = require('../utils/logger').logger('controller QuestionAnswer');
const Question = require('../models/question')
const QA = require('../models/QA')
const buildController = require('../utils/controller-producer')

const questionAnswer = async (openid) => {
  const questions = await Question.questionList()
  const answers = await Question.getAnswerList(openid)

  return questions.map(item => {
    var questionId = item._key
    var qa = Object.assign(item, {questionId})
    delete qa._id
    delete qa._rev
    delete qa._key
    var answer = answers.filter(ans => {
      return ans.questionId === questionId
    })
    return answer.length > 0 ? Object.assign(qa, answer[0]) : qa
  })
}

const updateAnswer = buildController(
  async (ctx) => {
    const result = await Question.putAnswer(ctx.request.body.session_key, 
      ctx.request.body.questionId,
      ctx.request.body.answer)
    return {result}    
  },
  err => {logger.error('update  Answer failed: ' + err.message)}
)

const getQuestionAnswer = buildController(
  async (ctx) => {
    const data = await questionAnswer(ctx.query.session_key)
    return {data}
  },
  err => { logger.error('get Question Answer failed: ' + err.message) }
)

const askQuestion = buildController(
  async (ctx) => {
    logger.debug('ask question ', JSON.stringify(ctx.request.body))
    const answer = await QA.askQuestion(ctx.request.body.session_key, ctx.request.body.ask.who, ctx.request.body.ask)
    return {answer}
  },
  err => { logger.error('ask Question  failed: ' + err && err!==null ? err.message : 'unknow error') }
)

module.exports = {
  'GET /question-answer': getQuestionAnswer,
  'POST /public-question/answer': updateAnswer,
  'PUT /public-question/answer': updateAnswer,
  'POST /ask-question': askQuestion
}