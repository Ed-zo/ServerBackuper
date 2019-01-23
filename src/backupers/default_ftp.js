var Backuper = require('../Backuper');
var Client = require('ftp');
var path = require('path');

class DefaultFTPBackuper extends Backuper {

    constructor(props) {
        super(props);
    }

    async _run() {
        var client = new Client();

        var result = await this.archive(this.generateName());

        if(!result.deleted) {
            var wait = new Promise((resolve, reject) => {
                
                client.on('ready', () => {
                    var folder = path.posix.join(this.settings.remoteFolder, path.basename(result.out));
                    this.log(`Uploading to remote server: ${folder}`);

                    client.put(result.out, folder, (err) => {
                        if(err) { 
                            reject(err);
                        } else {
                            this.log(`Uploading finished`);
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

module.exports = DefaultFTPBackuper;