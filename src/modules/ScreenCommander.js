var {run} = require('./ShellCommand');


class ScreenCommander {

    constructor(name) {
        this.name = name;
        this.checkScreen();
    }

    /**
     * Send command to the screen
     * @param {string} cmd command
     */
    send(cmd) {
        return run(`screen -S ${this.name} -p 0 -X stuff "${cmd}^M"`);
    }

    async checkScreen() {
        await run(`screen -ls ${this.name}`);
    }

}

module.exports = ScreenCommander;