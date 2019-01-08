const logger = require('../utils/logger').logger('userIds');
const ArangoDB = require('./arangoDb')
const config = require('../config');
const aql = require('arangojs').aql

const db = new ArangoDB(config.arango.userInfo).database

const userIdsCollection = db.collection("UserIds")

async function saveOpenid(openid) {
  const query = aql`
    UPSERT {openid: ${openid}}
    INSERT {openid: ${openid}, status: "unregister", logins: 1, dateCreated: DATE_ISO8601(DATE_NOW())}
    UPDATE {openid: ${openid}, logins: OLD.logins + 1} in ${userIdsCollection}
    return {doc: NEW, type: OLD ? 'update' : 'insert'}
  `
  return await db.query(query).then(cursor => cursor.next())
    .then(doc => {
      logger.debug('save openid success, doc is ', doc)
      return doc
    },
    err => {
      logger.error('saveOpenid fail ', err.message)
      logger.error(err)
    })
}

async function getOpenid(userId, userSource) {
  const query = aql`
    for doc in ${userIdsCollection}
      filter doc.${userSource}Id == ${userId}
      return doc.openid
  `
  return await db.query(query).then(cursor => cursor.next())
    .then(doc => {
      logger.debug('get open id success', doc)
      return doc
    },
    err => {
      logger.error(err)
      return null
    })
}

async function addUserId(openid, type, userId) {
  const query = aql`
    for doc in ${userIdsCollection}
      filter doc.openid == ${openid}
      update doc with {${type}Id: ${userId}} in ${userIdsCollection}
  `

  return await db.query(query).then(
    doc => {
      return
    },
    err => {
      logger.error(err)
      throw err
    }
  )
}

async function removeUser(openid, type) {
  const query = aql`
    for doc in ${userIdsCollection}
      filter doc.openid == ${openid}
      update doc with {${type}Id: null} in ${userIdsCollection}
  `

  return await db.query(query).then(
    () => {
      return
    },
    err => {
      logger.error(err)
      throw err
    }
  )  
}

module.exports = {
  saveOpenid,
  getOpenid,
  addUserId,
  removeUser
}