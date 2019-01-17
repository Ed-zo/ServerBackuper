var Archiver = require('./modules/Archiver');
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

    archive(out) {
        //TODO - save reference to the last archived file
        if(this.worksWithFolder()) {
            var parsed = path.parse(this.folder);
            return Archiver.archive(parsed.dir, [parsed.name], out);
        } else {
            return Archiver.archive(this.folder, this.files, out);
        }
    }

    log(msg) {
        console.log(`[${dateFormat(new Date(), 'dd.mm. HH:MM:ss')}] [${this.name}] ${msg}`);
    }
}


module.exports = Backuper;
