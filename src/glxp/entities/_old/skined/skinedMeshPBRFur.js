import Shader                       from '@/glxp/utils/Shader'
import ShaderManifest               from '@/glxp/shaderManifest'
import Skin                         from '@/glxp/abstract/skin'
import DebugController from '@/glxp/debug/DebugController'

import { vec2, vec3, quat, mat4 }               from 'gl-matrix'
import { Program }                  from '@/glxp/ogl/core/Program.js';
import { Geometry }                 from '@/glxp/ogl/core/Geometry.js';
import { Mesh }                     from '@/glxp/ogl/core/Mesh.js';
import { Texture }                  from '@/glxp/ogl/core/Texture.js';
import { Transform }                from '@/glxp/ogl/core/Transform.js';
import { Color }                    from '@/glxp/ogl/math/Color'
import { Vec3 }                     from '@/glxp/ogl/math/Vec3.js';
import Animator from '@/glxp/animations/characterAnimator'

import Manifest from '../manifest'

class SkinedMeshEntity {
  constructor (scene, data, shader, texture, rootnodeName, id, parent = false) {
    
    this.gl                     = scene.gl
    this.scene                  = scene
    this.data                   = data
    this.textureId              = texture
    this.meshId                 = id
    this.shaderId               = shader
    this.texture                = new Texture(this.gl);
    this.idTexture              = new Texture(this.gl);
    this.transform              = new Transform()
    this.nodes                  = []
    this.skinData               = null
    this.geomData               = null
    this.lastEnv                = null
    this.lastEnvDiffuse         = null
    this.rootnodeName           = rootnodeName
    this.renderOrder            = 10000
    this.parent = parent ? parent : scene.root

    this.localState = { uniforms: {} }
    this.normalMatrix = mat4.create()
    this.MVPMatrix = mat4.create()

    this.globalConfig = this.scene.PBRConfigs[`CONFIG_${this.meshId}`]
    this.maxTextureIndex = 0
    this.defines = {}
    this.defines['USE_IBL'] = 1
    this.defines['MANUAL_SRGB'] = 1
    this.defines['HAS_NORMALS'] = 1
    this.defines['HAS_UV'] = 1

    this.buildBonesHierarchy()
    
    this.skin = new Skin(this, this.skinData, this.rootnodeName)
    this.skin.rootNode.setParent(this.transform)
    
    this.initConfig()
    this.initMaterial()
    this.cleanConfig()
    this.createUniforms()
    this.init() 

  }

  postFirstDraw(){
    setTimeout(() => {
        DebugController.inputs[`Hape_0${this.meshId+1} LIGHTS`]["EnvIBL"].on('change', (evt)=>{
            if (!this.globalConfig.OverwriteEnvIBL.value) { return }
            const img = new Image();
            img.src = evt.value.src
            this.localState.uniforms["uDiffuseEnvSampler"].value.image = img
            this.localState.uniforms["uDiffuseEnvSampler"].value.needsUpdate = true
            DebugController.inputs[`Hape_0${this.meshId+1} LIGHTS`]["EnvIBL"].controller_.view.element.querySelector('input').value = ""
        })
    }, 5000)
  }

