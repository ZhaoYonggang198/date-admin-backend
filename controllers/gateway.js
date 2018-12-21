const fs = require('fs');
const logger = require('../utils/logger').logger('gateway');

function convert_to_openId(userId){
    var openId = (userId.length == 28) ? userId : userId.replace("_D_", "-")
    return openId
}

function mappingGateway() {
  var gatewayHandle = {}
  fs.readdirSync(__dirname + '/../gateway').filter((f) => {
    return f.endsWith('.js');
  }).forEach(file => {
    let gatewayItem = require('../gateway/' + file)
    for (let api in gatewayItem) {
      gatewayHandle[api] = gatewayItem[api]
      logger.debug('add API gateway ', api)
    }
  })
  return gatewayHandle
}

const apiHandlers = mappingGateway()

const apiHandle = async (req) => {
    const userId = convert_to_openId(req.userId);
    const api = req.api;
    const params = req.arguments;
    let result = null;
    let handler = apiHandlers[api]
    if (handler) {
      result = await handler(userId, params)
    } else {
      result = 'unknown gateway api : ' + api;
      logger.error(result);
    }
  
    return {
        status : {code : 200, errorType : 'success'},
        result : result
    };
};

const gatewayApi = async (ctx) => {
    try {
        const req = ctx.request.body;
        logger.debug(`receive gateway request : ${JSON.stringify(req)}`);
        const rsp = await apiHandle(req);
        logger.debug(`gateway response is ${JSON.stringify(rsp)}`)
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = rsp;
    } catch(err) {
        ctx.response.status = 404;
        logger.error('gateway api error: ' + err);
        logger.debug(err.stack);
    }
};

module.exports = {
    'POST /gateway' : gatewayApi
}