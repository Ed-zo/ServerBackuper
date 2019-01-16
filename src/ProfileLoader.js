var ProfileConfig = require("../configs/profiles");
var definedProfiles = require('../configs/default').profileList;
const PROFILESS_PATH = __dirname + "/profiles/";

var ProfileClass = {};

for (var profName of definedProfiles) {
    ProfileClass[profName] = require(PROFILESS_PATH + profName);
}

class ProfileLoader {

    static load() {
        this.profiles = {};
        for(var key in ProfileConfig) {
            var type = ProfileConfig[key].type || "default";
            var disabled = ProfileConfig[key].disabled || false;
            if(ProfileClass[type] == null) throw "Unknown profile type";
            if(disabled) continue;

            this.profiles[key] = new (ProfileClass[type])(ProfileConfig[key]);
        }
    }

    static getProfile(name) {
        return this.profiles[name];
    }

}


module.exports = ProfileLoader;