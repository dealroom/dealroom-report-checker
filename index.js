const commandLineArgs = require('command-line-args')
const JSONStream = require('JSONStream')
const fs = require('fs')
const es = require('event-stream')

const optionDefinitions = [
    { name: 'type', type: String, defaultOption: 'companies' },
    { name: 'file', type: String }
]

const options = commandLineArgs(optionDefinitions)

if (!options.file) {
    console.log('No file provided')
    process.exit(1)
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
                console.log('['+data.id+'] '+data.name)
                break;
            case 'rounds':
                console.log('['+data.id+'] '+data.round+' ('+data.company_name+')')
                break;
            default:
                throw new Error('Wrong type provided')
        }
        totalRows++
    }))

stream.on('end', function() {
    console.log('Total rows: '+totalRows)
})
