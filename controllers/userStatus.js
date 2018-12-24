const logger = require('../utils/logger').logger('userStatus');
const UserStatus = require('../models/userStatus')
const buildController = require('../utils/controller-producer')

const saveUserStatus = buildController((ctx) => {
  logger.debug(`receive user Status update : ${JSON.stringify(ctx.request.body)}`)
  await UserStatus.saveUserStatus(ctx.request.body.session_key, ctx.request.body.status)
  return {result: 'success'}
}, (err) => {
  logger.error('save user status: ' + err.message);
})

const getUserStatus = buildController(ctx => {
  logger.debug(`get user status : ${JSON.stringify(ctx.query)}`)
  let info = await UserStatus.getUserStatus(ctx.query.session_key)
  return info.info
},
err => {
  logger.error('get user status error: ' + err.message);
})

const getUserStatusList = buildController(
  ctx => {
    logger.debug(`get user status list, ${ctx.query.start}, ${ctx.query.end}`)
    return await UserStatus.getUserStatusList(ctx.query.session_key, parseInt(ctx.query.start), parseInt(ctx.query.end))
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