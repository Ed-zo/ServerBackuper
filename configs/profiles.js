module.exports = [

    {
        name: "Default", //required
        type: "default", //default: default
        disabled: true,
        execute: "0 * * * *", //https://crontab.guru
        folder: "path/to/folder", //required
        files: [], //if empty backuper works with all files in folder
        naming:  {
            type: 'unique', //default: unique, options: [unique, time]
            prefix: 'backup-', //default: empty
        },
        out: './'
    }

]