const logger = require('../utils/logger').logger('question')
const ArangoDB = require('./arangoDb')
const config = require('../config')
const aql = require('arangojs').aql

const db = new ArangoDB(config.arango.userInfo).database

const QuestionCollection = db.collection('Questions')

const AnswerCollection = db.collection('Answers')

const questionList = async () => {
  const query = aql`
    for doc in ${QuestionCollection}
      return doc
  `

  return await db.query(query).then(cursor => cursor.all())
    .then(doc => {
      logger.debug('get question list, total num ', doc.length)
      return doc
    },
    err => {
      logger.error('get question list fail ', err.message)
    })
}

const putAnswer = async (openid, questionId, answer) => {
  const query = aql`
    UPSERT {openid: ${openid}, questionId: ${questionId}}
    INSERT {openid: ${openid}, questionId: ${questionId}, answer: ${answer}, dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
    UPDATE {openid: ${openid}, questionId: ${questionId}, answer: ${answer}, updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
    IN ${tAnswerCollection}
    return NEW
  `
  return await db.query(query).then(cursor => cursor.next())
    .then(doc => {
      logger.debug('update answer success ', JSON.stringify(doc))
      return doc
    },
    err => {
      logger.error('update answer fail ', err.message)
    })
}

const getAnswerList = async (openid) => {
  const query = aql`
    for doc in ${AnswerCollection}
      filter doc.openid == ${openid}
      return doc
  `
  return await db.query(query).then(cursor => cursor.all())
    .then(doc => {
      logger.debug('get answer list success')
      return doc
    },
    err => {
      logger.error('get answer list fail ', err.message)
    })
}

module.exports = {
  questionList,
  putAnswer,
  getAnswerList
}