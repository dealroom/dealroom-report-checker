const commandLineArgs = require('command-line-args')
const JSONStream = require('JSONStream')
const fs = require('fs')
const es = require('event-stream')

const optionDefinitions = [
    { name: 'type', type: String, defaultOption: 'companies' },
    { name: 'file', type: String },
    { name: 'id', type: String }
]

const options = commandLineArgs(optionDefinitions)

if (!options.file) {
    console.log('No file provided')
    process.exit(1)
}

if (options.id) {
    options.id = parseInt(options.id)
}

let stream = fs.createReadStream(options.file, {encoding: 'utf8'})
let parser = JSONStream.parse('items.*')
let totalRows = 0

stream
    .pipe(parser)
    .pipe(es.mapSync(function (data) {
        switch (options.type) {
            case 'companies':
            case 'investors':
                if (options.id) {
                    if (options.id === parseInt(data.id)) {
                        console.log(JSON.stringify(data))
                    }
                } else {
                    console.log('['+data.id+'] '+data.name)
                }
                break;
            case 'rounds':
                if (options.id) {
                    if (options.id === parseInt(data.id)) {
                        console.log(JSON.stringify(data))
                    }
                } else {
                    console.log('['+data.id+'] '+data.round+' ('+data.company_name+')')
                }
                break;
            default:
                throw new Error('Wrong type provided')
        }
        totalRows++
    }))

stream.on('end', function() {
    console.log('Total rows: '+totalRows)
})
