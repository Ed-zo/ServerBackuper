var Backuper = require('../Backuper');
var Deleter = require('../deleters/Deleter')

class DefaultBackuper extends Backuper {

    constructor(props) {
        super(props);

        if (this.deleteAfter != null) {
            this.deleter = new Deleter(this.out, this.deleteAfter, this.naming.prefix);
        }
    }

    async _run() {
        var { deleted } = await this.archive(this.generateName());

        return !deleted;
    }

}

module.exports = DefaultBackuper;