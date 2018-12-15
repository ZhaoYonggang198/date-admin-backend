var arango = require('arangojs');
const logger = require('../utils/logger').logger('arangoDb');

class ArangoDB {
    constructor(config) {
        this.db = null
        Database = arango.Database
        this.db = new arango.Database(`http://${config.host}:${config.port}`)
        this.db.useDatabase(config.database)
        this.db.useBasicAuth(config.user, config.password)
        logger.info('arango db init success', config)
    }

    /**
     * @returns {any}
     */
    get getDatabase() {
        return this.db
    }

    get collection(col) {
        return this.db.collection(col)
    }
}

module.exports = ArangoDB