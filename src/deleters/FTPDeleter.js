var Client = require('ftp');
var Deleter = require('./Deleter');
var path = require('path');

class FTPDeleter extends Deleter {

    constructor(folder, deleteOlderThan, prefix, ftpSettings) {
        super(folder, deleteOlderThan, prefix);

        if (ftpSettings == null)
            throw 'FTP settings are not set!';

        this.ftpSettings = ftpSettings;
    }

    run() {

        return new Promise((resolve, reject) => {
            var client = new Client();

            client.on('ready', () => {
                client.list(this.folder, false, async (err, files) => {
                    if (err) {
                        reject(err);
                    } else {
                        try {
                            files = files.filter((file) => file.name.substr(0, this.prefix.length) == this.prefix);
                            var deleted = await this.checkAndDelete(files, client);
                            resolve(deleted);
                        } catch (err) {
                            reject(err);
                        }
                    }
                    client.end();
                });
            });

            client.on('error', (err) => {
                client.end();
                reject(err);
            });

            client.connect(this.ftpSettings);
        });
    }

    checkAndDelete(files, client) {
        var promises = [];
        for (let file of files) {
            promises.push(new Promise((resolve, reject) => {
                let fileName = path.posix.join(this.folder, file.name);
                if (file.date < (new Date().valueOf() - this.deleteOlderThan)) {
                    client.delete(fileName, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(fileName);
                        }
                    })
                } else {
                    resolve();
                }

            }));
        }

        return Promise.all(promises);
    }

}

module.exports = FTPDeleter;