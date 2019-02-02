var DefaultFTPBackuper = require('./default_ftp');
var ScreenCommander = require("../modules/ScreenCommander");
var FTPDeleter = require('../deleters/FTPDeleter');
var Client = require('ftp');
var fs = require('fs');
var path = require('path');

class MinecraftFTPBackuper extends DefaultFTPBackuper {

    constructor(props) {
        super(props);

        this.screen = new ScreenCommander(this.settings.screenName);
    }

    async _run() {
        if (this.screen != null) {
            this.screen.send("save-all");
            this.screen.send("say Backuping server started...");

            await new Promise((res, rej) => setTimeout(res, 1000));

            this.screen.send("save-off");
            var result = await this.archive(this.generateName());
            var size = result.stats.size / 1000000;
            this.screen.send(`say Archiving finished. Total size: ${size} MB`);

            var client = new Client();

            var result = await this.archive(this.generateName());

            this.screen.send("save-on");

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

                                if (this.settings.deleteOnUpload) {
                                    fs.unlink(result.out, (err) => {
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(true);
                                    });
                                } else {
                                    resolve(true);
                                }
                            }

                            client.end();
                        });

                    });

                    client.connect(this.settings.ftp);
                });

                return await wait;
            } else {
                return false;
            }
        }
    }

}

module.exports = MinecraftFTPBackuper;