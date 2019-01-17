var Archiver = require('./modules/Archiver');
var fs = require('fs');
const path = require('path');
var Namer = require('./modules/NameCreator');
var CronJob = require('cron').CronJob;
var dateFormat = require('dateformat');

class Backuper {

    constructor(props) {
        Object.assign(this, props);
        if(this.folder == null) throw 'Folder property not defined!';
        if(this.execute == null) throw 'Execution interval is not defined!';
        if(this.naming == null) {
            this.naming = {type: 'unique'};
        } else {
            if(this.naming.type == null || Namer[this.naming.type] == null) throw 'Unknown naming type!';
        }
    }

    worksWithFolder() {
        return this.files == null || (this.files instanceof Array && this.files.length == 0);
    }

    generateName() {
        var input = Object.assign({}, this.naming);
        input.path = this.out;
        return Namer[this.naming.type](input);
    }

    /**
     * Setups timer that will call run()
     */
    init() {
        if(this.job == null) {
            this.job = new CronJob(this.execute, this.runBackup.bind(this));
        }
    }

    /**
     * Start cron job
     */
    start() {
        this.job.start();
    }

    /**
     * Stop cron job
     */
    stop() {
        this.job.stop();
    }

    /**
     * Is cron running?
     */
    running() {
        return this.job.running;
    }

    /**
     * Start backuping process
     */
    async runBackup() {
        this.log("Backuping has started...");
        var start = process.hrtime();
        await this._run();
        this.log(`Backuping finished in ${process.hrtime(start)} seconds`);
    }

    /**
     * Archive files
     * returns true if new archive was created, else false
     * @param {string} out File path
     */
    async archive(out) {
        if(this.worksWithFolder()) {
            var parsed = path.parse(this.folder);
            await Archiver.archive(parsed.dir, [parsed.name], out);
        } else {
            await Archiver.archive(this.folder, this.files, out);
        }

        var currMD5 = await Archiver.md5(out);

        if(this.lastArchive != null && currMD5 == this.lastArchive) {
            fs.unlink(out, (err) => {
                this.log("No need to have new archive (no file changed). Deleting newly created one.");
            });
            return false;
        } else {
            this.lastArchive = currMD5;
            return true;
        }
    }

    log(msg) {
        console.log(`[${dateFormat(new Date(), 'dd.mm. HH:MM:ss')}] [${this.name}] ${msg}`);
    }
}


module.exports = Backuper;
