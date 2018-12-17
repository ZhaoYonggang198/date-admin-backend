const logger = require('../utils/logger').logger('userProfile');
const UserInfo = require('../models/userInfo')

const saveUserProfile = async (ctx) => {
  try {
    logger.debug(`receive user profile update : ${JSON.stringify(ctx.request.body)}`);
    await UserInfo.saveUserProfile(ctx.request.body.session_key, ctx.request.body.profile);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {result : 'success'};
  } catch(err) {
      ctx.response.status = 404;
      ctx.response.body = {result : 'failed'};
      logger.error('save profile info error: ' + err.message);
  }
}

const getUserProfile = async (ctx) => {
  try {
    logger.debug(`get user profile update : ${JSON.stringify(ctx.request.body)}`);
    let info = await UserInfo.getUserProfile(ctx.query.session_key);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = info.info;
  } catch(err) {
      ctx.response.status = 404;
      ctx.response.body = {result : 'failed'};
      logger.error('save profile info error: ' + err.message);
  }
}

module.exports = {
  'PUT /user-profile': saveUserProfile,
  'POST /user-profile': saveUserProfile,
  'GET /user-profile': getUserProfile
}