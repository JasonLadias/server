const fs = require('fs')
let timestamp = require('time-stamp')

exports.log = (path, request, response) => {
    const directory = `${__dirname}/../../Logs/${path}/${timestamp('YYYY_MM_DD')}.log`

    let message = "\n-----------\n"+ timestamp('YYYY/MM/DD - HH:mm:ss') +"\n"
    message += "***Request***\n"
    message += request
    message += "\n***Response***\n"
    message += response
    message += "\n"

    if (fs.existsSync(directory)) {
        fs.appendFileSync(directory, message)
    } else {
        fs.writeFileSync(directory, message)
    }
    
}
