var arango = require('arangojs');
const logger = require('../utils/logger').logger('arangoDb');

class ArangoDB {
    constructor(config) {
        this.db = null
        const Database = arango.Database
        this.db = new arango.Database(`http://${config.host}:${config.port}`)
        this.db.useDatabase(config.database)
        this.db.useBasicAuth(config.user, config.password)
        logger.info('arango db init success for', config.database)
    }

    /**
     * @returns {any}
     */
    get database() {
        return this.db
    }
}

module.exports = ArangoDB
