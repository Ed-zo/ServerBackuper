var shortid = require('shortid');
var dateFormat = require('dateformat');

class NameCreator {
    
    static createUnique(path = '', prefix = '', exten = 'tar.gz') {
        return `${path}/${prefix}${shortid.generate()}.${exten}`;
    }

    static createByDate(format, date = new Date(), path = '', prefix = '', exten = 'tar.gz') {
        return `${path}/${prefix}${dateFormat(date, format)}.${exten}`;
    }

}

module.exports = NameCreator;