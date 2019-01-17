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

  async getUserStatusListByTimeStamp (openid, offset, count) {
    const query = openid ? aql`
      for doc in ${this.collection}
        let user = DOCUMENT(CONCAT("UserProfile/",${openid})).info
        let profile = UNSET(DOCUMENT(CONCAT("UserProfile/",doc._key)), "_id", "_rev")
        filter user.sex == 'unknown' or (user.sex == 'male' and profile.info.sex == 'female') or (user.sex == 'female' and profile.info.sex == 'male')
        sort doc.info.timestamp desc
        limit ${offset}, ${count}
        let object = doc._key
        let favorite = (for item in Favoriteship
          filter item.subject == ${openid} and item.object == object and item.status
          return item.status)
        let liking = (for item in Likeship
          filter item.subject == ${openid} and item.object == object and item.status
          return item.status)
        return {status: doc, profile, favorite: favorite[0], liking: liking[0]}
    `
    : aql`for doc in ${this.collection}
        sort doc.info.timestamp desc
        limit 15
        let profile = UNSET(DOCUMENT(CONCAT("UserProfile/",doc._key)), "_id", "_rev")
        return {status: doc, profile, favorite: false, liking: false}
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

async function getUserStatusList (openid, offset, count) {
  return await userStatusCollection.getUserStatusListByTimeStamp(openid, offset, count)
}

module.exports = {
  saveUserStatus,
  getUserStatus,
  getUserStatusList
}
