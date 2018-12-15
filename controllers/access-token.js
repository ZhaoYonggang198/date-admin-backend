const accessToken = require('../utils/access-token');
const logger = require('../utils/logger').logger('controller_access_token');

async function getAccessToken(ctx) {
    try {
        const token = await accessToken.getToken();
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {token : token};
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get access token failed: ' + err);
    }
}

module.exports = {
    'GET /token' : getAccessToken
}