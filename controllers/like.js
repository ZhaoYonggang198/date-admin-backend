const logger = require('../utils/logger').logger('like');
const relation = require('../models/relation')

async function postLike(ctx) {
  try {
    await relation.likeSomeone(ctx.request.body.session_key, ctx.request.body.object, ctx.request.body.like);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {result: 'ok'};
  } catch (err) {
    ctx.response.status = 404;
    ctx.response.type = "application/json";
    ctx.response.body = {error: err.toString()};
    logger.error('post audio failed: ' + err.message);
  }
}

async function getLikedList (ctx) {
  try {
    const data = await relation.getLikedList(ctx.query.session_key)
    ctx.response.type = "application/json"
    ctx.response.status = 200
    ctx.response.body = data    
  } catch (err) {
    ctx.response.status = 404;
    ctx.response.type = "application/json";
    ctx.response.body = {error: err.toString()};
    logger.error('post audio failed: ' + err.message);    
  }
}

module.exports = {
  'GET /liked-list' : getLikedList,
  'POST /like': postLike
}
