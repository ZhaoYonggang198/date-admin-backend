const logger = require('../utils/logger').logger('favorite');
const relation = require('../models/relation')

async function favorite(ctx) {
  try {
    await relation.favoriteSomeone(ctx.request.body.session_key, ctx.request.body.object, ctx.request.body.favorite);
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

async function getFavoritingList (ctx) {
  try {
    const data = await relation.getFavoritingList(ctx.query.session_key)
    ctx.response.type = "application/json"
    ctx.response.status = 200
    ctx.response.body = data    
  } catch (err) {
    ctx.response.status = 404;
    ctx.response.type = "application/json";
    ctx.response.body = {error: err.toString()};
    logger.error('get favorite list: ' + err.message);    
  }
}

module.exports = {
  'GET /favorite' : getFavoritingList,
  'POST /favorite': favorite
}
