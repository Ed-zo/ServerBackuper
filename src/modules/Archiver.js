var tar = require('tar');
var crypto = require('crypto');
var fs = require('fs');

class Archiver {

    static archive(folder, files, out) {
        return tar.c({ gzip: true, file: out, cwd: folder }, files);
    }

    static md5(file) {
        return new Promise(function (resolve, reject) {
            var hash = crypto.createHash('md5'),
                stream = fs.createReadStream(file);

            stream.on('data', function (data) {
                hash.update(data, 'utf8');
            });

            stream.on('end', function () {
                resolve(hash.digest('hex'));
            });
        });
    }

}

module.exports = Archiver;