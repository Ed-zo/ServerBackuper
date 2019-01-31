var DefaultBackuper = require('../backupers/default');
var ScreenCommander = require("../modules/ScreenCommander");

class MinecraftBackuper extends DefaultBackuper {

    constructor(props) {
        super(props);
        if (this.settings == null || this.settings.screenName == null)
            throw 'Screen name setting is not set!';

        this.screen = new ScreenCommander(this.settings.screenName);
    }

    async _run() {
        if (this.screen != null) {
            this.screen.send("say Backuping server started...");
            var result = await this.archive(this.generateName());
            var size = result.stats.size / 1000000;
            this.screen.send(`say Archiving finished. Total size: ${size} MB`);

            return !result.deleted;
        }
        return false;
    }

}

module.exports = MinecraftBackuper;