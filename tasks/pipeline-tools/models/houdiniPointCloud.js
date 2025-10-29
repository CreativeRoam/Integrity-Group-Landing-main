let fs = require('fs')

const OBJECTS = 4

let indexCount = 0
let indices = []
let initialData = null

let plaData = []
let uvs

let parts = []

const getProperty = function (array, key) {
    return array[array.indexOf(key) + 1]
}

for (let i = 0; i < OBJECTS; i++) {
    let data = fs.readFileSync(__dirname + '/H_POINT_CLOUD/Letter_0' + (i + 1) + '.json')
    let d = JSON.parse(data.toString())

    let attr = getProperty(d, "attributes")
    let pointAttr = attr[1][0][1][7][5]
    let vertices = []

    for (let j = 0; j < pointAttr.length; j++) {
        const vec = pointAttr[j];
        vertices.push( vec[0] )
        vertices.push( vec[1] )
        vertices.push( vec[2] )
    }
    
    parts.push({
        vertices: new Float32Array(vertices),
        name: "Letter_0" + (i + 1)
    })

}

// vertextData.unshift(FRAMES, indexCount)
// vertextData.unshift(FRAMES, indexCount)


var args = process.argv.slice(2)
// ----------------------
// let FILE = "words"
let FILE = args[0]
let skipIndicies = args[1] ? true : false
// ----------------------


let xml2js = require('xml2js')

let Interpretor = require('./lib/coladaInterpretor')
let Encryptor = require('./lib/encryptor')

// let _parser = new xml2js.Parser()

// for (let i = 0; i < uvs.length / 2; i++) {
//     uvs[i * 2 + 0] = uvs[i * 2 + 0]
//     uvs[i * 2 + 1] = uvs[i * 2 + 1]
// }
// plaData[0].uvs = new Float32Array(uvs)

new Encryptor(parts, "/Users/dorianlods/Serveur/stuff/2018 Xmass_Xp/src/assets/models/letters")
