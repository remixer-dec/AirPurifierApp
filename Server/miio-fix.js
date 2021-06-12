//this file fixes double coma bug in output, run it once
const fs = require('fs')
let filename = './node_modules/miio/lib/safeishJSON.js'
file = fs.readFileSync(filename).toString('utf-8')
file = file.replace('str =',"str = str.replace(',,', ',');\n str =")
fs.writeFileSync(filename, file)
console.log('FIXED')
