var fs = require('fs');
var path = require('path');

class Deleter {

    constructor(folder, deleteOlderThan, prefix) {
        this.folder = folder;
        this.deleteOlderThan = deleteOlderThan * 1000;

        if(prefix == null || prefix.trim() == "")
            throw "Prefix needs to be defined for deleter!";

        this.prefix = prefix;
    }

    run() {
        return new Promise((resolve, reject) => {

            fs.readdir(this.folder, async (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    files = files.filter((name) => name.substr(0, this.prefix.length) == this.prefix);
                    var deleted = await this.checkAndDelete(files);
                    resolve(deleted);
                }
            });

        });
    }

    checkAndDelete(files) {
        var promises = [];
        for (let file of files) {
            promises.push(new Promise((resolve, reject) => {
                file = path.posix.join(this.folder, file);

                fs.stat(file, (err, stats) => {
                    if (err) {
                        reject(err);
                    } else {

                        if (stats.mtime < (new Date().valueOf() - this.deleteOlderThan)) {
                            fs.unlink(file, (err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(file);
                                }
                            })
                        } else {
                            resolve();
                        }
                    }
                });

            }));
        }

        return Promise.all(promises);
    }

}

module.exports = Deleter;