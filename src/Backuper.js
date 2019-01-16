var Archiver = require('./modules/Archiver');
const path = require('path');
var Namer = require('./modules/NameCreator');

class Backuper {

    constructor(props) {
        Object.assign(this, props);
        if(this.folder == null) throw('Folder property not defined!');
        if(this.naming == null) {
            this.naming = {type: 'unique'};
        } else {
            if(this.naming.type == null || Namer[this.naming.type] == null) throw('Unknown naming type!');
        }
    }

    worksWithFolder() {
        return this.files == null || (this.files instanceof Array  && this.files.length == 0);
    }

    generateName() {
        var input = Object.assign({}, this.naming);
        input.path = this.out;
        return Namer[this.naming.type](input);
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


module.exports = Backuper;
