const postJson = require('../utils/postjson')
const config = require('../config');
const accessToken = require('../utils/access-token');
const logger = require('../utils/logger').logger('wechatNotify');
const arangoDb = require("./arango.js")

async function sendTemplateMsg (openId, templateId, page, data) {
  const token = await accessTocken.getToken()
  const url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token
  const formId = await arangoDb.getFormId(openId)

  if (!formId) {
    logger.error('No available formId for openId:' + openId, 'formId', formId)
    throw new Error('No available formId')
  }

  await postJson(url, {
    template_id: templateId,
    page: page, // "plugin://myPlugin/chatDialog", 
    form_id: formId.formId,
    data,
    touser: openId
  });
  logger.info(`send template  ${templateId} success `)
  return true
}

module.exports = {
  sendTemplateMsg
}