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

  async createDocument(subject, object, question, answer, status) {
    const query = aql`
      UPSERT {subject: ${subject}, object: ${object}}
      INSERT {subject: ${subject}, object: ${object},
        question: ${question},
        answer: ${answer},
        status: ${status},
        dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
      UPDATE {subject: ${subject}, object: ${object}, 
        question: ${question},
        answer: ${answer},
        status: ${status},
        updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
      IN ${this.collection}
      return NEW
    `

    return await this.db.query(query).then(cursor => cursor.next())
      .then(doc => {
        logger.debug(`create document for ${this.collectionName} success: ${JSON.stringify(doc)}`)
        return doc
      },
      err => {
        logger.error(`create document for ${this.collectionName} fail ${err.message}`)
        throw(err)
      })
  }

  async updateDocument(subject, object, question, answer, status) {
    const query = aql`
      UPSERT {subject: ${subject}, object: ${object}}
      INSERT {subject: ${subject}, object: ${object},
        question: ${question},
        answer: ${answer},
        status: ${status},
        dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
      UPDATE {subject: ${subject}, object: ${object}, 
        question: ${question},
        answer: ${answer},
        status: ${status},
        updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
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
        filter doc.subject == ${subject} and doc.status == true
        return {object: doc.object, profile: DOCUMENT(CONCAT("UserProfile/",doc.object)), status: DOCUMENT(CONCAT("UserStatus/",doc.object))}
    `

    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug('get object user profile list', doc.length)
        return doc
      })
  }

  async getSubjectUserList(object) {
    const query = aql`
      for doc in ${this.collection}
        filter doc.object == ${object} and doc.status == true
        return {key: doc._key, subject : doc.subject, profile: DOCUMENT(CONCAT("UserProfile/",doc.subject)), question: doc.question, answer: doc.answer, status: doc.status}
    `

    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug('get subject user profile list', doc.length)
        return doc
      })
  }

  async updateAnswerForAsker(key, answer) {
    return await this.collection.update(key, {answer, status: 'unread'}).then(doc => {
      logger.debug(`update answer for asker ${key} success`)
      return doc
    })
  }

  async updateAnswerForQuestion(questionId, answer) {
    const query = aql`
      for doc in ${this.collection}
        filter doc.question.questionId == ${questionId}
        update doc WITH 
          {answer: ${answer}, status: 'unread', updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
          in ${this.collection}
        return NEW
    `
    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug(`update answer for question ${questionId} success`)
        return doc
      })
  }

  async updateStatus(key, status) {
    return await this.collection.update(key, {status}).then(doc => {
      logger.debug(`update status ${key} success`)
      return doc
    })    
  }
}

const db = new ArangoDB(config.arango.userInfo).database

const askshipCollection = new AskshipCollection(db)

const putQuestion = async (subject, object, question, answer, status) => {
  return await askshipCollection.createDocument(subject, object, question, answer, status)
}

const updateAnswerForAsker = async (subject, object, question, answer, status) => {
  return await askshipCollection.updateDocument(subject, object, question, answer, status)
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

module.exports = {
  putQuestion,
  updateAnswerForAsker,
  updateAnswerForQuestion,
  updateStatus
}