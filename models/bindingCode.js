const logger = require('../utils/logger').logger('userIds');
const ArangoDB = require('./arangoDb')
const config = require('../config');
const aql = require('arangojs').aql

const db = new ArangoDB(config.arango.waterDrop).database

const collection = db.collection("waitingBindingAccount")

const getBindingCode = async (code, source) => {
  const query = aql`for doc in ${collection} 
  filter doc.bindingCode == ${code}  and doc.userType ==${source} and DATE_DIFF(DATE_NOW(), doc.timestamp, 'minute') < 5
  return doc `

  await db.query(query).then(cursor => cursor.next())
    .then(doc => {
      logger.debug('get binding code ', doc)
      if (!doc) {
        throw new Error('wrong bind code')
      }
      return doc
    },
    err => {
      logger.error('saveOpenid fail ', err.message)
      logger.error(query)
      throw err
    })
}

module.exports = {
  getBindingCode
}