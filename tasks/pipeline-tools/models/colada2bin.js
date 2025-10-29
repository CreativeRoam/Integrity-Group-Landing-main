// 
var args = process.argv.slice(2)
// ----------------------
let FILE = args[0]
let hasAnimations = args[1] ? true : false
// ----------------------

let fs     = require('fs')
let xml2js = require('xml2js')

let Interpretor = require('./lib/coladaInterpretor')
let Encryptor = require('./lib/encryptor')
let InterpretorAnim = require('./lib/animInterpretor')
let EncryptorAnim = require('./lib/encryptorAnim')
let _parser = new xml2js.Parser()

fs.readFile(__dirname + '/../../../assets/models/' + FILE + '.dae', function (err, data) {
    _parser.parseString(data, function (err, result) { 
        
        console.log('  ');
        let parts = new Interpretor(result, {
            onlyVertices: false,
            scale: 1,
            optimize: true,
            indexed: true,
            mergeUV: false,
            skipIndicies: false,
            flipUV: true
        })
        let anims
        if (hasAnimations) {
            anims = new InterpretorAnim(result)    
        }
        
        console.log('  ');
        console.log('Objects Infos');
        console.log("|-- Numbers of Objects :", parts.length)
                
        // Make json dictionary + binary file
        if (!hasAnimations){
            new Encryptor(parts, __dirname + '/../../../public/glxp/models/' + FILE)
        }

        if (hasAnimations) {
            new EncryptorAnim(anims,  __dirname + '/../../../public/glxp/models/' + FILE + "_anims")
        }
        
    })
})
