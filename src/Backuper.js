var Archiver = require('./modules/Archiver');
var fs = require('fs');
const path = require('path');
var Namer = require('./modules/NameCreator');
var CronJob = require('cron').CronJob;
var Deleter = require('./deleters/Deleter');
var dateFormat = require('dateformat');

class Backuper {

    constructor(props) {
        Object.assign(this, props);
        if (this.folder == null) throw 'Folder property not defined!';
        if (this.execute == null) throw 'Execution interval is not defined!';
        if (this.naming == null) {
            this.naming = { type: 'unique' };
        } else {
            if (this.naming.type == null || Namer[this.naming.type] == null) throw 'Unknown naming type!';
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
        if (this.job == null) {
            this.log('Starting...');
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
        try {
            this.log("Backuping has started...");
            var start = process.hrtime();
            var runDeleter = await this._run();
            if(runDeleter === true)
                await this.runDeleter();
            this.log(`Backuping finished in ${process.hrtime(start)} seconds`);
        } catch(err) {
            this.log('Error occured while backuping!')
            console.error(err);
        }
    }

    /**
    * Run backuping
    * @returns true if old archives should be deleted
    */
    async _run() {}

    /**
     * Delete old archives
     */
    async runDeleter() {
        if (this.deleter instanceof Deleter) {
            var deletedFiles = (await this.deleter.run()).filter(word => word != undefined);
            if (deletedFiles.length > 0)
                this.log(`Deleting: ${deletedFiles.join(', ')}`);
        }
    }

    /**
     * Archive files
     * @returns true if new archive was created, else false
     * @param {string} out File path
     */
    async archive(out) {
        if (this.worksWithFolder()) {
            var parsed = path.parse(this.folder);
            await Archiver.archive(parsed.dir, [parsed.name], out);
        } else {
            await Archiver.archive(this.folder, this.files, out);
        }

        var [currMD5, stats] = await Promise.all([Archiver.md5(out), new Promise((resolve, reject) => {
            fs.lstat(out, (err, stats) => {
                if(err) reject(err);
                else resolve(stats);
            });
        })]);

        if (this.lastArchive != null && currMD5 == this.lastArchive) {
            fs.unlink(out, (err) => {
                this.log("No need to have new archive (no file changed). Throwing away...");
            });
            return { deleted: true, stats, out };
        } else {
            this.lastArchive = currMD5;
            return { deleted: false, stats, out };
        }
    }

    log(msg) {
        console.log(`[${dateFormat(new Date(), 'dd.mm. HH:MM:ss')}] [${this.name}] ${msg}`);
    }
}


module.exports = Backuper;
