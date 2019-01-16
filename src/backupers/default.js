var Backuper = require('../Backuper');

class DefaultBackuper extends Backuper {

    async run() {
        await this.archive( this.generateName() );
    }

}

module.exports = DefaultBackuper;