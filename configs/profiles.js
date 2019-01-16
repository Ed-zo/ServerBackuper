module.exports = {

    "default": {
        name: "Default", //required
        type: "default", //default: default
        disabled: true,
        folder: "path_to_folder", //required
        files: [], //if empty profile works with all files in folder
        naming:  {
            type: 'unique', //default: unique, options: [unique, time]
            prefix: 'testing-', //default: empty
        },
        out: './'
    },

}