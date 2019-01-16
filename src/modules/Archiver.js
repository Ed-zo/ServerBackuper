var tar = require('tar');
var md5 = require('md5');
var fs = require('fs');

class Archiver {

    static archive(folder, files, out) {
        return tar.c({gzip: true, file: out, cwd: folder}, files);
    }

    static md5(file) {
        return new Promise(function(resolve, reject) {
            fs.readFile(file, function(err, buf) {
                if(err) reject(err)
                else resolve(md5(buf));
            });
        });
    }

}

module.exports = Archiver;