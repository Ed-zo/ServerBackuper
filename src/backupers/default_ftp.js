var Backuper = require('../Backuper');
var FTPDeleter = require('../deleters/FTPDeleter');
var Client = require('ftp');
var fs = require('fs');
var path = require('path');

class DefaultFTPBackuper extends Backuper {

    constructor(props) {
        super(props);
        if (this.settings == null || this.settings.screenName == null)
            throw 'Screen name setting is not set!';

        if (this.settings == null || this.settings.ftp == null)
            throw 'FTP settings are not set!';

        if (this.settings.deleteOnUpload == null) {
            this.settings.deleteOnUpload = false;
        }

        if (this.deleteAfter != null) {
            this.deleter = new FTPDeleter(this.settings.remoteFolder, this.deleteAfter, this.settings.ftp);
        }
    }

    async _run() {
        var client = new Client();

        var result = await this.archive(this.generateName());

        if (!result.deleted) {
            var wait = new Promise((resolve, reject) => {

                client.on('ready', () => {
                    var folder = path.posix.join(this.settings.remoteFolder, path.basename(result.out));
                    this.log(`Uploading to remote server: ${folder}`);

                    client.put(result.out, folder, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            this.log(`Uploading finished`);

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

module.exports = DefaultFTPBackuper;