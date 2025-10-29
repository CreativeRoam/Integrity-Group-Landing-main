class Interpretor {
  constructor(objFromXml) {

    this.input = objFromXml
    this.objects = {}
    this.findParts()
    this.findAnims()
    this.refactorObjects()

    return this.objects
  }

  walkNode(objects, parent) {
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      let name = obj["$"]["name"]
      let id = obj["$"]["id"]

      console.log(" ")
      console.log('Found Object :', name)
      console.log("--------")
      console.log('|-- Parent :', parent)

      this.objects[id] = {
        name: name,
        animations: {}
      }

      if (obj["node"]) {
        this.walkNode(obj["node"], name)
      }

    }
  }

  findParts() {

    let col = this.input.COLLADA
    let objects = col["library_visual_scenes"][0]["visual_scene"][0]["node"]
    this.walkNode(objects, null)

  }


  findAnims(){

    let col = this.input.COLLADA
    let anims = col['library_animations']    

    for (let i = 0; i < anims.length; i++) {

      for (let l = 0; l < anims[i]["animation"].length; l++) {
        const anim = anims[i]["animation"][l];
        
        for (let j = 0; j < anim["animation"].length; j++) {
            const animCompo = anim["animation"][j];
            
            let chanel           = animCompo["channel"][0]["$"]
            let sources          = animCompo["source"]
            let sampler          = animCompo["sampler"][0]
            let target           = chanel["target"].split('/')[0]
            let targetChannel    = chanel["target"].split('/')[1].split('.')[0]
            let targetChannelDim = chanel["target"].split('/')[1].split('.')[1].toLowerCase()

            if (this.objects[target] == undefined) {
              continue
            }

            if (this.objects[target].animations[targetChannel] == undefined) {
              this.objects[target].animations[targetChannel] = {
                stride: 0,
                components: [],
                frameLength: 0,
                source: {},
                keyTime: {},
                inTangent: {},
                outTangent: {},
              }
              console.log("|--- Object anim channel:", targetChannel, target)
            }
            console.log("|-- Object anim property:", targetChannelDim)
            
            let outputSource = ""
            let keyTimeSource = ""
            let inTangentSource = ""
            let outTangentSource = ""

            for (let k = 0; k < sampler["input"].length; k++) {
              const input = sampler["input"][k]["$"];
              if (input["semantic"] === "OUTPUT") {
                outputSource = input["source"].split('#').join('')
              }
              if (input["semantic"] === "INPUT") {
                keyTimeSource = input["source"].split('#').join('')
              }
              if (input["semantic"] === "IN_TANGENT") {
                inTangentSource = input["source"].split('#').join('')
              }
              if (input["semantic"] === "OUT_TANGENT") {
                outTangentSource = input["source"].split('#').join('')
              }
            }
  
            let _sourceOutput
            let _sourceKeyTime
            let _inTangentSource
            let _outTangentSource
            
            for (let k = 0; k < sources.length; k++) {
              const source = sources[k];
              const id = sources[k]["$"]["id"]
              if (id === outputSource) {
                _sourceOutput = sources[k]["float_array"][0]["_"].split(' ')
              }
              if (id === keyTimeSource) {
                _sourceKeyTime = sources[k]["float_array"][0]["_"].split(' ')
              }
              if (id === inTangentSource) {
                _inTangentSource = sources[k]["float_array"][0]["_"].split(' ')
              }
              if (id === outTangentSource) {
                _outTangentSource = sources[k]["float_array"][0]["_"].split(' ')
              }
            }

            this.objects[target].animations[targetChannel].stride ++
            this.objects[target].animations[targetChannel].frameLength = _sourceOutput.length
            this.objects[target].animations[targetChannel].components.push(targetChannelDim)
            this.objects[target].animations[targetChannel].source[targetChannelDim] = {
              source: _sourceOutput,
            }
            this.objects[target].animations[targetChannel].keyTime[targetChannelDim] = {
              source: _sourceKeyTime,
            }
            this.objects[target].animations[targetChannel].inTangent[targetChannelDim] = {
              source: _inTangentSource,
            }
            this.objects[target].animations[targetChannel].outTangent[targetChannelDim] = {
              source: _outTangentSource,
            }
        } 
      }
      console.log(" ");
    }
  }

  refactorObjects(){

    let out = []

    for (const key in this.objects) {
      if (this.objects.hasOwnProperty(key)) {
        out.push(this.objects[key])
      }
    }

    for (let i = 0; i < out.length; i++) {
      const element = out[i];
      
      for (const key in element) {
        if (element.hasOwnProperty(key) && key === 'animations') {
          const channel = element[key];
          
          let props = []
          for (const key in channel) {
            if (channel.hasOwnProperty(key)) {
              const _comp = channel[key];
              
              let tmp = []
              let tmpKeyTime = []
              let tmpInTangent = []
              let tmpOutTangent = []
              
              for (let j = 0; j < _comp.frameLength; j++) {
                for (let k = 0; k < _comp.components.length; k++) {
                  const _comt = _comp.components[k];  
                  tmp.push(_comp.source[_comt].source[j])
                  tmpKeyTime.push(_comp.keyTime[_comt].source[j])
                  tmpInTangent.push(_comp.inTangent[_comt].source[j * 2 + 0])
                  tmpInTangent.push(_comp.inTangent[_comt].source[j * 2 + 1]) 
                  tmpOutTangent.push(_comp.outTangent[_comt].source[j * 2 + 0])
                  tmpOutTangent.push(_comp.outTangent[_comt].source[j * 2 + 1])
                }
              }
              _comp.source = new Float32Array(tmp)
              _comp.keyTime = new Float32Array(tmpKeyTime)
              _comp.inTangent = new Float32Array(tmpInTangent)
              _comp.outTangent = new Float32Array(tmpOutTangent)

            }
          }
        }
      }
    }
    this.objects = out
  }

}
module.exports = Interpretor