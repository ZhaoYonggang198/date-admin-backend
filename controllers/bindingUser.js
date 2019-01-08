const bindingCode = require("../models/bindingCode")
const userIds = require("../models/userIds")
const logger = require('../utils/logger').logger('bindingUser');
const buildController = require('../utils/controller-producer')

const bindUser = buildController(
  async (ctx) => {
    const code = await bindingCode.getBindingCode(ctx.request.body.code, ctx.request.body.type)
    if (code) {
      userIds.addUserId(ctx.request.body.session_key, ctx.request.body.type, code.userId)
      return {result: 'ok'}
    }
  },
  err => { logger.error('bindUser failed: ' + err.message) }
)

const unbindUser = buildController(
  async (ctx) => {
    await userIds.removeUser(ctx.request.body.session_key, ctx.request.body.type)
    return {result: 'ok'}
  },
  err => { logger.error('unbind user failed: ', err.message ) }
)

const bindingPlat = buildController(
  async (ctx) => {
    return await userIds.getBindingPlat(ctx.request.body.session_key)
  },
  err => { logger.error('unbind user failed: ', err.message ) }  
)
module.exports = {
    'GET /bindingPlat'  : bindingPlat,
    'POST /bind' : bindUser,
    'POST /unbind' : unbindUser
};
