const logger = require('../utils/logger').logger('userStatus');
const ArangoDB = require('./arangoDb')
const config = require('../config');
const Collection = require('./userCollection').UserCollection
const aql = require('arangojs').aql

const db = new ArangoDB(config.arango.userInfo).database

class UserStatusCollection extends Collection {
  constructor (db, collection) {
    super(db, collection)
  }

  async getUserStatusListByTimeStamp (start, end) {
    const query = aql`
      for doc in ${this.collection}
        sort doc.info.timestamp desc
        limit ${start}, ${end}
        let profile = DOCUMENT("UserProfile/"+doc._key)
        return {status: doc, profile}
    `

    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug(`get user status list for ${this.collectionName} success: `)
        return doc
      },
      err => {
        logger.error(query)
        logger.error(`get user status list for ${this.collectionName} fail`)
        throw err;
      })  
  }
}

const userStatusCollection = new UserStatusCollection(db, 'UserStatus')

async function saveUserStatus (openid, userStatus) {
  return await userStatusCollection.createDocument(openid, userStatus)
}

async function getUserStatus (openid) {
  return await userStatusCollection.getDocument(openid)
}

async function getUserStatusList (start, end) {
  return await userStatusCollection.getUserStatusListByTimeStamp(start, end)
}

module.exports = {
  saveUserStatus,
  getUserStatus,
  getUserStatusList
}
