var Archiver = require('./modules/Archiver');
const path = require('path');

class Profile {

    constructor(props) {
        Object.assign(this, props);
        if(this.folder == null) throw('Folder property not defined!');
    }

    worksWithFolder() {
        return this.files == null || (this.files instanceof Array  && this.files.length == 0);
    }

    async start() {
        console.log(`[${this.name}] Archiving has started...`);
        var start = process.hrtime();
        await this.run();
        console.log(`[${this.name}] Archiving finished in ${process.hrtime(start)} seconds`);
    }

    archive(out) {
        if(this.worksWithFolder()) {
            var parsed = path.parse(this.folder);
            return Archiver.archive(parsed.dir, [parsed.name], out);
        } else {
            return Archiver.archive(this.folder, this.files, out);
        }
    }
}


module.exports = Profile;
