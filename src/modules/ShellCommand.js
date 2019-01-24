var {exec} = require('child_process');

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if(error) {
                reject(error);
                return;
            }

            if(stderr) {
                reject(stderr);
                return;
            }

            resolve(stdout);
        });
    }).catch((err) => console.error(err));
}

module.exports.run = run;