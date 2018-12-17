const logger = require('../utils/logger').logger('wechat');
const UserInfo = require('../models/userInfo')

const saveWechat = async (ctx) => {
  try {
    logger.debug(`receive user wechat update : ${JSON.stringify(ctx.request.body)}`);
    await UserInfo.saveWechatInfo(ctx.request.body.session_key, ctx.request.body.wechat);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {result : 'success'};
  } catch(err) {
      ctx.response.status = 404;
      ctx.response.body = {result : 'failed'};
      logger.error('save wechat info error: ' + err.message);
  }
}

const getWechat = async (ctx) => {

}

module.exports = {
  'PUT /wechat/info': saveWechat,
  'POST /wechat/info': saveWechat,
  'GET /wechat/info': getWechat
}