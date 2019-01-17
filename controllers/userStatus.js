const logger = require('../utils/logger').logger('userStatus');
const UserStatus = require('../models/userStatus')
const buildController = require('../utils/controller-producer')

const saveUserStatus = buildController(async (ctx) => {
  logger.debug(`receive user Status update : ${JSON.stringify(ctx.request.body)}`)
  await UserStatus.saveUserStatus(ctx.request.body.session_key, ctx.request.body.status)
  return {result: 'success'}
}, (err) => {
  logger.error('save user status: ' + err.message);
})

const getUserStatus = buildController(async ctx => {
  logger.debug(`get user status : ${JSON.stringify(ctx.query)}`)
  let info = await UserStatus.getUserStatus(ctx.query.session_key)
  return info.info
},
err => {
  logger.error('get user status error: ' + err.message);
})

const getUserStatusList = buildController(
  async ctx => {
    logger.debug(`get user status list, ${ctx.query.offset}, ${ctx.query.count}`)
    return await UserStatus.getUserStatusList(ctx.query.session_key, parseInt(ctx.query.offset), parseInt(ctx.query.count))
  },
  err => {
    logger.error('get user status list error: ' + err.message);
  }
)

module.exports = {
  'PUT /user-status': saveUserStatus,
  'POST /user-status': saveUserStatus,
  'GET /user-status': getUserStatus,
  'GET /user-status-list': getUserStatusList
}