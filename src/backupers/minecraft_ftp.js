var Backuper = require('../Backuper');
var ScreenCommander = require("../modules/ScreenCommander");
var Client = require('ftp');
var path = require('path');

class MinecraftFTPBackuper extends Backuper {

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

            var client = new Client();

            var result = await this.archive(this.generateName());

            if (!result.deleted) {
                var wait = new Promise((resolve, reject) => {

                    client.on('ready', () => {
                        var folder = path.posix.join(this.settings.remoteFolder, path.basename(result.out));
                        this.screen.send(`say Uploading archive to remote server...`);
                        this.log(`Uploading to remote server: ${folder}`);
                        
                        client.put(result.out, folder, (err) => {
                            if (err) {
                                reject(err);
                                this.screen.send(`say There was an error during uploading. Please report this to an admin. Time: ${new Date()}`);
                            } else {
                                this.log(`Uploading finished`);
                                this.screen.send(`say Uploading finished`);
                                resolve();
                            }

                            client.end();
                        });

                    });

                    client.connect(this.settings.ftp);
                });

                await wait;
            }
        }
    }

}

module.exports = MinecraftFTPBackuper;