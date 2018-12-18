const logger = require('../utils/logger').logger('userCollection');
const aql = require('arangojs').aql

class UserCollection {
  constructor(db, collection) {
    this.db = db
    this.collection = db.collection(collection)
    this.collectionName = collection
  }

  async createDocument(openid, info) {
    const query = aql`
      UPSERT {_key: ${openid}}
      INSERT {_key: ${openid}, info: ${info}, dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
      UPDATE {_key: ${openid}, info: ${info}, updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
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

  async updateDocument(openid, info) {
    const query = aql`
    UPSERT {_key: ${openid}}
    INSERT {_key: ${openid}, info: ${info}, dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
    UPDATE {_key: ${openid}, info: ${info}, updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
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
        throw(err)
      })
  }
}

module.exports = {
  UserCollection
}
