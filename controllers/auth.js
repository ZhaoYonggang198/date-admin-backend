const config = require('../config');
const logger = require('../utils/logger').logger('AUTH');
const axios = require('axios')
const UserInfo = require('../models/userInfo')
const buildController = require('../utils/controller-producer')

const auth = buildController(
  async (ctx) => {
    const result = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: config.appid,
        secret: config.secret,
        js_code: ctx.request.body.code,
        grant_type: 'authorization_code'
      }
    });

    UserInfo.saveOpenid(result.data.openid)
    return {
      session_key: result.data.openid
    }
  },
  err => {
    logger.error('get openid error: ' + err);
  }
) 

module.exports = {
  'POST /auth': auth
}
