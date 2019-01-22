var Backuper = require('../Backuper');
var Screen = require("../modules/Screen");

class MinecraftBackuper extends Backuper {

    constructor(props) {
        super(props);
        if(this.settings == null || this.settings.screenName == null)
            throw 'Screen name setting is not set!';

        this.screen = new Screen(this.settings.screenName);
    }

    async _run() {
        if(this.screen != null) {
            this.screen.send("say Backuping server...");
        }

        await this.archive( this.generateName() );
    }

}

module.exports = MinecraftBackuper;