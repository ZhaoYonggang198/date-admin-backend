const logger = require('../utils/logger').logger('userProfile');
const UserStatus = require('../models/userStatus')

const saveUserStatus = async (ctx) => {
  try {
    logger.debug(`receive user Status update : ${JSON.stringify(ctx.request.body)}`);
    await UserStatus.saveUserStatus(ctx.request.body.session_key, ctx.request.body.status);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {result : 'success'};
  } catch(err) {
      ctx.response.status = 404;
      ctx.response.body = {result : 'failed'};
      logger.error('save profile info error: ' + err.message);
  }
}

const getUserStatus = async (ctx) => {
  try {
    logger.debug(`get user profile update : ${JSON.stringify(ctx.request.body)}`);
    let info = await UserStatus.getUserStatus(ctx.query.session_key);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = info.info;
  } catch(err) {
      ctx.response.status = 404;
      ctx.response.body = {result : 'failed'};
      logger.error('save profile info error: ' + err.message);
  }
}

const getUserStatusList = async (ctx) => {
  try {
    logger.debug(`get user profile update : ${JSON.stringify(ctx.request.body)}`);
    let info = await UserStatus.getUserStatusList(ctx.query.start, ctx.query.end);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = info;
  } catch(err) {
      ctx.response.status = 404;
      ctx.response.body = {result : 'failed'};
      logger.error('save profile info error: ' + err.message);
  }
}

module.exports = {
  'PUT /user-status': saveUserStatus,
  'POST /user-status': saveUserStatus,
  'GET /user-status': getUserStatus,
  'GET /user-status-list': getUserStatusList
}