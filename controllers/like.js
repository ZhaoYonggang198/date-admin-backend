const logger = require('../utils/logger').logger('like');
const relation = require('../models/relation')
const buildController = require('../utils/controller-producer')

const postLike = buildController(
  async (ctx) => {
    await relation.likeSomeone(ctx.request.body.session_key, ctx.request.body.object, ctx.request.body.like)
    return {result: 'success'}
  },
  err => {logger.error('post Lie failed: ' + err.message)}
)

const getLikedList = buildController(
  async (ctx) => {
    return await relation.getLikedList(ctx.query.session_key)
  },
  err => { logger.error('getLikedList failed: ' + err.message) }
)

module.exports = {
  'GET /liked-list' : getLikedList,
  'POST /like': postLike
}
