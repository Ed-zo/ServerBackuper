var fs = require('fs');
var path = require('path');

class Deleter {

    constructor(folder, deleteOlderThan) {
        this.folder = folder;
        this.deleteOlderThan = deleteOlderThan * 1000;
    }

    run() {
        return new Promise((resolve, reject) => {

            fs.readdir(this.folder, async (err, files) => {
                if(err) {
                    reject(err);
                } else {
                    
                    var deleted = await this.checkAndDelete(files);
                    resolve(deleted);
                }
            });

        });
    }

    checkAndDelete(files) {
        var promises = [];
        for(let file of files) {
            promises.push(new Promise((resolve, reject) => {
                file = path.join(this.folder, file);
                
                fs.stat(file, (err, stats) => {
                    if (err) {
                        reject(err);
                    } else {
                        
                        if (stats.mtime < (new Date().valueOf() - this.deleteOlderThan)) {
                            fs.unlink(file, (err) => {
                                if(err) {
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