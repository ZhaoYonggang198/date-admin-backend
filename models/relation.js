const logger = require('../utils/logger').logger('relationCollection');
const aql = require('arangojs').aql
const config = require('../config')
const ArangoDB = require('./arangoDb')

class RelationshipCollection {
  constructor(db, collection) {
    this.db = db
    this.collection = db.collection(collection)
    this.collectionName = collection
  }

  async createDocument(subject, object, status) {
    const query = aql`
      UPSERT {subject: ${subject}, object: ${object}}
      INSERT {subject: ${subject}, object: ${object}, status: ${status}, dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
      UPDATE {subject: ${subject}, object: ${object}, status: ${status}, updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
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

  async updateDocument(subject, object, status) {
    const query = aql`
    UPSERT {subject: ${subject}, object: ${object}}
    INSERT {subject: ${subject}, object: ${object}, status: ${status}, dataCreated: DATE_ISO8601(DATE_NOW()), updates: 1}
    UPDATE {subject: ${subject}, object: ${object}, status: ${status}, updates: OLD.updates + 1, dateUpdate: DATE_ISO8601(DATE_NOW())}
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
        return {object: doc.object, profile: DOCUMENT("UserProfile/" + doc.object), status: DOCUMENT("UserStatus/"+ doc.object)}
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
        return {subject : doc.subject, profile: DOCUMENT("UserProfile/" + doc.subject), status: DOCUMENT("UserStatus/"+ doc.subject)}
    `

    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug('get subject user profile list', doc.length)
        return doc
      })
  }
}

class FavoriteshipCollection extends RelationshipCollection {
  constructor(db, collection, likeshipCollection) {
    super(db, collection)
    this.likeshipCollection = db.collection(likeshipCollection)
    this.likeshipCollectionName = likeshipCollection
  }

  async getFavoritingList(subject) {
    const query = aql`
      for doc in ${this.collection}
        filter doc.subject == ${subject} and doc.status == true
        let likeship = (for item in ${this.likeshipCollection}
          filter item.subject == doc.subject && item.object == doc.object
          return item)
        return {subject : doc.object,  
          profile: DOCUMENT("UserProfile/" + doc.object),
          status: DOCUMENT("UserStatus/"+ doc.object),
          liking: likeship[0].status}
    `

    return await this.db.query(query).then(cursor => cursor.all())
      .then(doc => {
        logger.debug('get object user profile list', doc.length)
        return doc
      },
      err => {
        logger.error(query)
        throw err
      })    
  }
}


const db = new ArangoDB(config.arango.userInfo).database

const likeshipCollection = new RelationshipCollection(db, 'Likeship')

const favoriteshipCollection = new FavoriteshipCollection(db, 'Favoriteship', 'Likeship')

const likeSomeone = async (subject, object, like) => {
  return await likeshipCollection.updateDocument(subject, object, like)
}

const getLikingList = async (subject) =>  {
  return await likeshipCollection.getObjectUserList(subject)
}

const getLikedList = async (object) => {
  return await likeshipCollection.getSubjectUserList(object)
}

const favoriteSomeone = async (subject, object, favorite) => {
  return await favoriteshipCollection.updateDocument(subject, object, favorite)
}

const getFavoritingList = async (subject) => {
  return await favoriteshipCollection.getFavoritingList(subject)
}

const getFavoritedList = async (object) => {
  return await favoriteshipCollection.getSubjectUserList(object)
}

module.exports = {
  likeSomeone,
  getLikingList,
  getLikedList,
  favoriteSomeone,
  getFavoritingList,
  getFavoritedList
}
