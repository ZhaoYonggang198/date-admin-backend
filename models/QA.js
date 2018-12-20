const logger = require('../utils/logger').logger('question')
const config = require('../config')

const Chatbot = require('darwin-sdk').Chatbot;
const Query = require('darwin-sdk').Query;
const Response = require('darwin-sdk').Response;

const Question  = require('./question')

const Askship = require('./askship')

const chatbot = new Chatbot(config.chatbot_url, config.qa_agent, 'date-backend')

const questionClassify = async (openid, question) => {
  const res = await chatbot.dispose(new Query(openid, question))

  const instructs = res.getInstructs()

  let result = null

  if (!instructs) {
    return null
  }

  for (let instruct of instructs) {
    if (instruct.type === 'question-id') {
      result = instruct
    }
  }
  return result
}

const askQuestion = async (askerOpenId, answerOpenid, question) => {
  const classify = await questionClassify(askerOpenId, question.asr)

  let questionId = null

  if (!classify) {
    return await Askship.putQuestion(askerOpenId, answerOpenid, questionId, {url: question.url, asr: question.asr}, null, 'no-answer')
  }

  questionId = `${classify['question-id']}`

  const answer = await Question.getAnswer(answerOpenid, questionId)

  if (!answer) {
    return await Askship.putQuestion(askerOpenId, answerOpenid, questionId,
      {url: question.url, asr: question.asr},
      null,
      'no-answer'
    )
  }

  return await Askship.putQuestion(askerOpenId, answerOpenid, questionId,
      {url: question.url, asr: question.asr, questionId: classify.questionId},
      answer,
      'unread')
}

module.exports = {
  askQuestion
}
