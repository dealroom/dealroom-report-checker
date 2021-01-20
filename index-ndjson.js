const commandLineArgs = require('command-line-args')
const fs = require('fs')
const es = require('event-stream')
const readline = require('readline')

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

let totalRows = 0

const rl = readline.createInterface({
    input: fs.createReadStream(options.file, {encoding: 'utf8'}),
});

rl.on('line', function(line) {
    data = JSON.parse(line)
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
})

rl.on('close', function () {
    console.log('Total rows: '+totalRows)
})