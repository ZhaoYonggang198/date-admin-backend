const config = require('../config');
const logger = require('../utils/logger').logger('userInfo');
const axios = require('axios')

const auth = async (ctx) => {
  try {
    const result = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: config.appid,
        secret: config.secret,
        js_code: ctx.query.code,
        grant_type: 'authorization_code'
      }
    });

    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {
      session_key: result.data.openid
    };
  } catch (err) {
    ctx.response.status = 404;
    logger.error('get openid error: ' + err);
  }
}


module.exports = {
  'POST /auth': auth
}