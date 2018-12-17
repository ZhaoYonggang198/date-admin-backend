
const logger = require('../utils/logger').logger('arangoDb');
const ArangoDB = require('./arangoDb')
const config = require('../config');
const aql = require('arangojs').aql

const db = new ArangoDB(config.arango.userInfo).database

const userIdsCollection = db.collection("UserIds")

class Collection {
  constructor(db, collection) {
    this.db = db
    this.collection = db.collection(collection)
    this.collectionName = collection
  }

  async createDocument(openid, info) {
    const query = aql`
      UPSERT {openid: ${openid}}
      INSERT {openid: ${openid}, info: ${info}, dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
      UPDATE {openid: ${openid}, info: ${info}, updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
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
      })
  }

  async updateDocument(openid, info) {
    const query = aql`
    UPSERT {openid: ${openid}}
    INSERT {openid: ${openid}, info: ${info}, dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
    UPDATE {openid: ${openid}, info: ${info}, updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
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
      })  
  }

  async getDocument(openid) {
    const query = aql`
      for doc in ${this.collection}
        filter doc.openid == ${openid}
        return doc
      `
    return await this.db.query(query).then(cursor => cursor.next())
      .then(doc => {
        logger.debug(`get document ${doc} for ${openid} in ${this.collectionName}`)
        return doc
      },
      err => {
        logger.error(`get document in ${this.collectionName} fail ${err.message}`)
      })
  }
}

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
