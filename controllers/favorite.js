const logger = require('../utils/logger').logger('favorite');
const relation = require('../models/relation')
const buildController = require('../utils/controller-producer')

const favorite = buildController(
  async (ctx) => {
    await relation.favoriteSomeone(ctx.request.body.session_key, ctx.request.body.object, ctx.request.body.favorite)
    return {result: "success"}
  },
  err => {
    logger.error('favorit some error: ', err.message)
  }
)

const getFavoritingList = buildController(
  async (ctx) => {
    return await relation.getFavoritingList(ctx.query.session_key)
  },
  err => {logger.error('get favoriting list: ' + err.message)}
)

const getFavoritedList = buildController(
  async (ctx) => {
    return await relation.getFavoritedList(ctx.query.session_key)
  },
  err => {logger.error('get farovited list error: ' + err.message)}
)

module.exports = {
  'GET /favorite' : getFavoritingList,
  'POST /favorite': favorite,
  'GET /favorited-list': getFavoritedList
}
