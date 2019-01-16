var Profile = require('../Profile');
var NameCreator = require('../modules/NameCreator');

class DefaultProfile extends Profile {

    async run() {
        await this.archive( this.generateName() );
    }

}

module.exports = DefaultProfile;