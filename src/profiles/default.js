var Profile = require('../Profile');
var NameCreator = require('../modules/NameCreator');

class DefaultProfile extends Profile {

    async run() {
        await this.archive(NameCreator.createUnique(this.out, "test-"));
    }

}

module.exports = DefaultProfile;