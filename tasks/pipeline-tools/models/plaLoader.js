let fs = require('fs')

const FRAMES = 350

let indexCount = 0
let indices = []
let initialData = null

let plaData = []
let uvs

for (let i = 0; i < FRAMES; i++) {
    let data = fs.readFileSync(__dirname + '/DATA/frame_' + i + '.json')
    let d = JSON.parse(data.toString())
    
    plaData.push({
        name: i,
        vertices: new Float32Array(d.vertices)
    })

    uvs = d.uvs
    
}

console.log(uvs)

// vertextData.unshift(FRAMES, indexCount)
// vertextData.unshift(FRAMES, indexCount)


var args = process.argv.slice(2)
console.log(args)
// ----------------------
// let FILE = "words"
let FILE = args[0]
let skipIndicies = args[1] ? true : false
// ----------------------


let xml2js = require('xml2js')

let Interpretor = require('./lib/coladaInterpretor')
let Encryptor = require('./lib/encryptor')

let _parser = new xml2js.Parser()

for (let i = 0; i < uvs.length / 2; i++) {
    uvs[i * 2 + 0] = uvs[i * 2 + 0]
    uvs[i * 2 + 1] = uvs[i * 2 + 1]
}
plaData[0].uvs = new Float32Array(uvs)
new Encryptor(plaData, "/Users/dorianlods/Serveur/stuff/2018 Xmass_Xp/src/assets/models/deer_pla")
