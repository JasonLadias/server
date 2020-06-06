const fs = require('fs')
let timestamp = require('time-stamp')

exports.log = (path, request, response) => {
    const directory = `${__dirname}/../../Logs/${path}/${timestamp('YYYY_MM_DD')}.log`

    message = 'Resoise/n $O ------------'
    if (fs.existsSync(directory)) {
        fs.appendFileSync(directory, message)
    } else {
        fs.writeFileSync(directory, message)
    }
    
}