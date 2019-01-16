var ProfileConfig = require("../configs/profiles");
var definedBackupers = require('../configs/default').backupers;
const BACKUPERS_PATH = __dirname + "/backupers/";

var BackuperClass = {};

for (var bName of definedBackupers) {
    BackuperClass[bName] = require(BACKUPERS_PATH + bName);
}

class ProfileLoader {

    static load() {
        this.profiles = {};
        for(var key in ProfileConfig) {
            var type = ProfileConfig[key].type || "default";
            var disabled = ProfileConfig[key].disabled || false;
            if(BackuperClass[type] == null) throw "Unknown profile type";
            if(disabled) continue;

            this.profiles[key] = new (BackuperClass[type])(ProfileConfig[key]);
        }
    }

    static getProfile(id) {
        return this.profiles[id];
    }

}


module.exports = ProfileLoader;