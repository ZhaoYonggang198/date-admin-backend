
const logger = require('../utils/logger').logger('arangoDb');
const ArangoDB = require('./arangoDb')
const config = require('../config');
const aql = require('arangojs').aql

const db = new ArangoDB(config.arango.userInfo).getDatabase()

const userIdsCollection = db.collection("userIds")

async function saveOpenid(openid) {
  const query = aql`
    UPSERT {openid: ${openid}}
    INSERT {openid: ${openid}, status: "unregister", logins: 1, dataCreated: DATE_NOW()}
    UPDATE {openid: ${openid}, logins: OLD.logins + 1} in ${userIdsCollection}
    return {doc: New, type: OLD ? 'update' : 'insert'}
  `
  return await db.query(query).then(cursor => cursor.next())
    .then(doc => {
      logger.debug('save openid success, doc is ', doc)
      return doc
    },
    err => {
      logger.error('saveOpenid fail')
    })
}

module.exports = {
  saveOpenid
}
