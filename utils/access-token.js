const axios = require('axios');
const config = require('../config')
const logger = require('./logger').logger('util_access_token');

class AccessToken {
    constructor() {
        this.value = null;
        this.freshTimeStamp = 0;
        this.expiryTimeStamp = 0;
    }

    async getToken() {
        if (this.isExpired) {
            await this.updateTocken();
        }
        return this.value;
    }

    get isExpired() {
        const now = Math.floor(Date.now() / 1000);
        return (this.expiryTimeStamp - now) < 3600;
    }

    async updateToken() {
        try {
            logger.debug('try update access token from wechat');
            const result = await axios.get('https://api.weixin.qq.com/cgi-bin/token',
                {
                    params: {
                        appid: config.appid,
                        secret: config.secret,
                        grant_type: 'client_credential'
                    }
                }
            );
            if (result.data.errcode) {
                throw Error(result.data.errmsg);
            }
            this.freshTimeStamp = Math.floor(Date.now() / 1000);
            this.expiryTimeStamp = this.freshTimeStamp + result.data.expires_in;
            this.value = result.data.access_token;
            logger.info(`get new access token ${this.value} in timestamp ${this.freshTimeStamp}`);

        } catch (err) {
            logger.error('update access token error : ' + err);
            throw err;
        }
    }
}

const accessToken = new AccessToken();

module.exports = accessToken;

