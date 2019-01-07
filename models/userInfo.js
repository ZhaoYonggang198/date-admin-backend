const logger = require('../utils/logger').logger('userInfo');
const ArangoDB = require('./arangoDb')
const config = require('../config');
const aql = require('arangojs').aql
const Collection = require('./userCollection').UserCollection

const db = new ArangoDB(config.arango.userInfo).database

const userIdsCollection = db.collection("UserIds")

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
  saveWechatInfo,
  getWechatInfo,
  saveUserProfile,
  getUserProfile
}
