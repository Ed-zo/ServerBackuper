var ProfileLoader = require('./ProfileLoader');

class Core {

    static init() {
        ProfileLoader.load();
        
        for(var name in ProfileLoader.profiles) {
            var profile = ProfileLoader.profiles[name];
            profile.start();
        }
    }

}

module.exports = Core;