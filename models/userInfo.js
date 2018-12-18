const logger = require('../utils/logger').logger('userInfo');
const ArangoDB = require('./arangoDb')
const config = require('../config');
const aql = require('arangojs').aql
const Collection = require('./userCollection').UserCollection

const db = new ArangoDB(config.arango.userInfo).database

const userIdsCollection = db.collection("UserIds")

async function saveOpenid(openid) {
  const query = aql`
    UPSERT {openid: ${openid}}
    INSERT {openid: ${openid}, status: "unregister", logins: 1, dataCreated: DATE_ISO8601(DATE_NOW())}
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

const wechatCollection = new Collection(db, 'Wechat')

async function saveWechatInfo(openid, wechat) {
  return await wechatCollection.createDocument(openid, wechat)
}

async function getWechatInfo(openid) {
  return await wechatCollection.getDocument(openid)
}

const userProfileCollection = new Collection(db, 'UserProfile')

async function saveUserProfile (openid, userProfile) {
  return await userProfileCollection.createDocument(openid, userProfile)
}

async function getUserProfile (openid) {
  return await userProfileCollection.getDocument(openid)
}

module.exports = {
  saveOpenid,
  saveWechatInfo,
  getWechatInfo,
  saveUserProfile,
  getUserProfile
}