  buildBonesHierarchy(){
    for (let i = 0; i < this.data.length; i++) {
        const element = this.data[i];
        if (element.type == "triangle" && this.geomData === null) {
            this.geomData = element
        } else if (element.joints && this.skinData === null) {
            this.skinData = element
        }
    }

    for (let i = 0; i < this.data.length; i++) {
        const element = this.data[i];
        if (element.type == "Null") {
            let node = new Transform()
            node.position.set(element.translate[0], element.translate[1], element.translate[2])
            node.rotation.set(element.rotation[0], element.rotation[1], element.rotation[2])
            node.scale.set(element.scale[0], element.scale[1], element.scale[2])
            node.name = element.name
            node.sid = element.sid
            node._parent = element.parent
            this.nodes.push(node)
        }
    }

    this.name = this.geomData.name
    for (let i = 0; i < this.nodes.length; i++) {
        let parentName = this.nodes[i]._parent
        if (parentName) {
            for (let j = 0; j < this.nodes.length; j++) {
                if (this.nodes[j].name == parentName) {
                    this.nodes[j].addChild(this.nodes[i])
                }
            }
        }
    }

    for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].updateMatrixWorld(true)
    }
  }

  initConfig(){

    this.config = {
        albedoColor: { value: "#ffffff", params: {}},
        IBL:                      { value: 2, params: {min: 0, max: 10, step: 0.01} },
        NormalScale:              { value: 1, params: {min: 0, max: 2, step: 0.01} },
        MetalicFactor:            { value: 1., params: {min: 0, max: 2, step: 0.01} },
        RoughnessFactor:          { value: .33, params: {min: 0, max: 3, step: 0.01} },
        OcclusionFactor:          { value: 1, params: {min: 0, max: 1, step: 0.01} },
        Alpha:                    { value: 1, params: {min: 0, max: 1, step: 0.01} },
        FurOffset:                { value: .08, params: {min: 0, max: .2, step: 0.001} },
        FurNoiseScale:            { value: 15, params: {min: 0, max: 30, step: 0.1} },
        FurSampleRange:           { value: .015, params: {min: 0, max: .1, step: 0.001} },
        FurSampleOffset:          { value: .5, params: {min: 0, max: 1., step: 0.01} },
        FurOcclusion:             { value: .4, params: {min: 0, max: 1., step: 0.01} },
    }
    this.gui = DebugController.addBlade(this.config, this.name, this.meshId + 1)
  }
  
  cleanConfig(){
    if (!this.gui || this.gui === {}) return

    if (this.defines["HAS_NORMALMAP"] == undefined) {
        this.gui["NormalScale"].hidden = true
    }
    if (this.defines["HAS_OCCLUSIONMAP"] == undefined) {
        this.gui["OcclusionFactor"].hidden = true
    }
  }

  init(){

    this.animator = new Animator(this.scene, this.skin.bonesNode, this.skin.rootNode, this)
    // console.log(this.skin.bonesNode, this.geomData.name);

    this.environement = this.globalConfig.Environment.value
    this.diffuseEnvironement = this.globalConfig.EnvironmentDiffuse.value
    this.lightColor = new Color(this.globalConfig.lightColor.value)
    this.defines.ATTRIB_STACK = this.skinData.attribStackNum
    this.defines.MAX_BONES = this.skinData.joints.length

    this.shader = new Shader(ShaderManifest["skined-standard-fur"], 1, this.defines)

    const attribs = {
        position: { size: 3, data: this.geomData.vertices },
        uv: { size: 2, data: this.geomData.uvs },
        normal: { size: 3, data: this.geomData.normal },
        index: { data: this.geomData.indices },
    }
    for (let i = 0; i < this.skinData.attribStackNum; i++) {
        attribs[`aWeights_${i}`] = { size: 4, data: this.skin.attribData[`weight_${i}`] }
        attribs[`aBoneNdx_${i}`] = { size: 4, data: this.skin.attribData[`ndx_${i}`] }
    }
    this.geometry = new Geometry(this.gl, attribs)

    this.program = new Program(this.gl, {
        vertex: this.shader.vert,
        fragment: this.shader.frag,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        cullFace: false,
        uniforms: this.localState.uniforms
    })

    this.mesh = new Mesh(this.gl, {geometry: this.geometry, program: this.program, transform: this.transform, frustumCulled: false, renderOrder: this.renderOrder  })
    this.mesh.name = this.name
    this.mesh.setParent(this.parent)
    this.mesh.onBeforeRender(() => {
      this.program.uniforms.uPass.value = 0
    })

    let furPasses = 4
    for (let i = 0; i < furPasses; i++) {
        this[`program${i+1}`] = new Program(this.gl, {
            vertex: this.shader.vert,
            fragment: this.shader.frag,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            uniforms: this.localState.uniforms
        })
        this[`mesh${i+1}`] = new Mesh(this.gl, {geometry: this.geometry, program: this[`program${i+1}`], transform: this.transform, frustumCulled: false, renderOrder: this.renderOrder  })
        this[`mesh${i+1}`].name = `${this.name}_${i+1}`
        this[`mesh${i+1}`].setParent(this.parent)
        this[`mesh${i+1}`].onBeforeRender(() => {
          this.program.uniforms.uPass.value = i+1
        })
    }

  }

  getImageInfo(uri, funcName, uniformName) {
      this.localState.uniforms[uniformName] = { 'type': funcName, 'uri': uri, 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++
  }

  initMaterial() {
      const gl = this.gl 
      const gltf = this.gltf

      var pbrMat = Manifest.materials[this.name] ? Manifest.materials[this.name] : null
      // console.log( Manifest.materials[this.name])

      this.config.IBL.value = (pbrMat && pbrMat.IBL) ? pbrMat.IBL : this.config.IBL.value

      // EnvMaps
      this.localState.uniforms['uDiffuseEnvSampler'] = { 'type': 'texture', 'uri': 'env_diffuse', 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++

      this.localState.uniforms['uSpecularEnvSampler'] = { 'type': 'texture', 'uri': 'env_default', 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++

      this.localState.uniforms['uFurDensity'] = { 'type': 'texture', 'uri': 'fur-density', 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++

        if (pbrMat && pbrMat.Alpha) {
          this.config.Alpha.value = pbrMat.Alpha
        }

      // Base Color
      var baseColorFactor = pbrMat && pbrMat.albedoColor ? new Color(pbrMat.albedoColor).getRGBA() : [1.0, 1.0, 1.0, 1.0]
      this.config.albedoColor.value = pbrMat && pbrMat.albedoColor ? pbrMat.albedoColor : new Color(baseColorFactor).getHex()
      this.localState.uniforms['uBaseColorFactor'] = {
          type: 'float4',
          value: baseColorFactor
      }
      if (pbrMat && pbrMat.albedoMap) {
          this.getImageInfo(pbrMat.albedoMap, 'texture', 'uBaseColorSampler');
          this.defines.HAS_BASECOLORMAP = 1
      }
      else if (this.localState.uniforms['uBaseColorSampler']) {
          delete this.localState.uniforms['uBaseColorSampler']
      }

      // Metallic-Roughness
      this.config.MetalicFactor.value = (pbrMat && pbrMat.MetalicFactor) ? pbrMat.MetalicFactor : this.config.MetalicFactor.value
      this.config.RoughnessFactor.value = (pbrMat && pbrMat.RoughnessFactor) ? pbrMat.RoughnessFactor : this.config.RoughnessFactor.value
      this.localState.uniforms['uMetallicRoughnessValues'] = {
          type: 'float2',
          value: [this.config.MetalicFactor.value, this.config.RoughnessFactor.value]
      };
      if (pbrMat && pbrMat.metallicRoughnessTexture) {
          this.getImageInfo(pbrMat.metallicRoughnessTexture, 'texture', 'uMetallicRoughnessSampler', gl.RGBA) 
          this.defines.HAS_METALROUGHNESSMAP = 1
      }
      else if (this.localState.uniforms['uMetallicRoughnessSampler']) {
          delete this.localState.uniforms['uMetallicRoughnessSampler']
      }

      // Normals
      if (pbrMat && pbrMat.normalTexture) {
          this.getImageInfo(pbrMat.normalTexture, 'texture', 'uNormalSampler', gl.RGBA)
          this.config.NormalScale.value = pbrMat.NormalScale ? pbrMat.NormalScale : this.config.NormalScale.value
          this.localState.uniforms['uNormalScale'] = { 'type': 'float1', 'value': this.config.NormalScale.value }
          this.defines.HAS_NORMALMAP = 1
      }
      else if (this.localState.uniforms['uNormalSampler']) {
          delete this.localState.uniforms['uNormalSampler']
      }

      // brdfLUT
      var brdfLUT = 'brdfLUT';
      this.localState.uniforms['uBrdfLUT'] = { 'type': 'texture', 'uri': 'brdfLUT', 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++

      // Emissive
      if (pbrMat && pbrMat.emissiveTexture) {
          this.getImageInfo(pbrMat.emissiveTexture, 'texture', 'uEmissiveSampler')
          this.defines.HAS_EMISSIVEMAP = 1
          var emissiveFactor = pbrMat.emissiveFactor ? pbrMat.emissiveFactor : [0.0, 0.0, 0.0]
          this.globalConfig.emissiveColor.value = new Color(emissiveFactor).getHex()
          this.localState.uniforms['uEmissiveFactor'] = {
              type: 'float3',
              value: emissiveFactor
          };
      }
      else if (this.localState.uniforms['uEmissiveSampler']) {
          delete this.localState.uniforms['uEmissiveSampler']
      }

      // AO
      if (pbrMat && pbrMat.occlusionTexture) {
          this.getImageInfo(pbrMat.occlusionTexture, 'texture', 'uOcclusionSampler')
          this.config.OcclusionFactor.value = pbrMat.OcclusionFactor ? pbrMat.OcclusionFactor : this.config.OcclusionFactor.value
          this.localState.uniforms['uOcclusionStrength'] = { 'type': 'float1', 'value': this.config.OcclusionFactor.value }
          this.defines.HAS_OCCLUSIONMAP = 1
      }
      else if (this.localState.uniforms['uOcclusionSampler']) {
          delete this.localState.uniforms['uOcclusionSampler']
      }

  }

  createUniforms () {

        // Rig 
        this.localState.uniforms['uBones']              = { 'type': '[vec4]', value: this.skin.boneArray }

        // Fur
        this.localState.uniforms['uFurOffset']              = { 'type': 'float1', value: this.config.FurOffset.value }
        this.localState.uniforms['uFurNoiseScale']          = { 'type': 'float1', value: this.config.FurNoiseScale.value }
        this.localState.uniforms['uFurSampleRange']         = { 'type': 'float1', value: this.config.FurSampleRange.value }
        this.localState.uniforms['uFurSampleOffset']        = { 'type': 'float1', value: this.config.FurSampleOffset.value }
        this.localState.uniforms['uFurOcclusion']           = { 'type': 'float1', value: this.config.FurOcclusion.value }

        // General
        this.localState.uniforms['uTime']               = { 'type': 'float1', 'value': 0 }
        this.localState.uniforms['uPass']               = { 'type': 'float1', 'value': 0 }
        this.localState.uniforms['uAlpha']              = { 'type': 'float1', 'value': 1 }

        // Light
        this.localState.uniforms['uLightDirection']     = { 'type': 'float3', value: [0.0, 0.5, 0.5] }
        this.localState.uniforms['uLightColor']         = { 'type': 'float3', value: [1.0, 1.0, 1.0] }

        // get scaling stuff
        this.localState.uniforms['uScaleDiffBaseMR']    = { 'type': 'float4', value: [0.0, 0.0, 0.0, 0.0] }
        this.localState.uniforms['uScaleFGDSpec']       = { 'type': 'float4', value: [0.0, 0.0, 0.0, 0.0] }
        this.localState.uniforms['uScaleIBLAmbient']    = { 'type': 'float4', value: [1.5, 1.5, 0, 0] }
        
        this.localState.uniforms['uCamera']             = { 'type': 'float3', value: [0, 0, 0] }

        this.localState.uniforms['uReflectionHeightAlphaMin'] = this.scene.config.reflectionAlphaMin
        this.localState.uniforms['uReflectionHeightAlphaLimit'] = this.scene.config.reflectionAlphaLimit

        for (const key in this.localState.uniforms) {
            if (Object.hasOwnProperty.call(this.localState.uniforms, key)) {
                if (this.localState.uniforms[key].type == "texture") {
                    this.localState.uniforms[key].value = new Texture(this.gl)
                }
            }
        }

    }

  onLoaded(){

    for (const key in this.localState.uniforms) {
        if (Object.hasOwnProperty.call(this.localState.uniforms, key)) {
            if (this.localState.uniforms[key].type == "texture") {
                this.localState.uniforms[key].value = this.scene.textureLoader.getTexture(this.localState.uniforms[key].uri)
                this.localState.uniforms[key].value.needsUpdate = true
            }
        }
    }

  }

  preRender () {

    this.animator.update()
    this.skin.update()   

    this.program.uniforms.uBones.value = this.skin.boneArray
    this.program.uniforms.uTime.value = this.scene.time
    this.program.uniforms.needsUpdate = true

    this.localState.uniforms['uFurOffset'].value = this.config.FurOffset.value
    this.localState.uniforms['uFurNoiseScale'].value = this.config.FurNoiseScale.value
    this.localState.uniforms['uFurSampleRange'].value = this.config.FurSampleRange.value
    this.localState.uniforms['uFurSampleOffset'].value = this.config.FurSampleOffset.value
    this.localState.uniforms['uFurOcclusion'].value = this.config.FurOcclusion.value

    this.program.uniforms['uLightDirection'].value = [ 
        (this.scene.cameraManager.lightPos.x * this.scene.root.scale.x) - this.mesh.worldMatrix[12], 
        (this.scene.cameraManager.lightPos.y * this.scene.root.scale.y) - this.mesh.worldMatrix[13], 
        (this.scene.cameraManager.lightPos.z * this.scene.root.scale.z) - this.mesh.worldMatrix[14]
    ]
    // this.program.uniforms['uLightDirection'].value = [ 
    //     CONFIG.lightPosition.value.x - this.mesh.worldMatrix[12], 
    //     CONFIG.lightPosition.value.y - this.mesh.worldMatrix[13], 
    //     CONFIG.lightPosition.value.z - this.mesh.worldMatrix[14]
    // ]
    
    this.lightColor.set(this.globalConfig.lightColor.value)
    this.localState.uniforms['uLightColor'].value = [this.lightColor[0] * this.globalConfig.lightPower.value, this.lightColor[1] * this.globalConfig.lightPower.value, this.lightColor[2] * this.globalConfig.lightPower.value]
    this.localState.uniforms['uScaleIBLAmbient'].value = [this.config.IBL.value * this.globalConfig.IBLDiffuseFactor.value, this.config.IBL.value * this.globalConfig.IBLSpecularFactor.value, 0.0, 0.0]

    const debugState = this.globalConfig.Debug.value
    this.localState.uniforms['uScaleDiffBaseMR'].value = [debugState == "mathDiff" ? 1 : 0, debugState == "baseColor" ? 1 : 0, debugState == "metallic" ? 1 : 0, debugState == "roughness" ? 1 : 0];
    this.localState.uniforms['uScaleFGDSpec'].value = [debugState == "specRef" ? 1 : 0, debugState == "geomOcc" ? 1 : 0, debugState == "mcrfctDist" ? 1 : 0, debugState == "spec" ? 1 : 0];

    this.localState.uniforms['uMetallicRoughnessValues'].value = [this.config.MetalicFactor.value, this.config.RoughnessFactor.value]
    if (this.localState.uniforms['uNormalScale'] ) {
        this.localState.uniforms['uNormalScale'].value = this.config.NormalScale.value
    }
    if (this.localState.uniforms['uOcclusionStrength'] ) {
        this.localState.uniforms['uOcclusionStrength'].value = this.config.OcclusionFactor.value
    }

    const bc = new Color(this.config.albedoColor.value)
    this.localState.uniforms['uBaseColorFactor'].value = [bc[0], bc[1], bc[2], this.config.Alpha.value * this.globalConfig.Alpha.value]

    if (this.localState.uniforms['uEmissiveFactor']) {
        const ec = new Color(this.globalConfig.emissiveColor.value)
        this.localState.uniforms['uEmissiveFactor'].value = [ec[0], ec[1], ec[2]]
    }

    this.localState.uniforms['uCamera'].value = this.scene.camera.position

    this.environement = this.globalConfig.Environment.value
    if(this.environement !== this.lastEnv){
        this.lastEnv = this.environement
        this.localState.uniforms["uSpecularEnvSampler"].value = this.scene.textureLoader.getTexture(this.environement)
        this.localState.uniforms["uSpecularEnvSampler"].value.needsUpdate = true
    }
    this.diffuseEnvironement = this.globalConfig.EnvironmentDiffuse.value
    if(this.diffuseEnvironement !== this.lastEnvDiffuse){
        this.lastEnvDiffuse = this.diffuseEnvironement
        this.localState.uniforms["uDiffuseEnvSampler"].value = this.scene.textureLoader.getTexture(this.diffuseEnvironement)
        this.localState.uniforms["uDiffuseEnvSampler"].value.needsUpdate = true
    }

  }

  dispose() {
    this.mesh.setParent(null)
    this.meshTransparent.setParent(null)

    this.geometry.remove()
    this.program.remove()
    this.transparentProgram.remove()
  }
}

export default SkinedMeshEntity
