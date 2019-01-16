var shortid = require('shortid');
var dateFormat = require('dateformat');

function uniqueName({path = '', prefix = '', extension = 'tar.gz'}) {
    return `${path}/${prefix}${shortid.generate()}.${extension}`;
}

function nameByDate({path = '', prefix = '', extension = 'tar.gz', format = 'dd-mm-yyyy_hh-MM', date = new Date()}) {
    return `${path}/${prefix}${dateFormat(date, format)}.${extension}`;
}

module.exports.unique = uniqueName;
module.exports.time = nameByDate;