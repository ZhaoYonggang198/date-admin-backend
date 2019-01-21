const logger = require('../utils/logger').logger('relationCollection');
const aql = require('arangojs').aql
const config = require('../config')
const ArangoDB = require('./arangoDb')

class AskshipCollection {
  constructor(db) {
    this.db = db
    this.collection = db.collection('Askship')
    this.collectionName = 'Askship'
  }

  async updateDocumentWithoutQuestionId(subject, object, question, answer) {
    const query = aql`
      INSERT {subject: ${subject}, object: ${object},
        question: ${question},
        answer: ${answer},
        questionDate: DATE_ISO8601(DATE_NOW()),
        questionStatus: 'unread'}
      IN ${this.collection}
      return NEW
    `

    return await this.db.query(query).then(cursor => cursor.next())
      .then(doc => {
        logger.debug(`create document for ${this.collectionName} success: ${JSON.stringify(doc)}`)
        return doc
      },
      err => {
        logger.error(query)
        logger.error(`create document for ${this.collectionName} fail ${err.message}`)
        throw(err)
      })
  }

  async updateDocument(subject, object, questionId, question, answer) {
    const query = aql`
      INSERT {subject: ${subject}, object: ${object}, questionId: ${questionId},
        question: ${question},
        answer: ${answer},
        questionId: ${questionId},
        questionDate: DATE_ISO8601(DATE_NOW()),
        answerDate: DATE_ISO8601(DATE_NOW()),
        questionStatus: 'unread',
        answerStatus: 'unread'}
      IN ${this.collection}
      return NEW
    `

    return await this.db.query(query).then(cursor => cursor.next())
      .then(doc => {
        logger.debug(`update document for ${this.collectionName} success: ${JSON.stringify(doc)}`)
        return doc
      },
      err => {
        logger.error(`update document for ${this.collectionName} fail ${err.message}`)
        throw(err)
      })  
  }

  async getObjectUserList(subject) {
    const query = aql`
      for doc in ${this.collection}
        filter doc.subject == ${subject}
        let profile = UNSET(DOCUMENT(CONCAT("UserProfile/",doc.object)), "_id", "_rev")
        return MERGE(unset(doc, "_id", "_rev"), {profile})
    `

    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug('get object user profile list', doc.length)
        return doc
      },
      err => {
        logger.error(`some thing error`, JSON.stringify(query))
        throw err
      })
  }

  async getSubjectUserList(object) {
    const query = aql`
      for doc in ${this.collection}
        filter doc.object == ${object}
        let profile = UNSET(DOCUMENT(CONCAT("UserProfile/",doc.subject)), "_id", "_rev")
        return MERGE(unset(doc, "_id", "_rev"), {profile})
    `

    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug('get subject user profile list', doc.length)
        return doc
      })  
  }

  async updateAnswerForAsker(key, answer) {
    return await this.collection.update(key, {
        answer:{answer},
        answerStatus: 'unread',
        answerDate: new Date().toISOString()
      }).then(doc => {
          logger.debug(`update answer for asker ${key} success`)
          return doc
        })
  }

  async updateAnswerForQuestion(questionId, answer) {
    const query = aql`
      for doc in ${this.collection}
        filter doc.questionId == ${questionId}
        update doc WITH 
          {answer: ${answer}, answerStatus: 'unread', 
          answerDate: DATE_ISO8601(DATE_NOW()
        }
          in ${this.collection}
        return NEW
    `
    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug(`update answer for question ${questionId} success`)
        return doc
      })
  }

  async updateQuestionStatus(key, status) {
    return await this.collection.update(key, {questionStatus: status}).then(doc => {
      logger.debug(`update status ${key} success`)
      return doc
    })    
  }

  async updateAnswerStatus(key, status) {
    return await this.collection.update(key, {answerStatus: status}).then(doc => {
      logger.debug(`update status ${key} success`)
      return doc
    })    
  }
}

const db = new ArangoDB(config.arango.userInfo).database

const askshipCollection = new AskshipCollection(db)

const putQuestion = async (subject, object, questionId, question, answer) => {
  if (questionId) {
    return await askshipCollection.updateDocument(subject, object, questionId, question, answer)
  } else {
    return await askshipCollection.updateDocumentWithoutQuestionId(subject, object, question, answer)
  }
}
const updateAnswerForAsker = async (key, answer) => {
  return await askshipCollection.updateAnswerForAsker(key, answer)
}

const updateAnswerForQuestion = async (questionId, answer) => {
  return await askshipCollection.updateAnswerForQuestion(questionId, answer)
}

const updateStatus = async (key, status) => {
  return await askshipCollection.updateStatus(key, status)
}

const askedList = async (object) => {
  return await askshipCollection.getSubjectUserList(object)
}

const askingList = async (subject) => {
  return await askshipCollection.getObjectUserList(subject)
}

const updateQuestionStatus = async (key, status) => {
  return await askshipCollection.updateQuestionStatus(key, status)
}

const updateAnswerStatus = async (key, status) => {
  return await askshipCollection.updateAnswerStatus(key, status)
}

module.exports = {
  putQuestion,
  updateAnswerForAsker,
  updateAnswerForQuestion,
  updateStatus,
  askedList,
  askingList,
  updateQuestionStatus,
  updateAnswerStatus
}