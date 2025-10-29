

var args = process.argv.slice(2)
console.log(args)
// ----------------------
// let FILE = "words"
let FILE = args[0]
// ----------------------




let fs = require('fs')
let xml2js = require('xml2js')

let Interpretor = require('./lib/animInterpretor')
let Encryptor = require('./lib/encryptorAnim')

let _parser = new xml2js.Parser()

fs.readFile(__dirname + '/IN/' + FILE + '.dae', function (err, data) {
  _parser.parseString(data, function (err, result) {

    // printJson(result)

    console.log('  ');
    let parts = new Interpretor(result)    
    

    console.log('  ');
    console.log('Objects Infos');
    console.log("|-- Numbers of Objects :", parts.length)

    // Make json dictionary + binary file
    new Encryptor(parts, "/Users/dorianlods/Serveur/stuff/2018 Xmass_Xp/src/assets/models/" + FILE)

  })
})

function printJson(result){
    const content = JSON.stringify(result)
    fs.writeFile(__dirname + '/prout.json', content, 'utf8', function (err) {
        if (err) {
            return console.log(err)
        }
    })
}