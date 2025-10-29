import { mat4 } from 'gl-matrix'

import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'
import DebugController from '@/glxp/debug/DebugController'
import GLTFUtils from '@/glxp/utils/GLTFUtils';
import MeshEntityUtils from '@/glxp/entities/MeshEntityUtils'

import { Program } from '@/glxp/ogl/core/Program.js';
import { Geometry } from '@/glxp/ogl/core/Geometry.js';
import { Mesh } from '@/glxp/ogl/core/Mesh.js';
import { Texture } from '@/glxp/ogl/core/Texture.js';
import { Transform } from '@/glxp/ogl/core/Transform.js';
import { Color } from '@/glxp/ogl/math/Color'

import PostProcessRT from '@/glxp/postProcess/PostProcessRT'

import Manifest from '@/glxp/manifest'
import GUIMaterialManifest from '@/glxp/guiMaterialManifest'

class MeshEntity {
  constructor(scene,
    {
      parent = null,
      id = 0,
      blendFunc = {
        src: scene.gl.SRC_ALPHA,
        dst: scene.gl.ONE_MINUS_SRC_ALPHA,
      },
      gltf = null,
      data = null, // for gltf: meshData - for collada: geometry
      node = null,
      name = '',
      materialName = '',
      material = undefined,
      transparent = false,
      depthTest = true,
      depthWrite = true,
      shaderId = 'standard-refraction',
      renderOrder = 0,
      globalConfig = null,
      overwriteMaterial = false,
      fog = false,
      alpha = 1,
      uid = null,
      rtScale = 1,
    } = {}
  ) {
    this.gl = scene.gl
    this.scene = scene
    this.gltf = gltf
    this.data = data
    this.node = node
    this.name = name
    this.parent = parent ? parent : scene.root
    this.transparent = transparent
    this.blendFunc = blendFunc
    this.depthTest = depthTest
    this.depthWrite = depthWrite
    this.shaderId = shaderId
    this.videoTexture = null
    this.video = null
    this.fog = fog
    this.renderOrder = renderOrder
    this.groupId = id
    this.geom = {}
    this.materialName = materialName
    this.material = material
    this.globalConfig = globalConfig
    this.alpha = alpha
    this.defines = {}
    this.seed = Math.random()
    this.transform = new Transform()
    this.lastEnv = null
    this.lastEnvDiffuse = null
    this.overwriteMaterial = overwriteMaterial
    this.uid = uid
    this.rtScale = rtScale
    this.animationPlayers = []
    this.refractionPassDiscard = true

    this.rt = new PostProcessRT(this.scene, this.rtScale, 'rgb', null, true)
    this.rtTexture = new Texture(this.gl, {
      rt: this.rt,
      width: this.rt.width,
      height: this.rt.height,
    })

    this.rtBackFaceNrm = new PostProcessRT(this.scene, this.rtScale, 'float', null, true)
    this.rtTextureBackFaceNrm = new Texture(this.gl, {
      rt: this.rtBackFaceNrm,
      width: this.rt.width,
      height: this.rt.height,
    })

    this.localState = { uniforms: {} }
    this.normalMatrix = mat4.create()

    this.maxTextureIndex = 0
    this.defines = {
      'USE_IBL': 1,
      'MANUAL_SRGB': 1,
      'HAS_COLOR_CORRECTION': 1
    }

    this.meshUtils = new MeshEntityUtils(this)

    if (node) {
      this.meshUtils.setTransformFromNode(node)
    }

    this.geom = this.gltf ? GLTFUtils.getGeometryDataFromGltf(this.data, this.defines, this.gltf) : this.data

    this.initConfig()

    // Material
    this.initMaterial()
    if (this.initMaterialCustom) { this.initMaterialCustom() }
    this.meshUtils.cleanConfig()

    this.createUniforms()
    if (this.createUniformsCustom) { this.createUniformsCustom() }

    this.init()
  }

  initConfig() {
    this.guiName = `${this.scene.name || 'undefined'} - ${this.materialName || 'undefined'}`

    this.config = GUIMaterialManifest.createPBRMaterial(this.guiName, {
      IOR: { value: 1.1, params: { min: 0, max: 4, step: 0.01 } },
      RefractionRoughness: { value: .1, params: { min: 0., max: 1, step: 0.01 } },
      IorR: { value: 1.15, params: { min: 1, max: 2, step: 0.01 } },
      IorY: { value: 1.16, params: { min: 1, max: 2, step: 0.01 } },
      IorG: { value: 1.18, params: { min: 1, max: 2, step: 0.01 } },
      IorC: { value: 1.22, params: { min: 1, max: 2, step: 0.01 } },
      IorB: { value: 1.22, params: { min: 1, max: 2, step: 0.01 } },
      IorP: { value: 1.22, params: { min: 1, max: 2, step: 0.01 } },
      BackfaceInfluence: { value: .33, params: { min: 0., max: 1, step: 0.01 } },
      // Chromatics:                 { value: .3, params: {min: 0.2, max: 1, step: 0.01} },
    })

    if (DebugController.guiIsReady) {
      this.initGUI()
    } else {
      DebugController.on('gui-lazyloaded', this.initGUI.bind(this))
    }
  }

  initGUI() {
    GUIMaterialManifest.addPBRMaterialToGUI(this.guiName, this.groupId)
    this.gui = GUIMaterialManifest.getGui(this.guiName)
  }

  init() {
    this.environment = this.globalConfig.Environment.value
    this.diffuseenvironment = this.globalConfig.EnvironmentDiffuse.value
    this.lightColor = new Color(this.globalConfig.lightColor.value)

    let attribs = {
      position: { size: 3, data: this.geom.vertices },
      index: { data: this.geom.indices }
    }

    if (this.geom.normals) {
      this.defines['HAS_NORMALS'] = 1
      attribs = Object.assign(attribs, {
        normal: { size: 3, data: this.geom.normals },
      })
    }
    if (this.geom.uvs) {
      this.defines['HAS_UV'] = 1
      attribs = Object.assign(attribs, {
        uv: { size: 2, data: this.geom.uvs },
      })
    }
    if (this.geom.tangents) {
      this.defines['HAS_TANGENTS'] = 1
      attribs = Object.assign(attribs, {
        tangents: { size: 4, data: this.geom.tangents },
      })
    }

    this.shader = new Shader(ShaderManifest[this.shaderId], 2, this.defines)
    this.geometry = new Geometry(this.gl, attribs)
    this.program = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.frag,
      // fragment: this.shader.passes[0],
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      cullFace: this.gl.BACK,
      uniforms: Object.assign(this.localState.uniforms, {
        'uBackfaceTextureSampler': { 'type': 'rt', value: this.rtTextureBackFaceNrm }
      })
    })

    this.programBackface = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.passes[0],
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      cullFace: this.gl.FRONT,
      uniforms: this.localState.uniforms
    })

    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, transform: this.transform, frustumCulled: false })
    this.mesh.name = this.name
    this.mesh.setParent(this.parent)

    this.backFaceMesh = new Mesh(this.gl, { geometry: this.geometry, program: this.programBackface, transform: this.transform, frustumCulled: false })
    this.backFaceMesh.name = this.name + 'Backface'
    this.backFaceMesh.setParent(this.parent)
    this.backFaceMesh.visible = false

  }

  initMaterial() {
    const manifestMaterial = Manifest.materials[this.materialName]
    const entityMaterial = this.material?.pbrMetallicRoughness

    // material definition:
    // 1. default material values are taken from the default config defined in initConfig
    let pbrMat = null

    // 2. if material exists in manifest, take its values
    if (manifestMaterial && !this.overwriteMaterial) {
      pbrMat = manifestMaterial
    }

    // 3. if 'material' is defined in entity's parameters, take its values. Useful when colors are defined in gltf (meebits)
    else if (entityMaterial && !this.overwriteMaterial) {
      pbrMat = entityMaterial
      this.isGenericPBRMaterial = true
    }

    const getImageInfo = this.meshUtils.getImageInfo.bind(this.meshUtils)
    const setConfigValue = this.meshUtils.setConfigValue.bind(this.meshUtils)
    const defineUniform = this.meshUtils.defineUniform.bind(this.meshUtils)
    const defineTexture = this.meshUtils.defineTexture.bind(this.meshUtils)


    // uniforms definition

    // EnvMaps
    getImageInfo('env_diffuse', 'uDiffuseEnvSampler')
    getImageInfo('env_default', 'uSpecularEnvSampler')

    // brdfLUT
    getImageInfo('brdfLUT', 'uBrdfLUT')

    // IBL
    setConfigValue('IBL', pbrMat?.IBL)
    defineUniform('uIBLAlbedoMix', 'float1', 'IBLAlbedoMix', this.config.IBLAlbedoMix.value)
    defineUniform('uIBLRoughnessImpact', 'float1', 'IBLRoughnessImpact', this.config.IBLRoughnessImpact.value)

    // Alpha
    setConfigValue('Alpha', pbrMat?.Alpha)

    // uvScale
    defineUniform('uUvScale', 'float1', 'UvScale', pbrMat?.UvScale || 1)

    // Base Color
    const baseColorFactor = pbrMat?.albedoColor ? new Color(pbrMat.albedoColor).getRGBA() : [1.0, 1.0, 1.0, 1.0]
    if (this.isGenericPBRMaterial && pbrMat?.baseColorFactor) {
      this.config.albedoColor.value = pbrMat.baseColorFactor
    } else {
      this.config.albedoColor.value = pbrMat?.albedoColor || new Color(baseColorFactor).getHex()
    }
    this.localState.uniforms['uBaseColorFactor'] = {
      type: 'float4',
      value: baseColorFactor
    }
    defineTexture('uBaseColorSampler', 'HAS_BASECOLORMAP', pbrMat?.albedoMap)

    // Alpha texture
    defineTexture('uAlphaMapSampler', 'HAS_ALPHAMAP', pbrMat?.alphaTexture)
    if (pbrMat?.alphaTexture) this.transparent = true

    // Metallic-Roughness
    setConfigValue('MetalicFactor', pbrMat?.MetalicFactor, 'MetalicFactor')
    setConfigValue('RoughnessFactor', pbrMat?.RoughnessFactor, 'RoughnessFactor')
    defineUniform('uMetallicRoughnessValues', 'float2', ['MetalicFactor', 'RoughnessFactor'], [this.config.MetalicFactor.value, this.config.RoughnessFactor.value])
    defineTexture('uMetallicRoughnessSampler', 'HAS_METALROUGHNESSMAP', pbrMat?.metallicRoughnessTexture)

    // ORM (AO - Roughness - Metallic)
    defineTexture('uOcclusionRoughnessMetallicSampler', 'HAS_ORM_MAP', pbrMat?.ORMTexture)
    setConfigValue('OcclusionFactor', pbrMat?.OcclusionFactor)
    defineUniform('uOcclusionStrength', 'float1', 'OcclusionFactor', this.config.OcclusionFactor.value)

    // AO
    defineTexture('uOcclusionSampler', 'HAS_OCCLUSIONMAP', pbrMat?.occlusionTexture)
    setConfigValue('OcclusionFactor', pbrMat?.OcclusionFactor)

    // Normals
    defineTexture('uNormalSampler', 'HAS_NORMALMAP', pbrMat?.normalTexture)
    setConfigValue('NormalScale', pbrMat?.NormalScale)
    defineUniform('uNormalScale', 'float1', 'NormalScale', this.config.NormalScale.value)

    // Emissive
    defineTexture('uEmissiveSampler', 'HAS_EMISSIVEMAP', pbrMat?.emissiveTexture)
    setConfigValue('EmissiveColor', pbrMat?.emissiveColor)
    setConfigValue('EmissivePower', pbrMat?.emissivePower)
    defineUniform('uEmissiveFactor', 'float3', 'EmissiveColor', this.config.EmissiveColor.value)

    // Color Correction
    setConfigValue('Tint', pbrMat?.Tint)
    defineUniform('uTint', 'float3', 'Tint', this.config.Tint.value)

    setConfigValue('TintOpacity', pbrMat?.TintOpacity)
    defineUniform('uTintOpacity', 'float1', 'TintOpacity', this.config.TintOpacity.value)

    setConfigValue('Exposure', pbrMat?.Exposure)
    defineUniform('uExposure', 'float1', 'Exposure', this.config.Exposure.value)

    setConfigValue('Contrast', pbrMat?.Contrast)
    defineUniform('uContrast', 'float1', 'Contrast', this.config.Contrast.value)

    setConfigValue('Saturation', pbrMat?.Saturation)
    defineUniform('uSaturation', 'float1', 'Saturation', this.config.Saturation.value)

    // Sheen
    if (pbrMat && pbrMat.SheenColor) {
      const sheenOpacity = pbrMat.sheenOpacity !== null ? pbrMat.sheenOpacity : 1
      const sheenDepth = pbrMat.sheenDepth !== null ? pbrMat.sheenDepth : 2
      defineUniform('uSheenColor', 'float3', 'SheenColor', pbrMat.SheenColor)
      defineUniform('uSheenOpacity', 'float1', 'SheenOpacity', sheenOpacity)
      defineUniform('uSheenDepth', 'float1', 'SheenDepth', sheenDepth)
      setConfigValue('SheenColor', pbrMat.SheenColor)
      setConfigValue('SheenOpacity', sheenOpacity)
      setConfigValue('SheenDepth', sheenDepth)
      this.defines.HAS_SHEEN = 1
    }

    // Fog
    if (this.globalConfig.FogColor && this.fog) {
      this.defines.HAS_FOG = 1
      defineUniform('uFogColor', 'float3', 'FogColor', this.globalConfig.FogColor.value)
      defineUniform('uFogNear', 'float1', 'FogNear', this.globalConfig.FogNear.value)
      defineUniform('uFogFar', 'float1', 'FogFar', this.globalConfig.FogFar.value)
    }


    // Refraction
    setConfigValue('IOR', pbrMat?.IOR)
    defineUniform('uIOR', 'float1', 'IOR', this.config.IOR.value)

    setConfigValue('RefractionRoughness', pbrMat?.RefractionRoughness)
    defineUniform('uRefractionRoughness', 'float1', 'RefractionRoughness', this.config.RefractionRoughness.value)

    setConfigValue('BackfaceInfluence', pbrMat?.BackfaceInfluence)
    defineUniform('uBackfaceInfluence', 'float1', 'BackfaceInfluence', this.config.BackfaceInfluence.value)

    setConfigValue('IorR', pbrMat?.IorR)
    defineUniform('uIorR', 'float1', 'IorR', this.config.IorR.value)

    setConfigValue('IorY', pbrMat?.IorY)
    defineUniform('uIorY', 'float1', 'IorY', this.config.IorY.value)

    setConfigValue('IorG', pbrMat?.IorG)
    defineUniform('uIorG', 'float1', 'IorG', this.config.IorG.value)

    setConfigValue('IorC', pbrMat?.IorC)
    defineUniform('uIorC', 'float1', 'IorC', this.config.IorC.value)

    setConfigValue('IorB', pbrMat?.IorB)
    defineUniform('uIorB', 'float1', 'IorB', this.config.IorB.value)

    setConfigValue('IorP', pbrMat?.IorP)
    defineUniform('uIorP', 'float1', 'IorP', this.config.IorP.value)
  }

  createUniforms() {
    // General
    this.localState.uniforms['uTime'] = { 'type': 'float1', 'value': 0 }
    this.localState.uniforms['uAlpha'] = { 'type': 'float1', 'value': 1 }
    this.localState.uniforms['uCamera'] = { 'type': 'float3', value: [0, 0, 0] }

    // Light
    this.localState.uniforms['uLightDirection'] = { 'type': 'float3', value: [0.0, 0.5, 0.5] }
    this.localState.uniforms['uLightColor'] = { 'type': 'float3', value: [1.0, 1.0, 1.0] }

    // IBL
    this.localState.uniforms['uScaleDiffBaseMR'] = { 'type': 'float4', value: [0.0, 0.0, 0.0, 0.0] }
    this.localState.uniforms['uScaleFGDSpec'] = { 'type': 'float4', value: [0.0, 0.0, 0.0, 0.0] }
    this.localState.uniforms['uScaleIBLAmbient'] = { 'type': 'float4', value: [1.5, 1.5, 0, 0] }
    this.localState.uniforms['uEnvOffset'] = { 'type': 'float4', value: 0 }

    // Refraction
    this.localState.uniforms['uIOR'] = { 'type': 'float1', 'value': 1.2 }
    this.localState.uniforms['uRefractionRoughness'] = { 'type': 'float1', 'value': .1 }
    this.localState.uniforms['uBackfaceInfluence'] = { 'type': 'float1', 'value': .3 }

    for (const key in this.localState.uniforms) {
      if (Object.hasOwnProperty.call(this.localState.uniforms, key)) {
        if (this.localState.uniforms[key].type == "texture") {
          this.localState.uniforms[key].value = new Texture(this.gl)
        }
      }
    }

    // Refraction texture
    this.localState.uniforms['uSceneTextureSampler'] = { 'type': 'rt', value: this.rtTexture }
  }

  onLoaded() {
    for (const key in this.localState.uniforms) {
      if (Object.hasOwnProperty.call(this.localState.uniforms, key)) {
        if (this.localState.uniforms[key].type == "texture") {
          this.localState.uniforms[key].value = this.scene.textureLoader.getTexture(this.localState.uniforms[key].uri)
          this.localState.uniforms[key].value.needsUpdate = true
        }
      }
    }

    this.meshUtils.cleanConfig()

    // optional if you want texture inputs in the GUI
    if (this.gui) {
      DebugController.addTextureUpload(this)
    }
  }

  // Render
  getFirstDrawPromise() {
    this.didFirstDraw = false
    return new Promise((resolve) => { this.firstDrawResolve = resolve })
  }

  firstDraw() {
    if (this.didFirstDraw) return

    // this.gl.finish()

    const storedVisibility = this.mesh.visible
    this.mesh.visible = true

    this.scene.renderer.render({
      scene: this.mesh,
      camera: this.scene.camera,
      clear: false,
      frustumCull: true,
      sort: false,
    })

    this.mesh.visible = storedVisibility

    // this.gl.finish()

    if (!this.didFirstDraw) {
      this.didFirstDraw = true
      requestAnimationFrame(() => { this.firstDrawResolve(this) })
    }
  }

  preRender() {
    // General
    this.program.uniforms.uTime.value = this.scene.time
    this.program.uniforms.needsUpdate = true
    this.localState.uniforms['uCamera'].value = this.scene.camera.position

    // Light
    this.program.uniforms['uLightDirection'].value = [
      (this.globalConfig.lightPosition.value.x * this.scene.root.scale.x) - this.mesh.worldMatrix[12],
      (this.globalConfig.lightPosition.value.y * this.scene.root.scale.y) - this.mesh.worldMatrix[13],
      (this.globalConfig.lightPosition.value.z * this.scene.root.scale.z) - this.mesh.worldMatrix[14]
    ]

    this.lightColor.set(this.globalConfig.lightColor.value)
    this.localState.uniforms['uLightColor'].value = [this.lightColor[0] * this.globalConfig.lightPower.value, this.lightColor[1] * this.globalConfig.lightPower.value, this.lightColor[2] * this.globalConfig.lightPower.value]

    // IBL
    this.localState.uniforms['uScaleIBLAmbient'].value = [
      this.config.IBL.value * this.globalConfig.IBLDiffuseFactor.value,
      this.config.IBL.value * this.globalConfig.IBLSpecularFactor.value,
      0.0,
      0.0
    ]

    if (this.localState.uniforms['uIBLAlbedoMix']) {
      this.localState.uniforms['uIBLAlbedoMix'].value = this.config.IBLAlbedoMix.value
    }

    if (this.localState.uniforms['uIBLRoughnessImpact']) {
      this.localState.uniforms['uIBLRoughnessImpact'].value = this.config.IBLRoughnessImpact.value
    }

    // Debug
    const debugState = this.globalConfig.Debug.value
    this.localState.uniforms['uScaleDiffBaseMR'].value = [debugState == "mathDiff" ? 1 : 0, debugState == "baseColor" ? 1 : 0, debugState == "metallic" ? 1 : 0, debugState == "roughness" ? 1 : 0];
    this.localState.uniforms['uScaleFGDSpec'].value = [debugState == "specRef" ? 1 : 0, debugState == "geomOcc" ? 1 : 0, debugState == "mcrfctDist" ? 1 : 0, debugState == "spec" ? 1 : 0];

    // ORM
    this.localState.uniforms['uMetallicRoughnessValues'].value = [this.config.MetalicFactor.value, this.config.RoughnessFactor.value]
    if (this.localState.uniforms['uNormalScale']) {
      this.localState.uniforms['uNormalScale'].value = this.config.NormalScale.value
    }
    if (this.localState.uniforms['uOcclusionStrength']) {
      this.localState.uniforms['uOcclusionStrength'].value = this.config.OcclusionFactor.value
    }

    // Albedo
    const bc = new Color(this.config.albedoColor.value)
    this.localState.uniforms['uBaseColorFactor'].value = [bc[0], bc[1], bc[2], this.config.Alpha.value * this.globalConfig.Alpha.value]

    // Emissive
    if (this.localState.uniforms['uEmissiveFactor']) {
      const ec = new Color(this.globalConfig.emissiveColor.value)
      this.localState.uniforms['uEmissiveFactor'].value = [ec[0], ec[1], ec[2]]
    }

    if (this.localState.uniforms['uEmissiveColor']) {
      this.localState.uniforms['uEmissiveColor'].value = new Color(this.config.EmissiveColor.value)
    }
    if (this.localState.uniforms['uEmissivePower']) {
      this.localState.uniforms['uEmissivePower'].value = this.config.EmissivePower.value
    }

    // Sheen
    if (this.localState.uniforms['uSheenColor']) {
      this.localState.uniforms['uSheenOpacity'].value = this.config.SheenOpacity.value
      this.localState.uniforms['uSheenDepth'].value = this.config.SheenDepth.value
      this.localState.uniforms['uSheenColor'].value = new Color(this.config.SheenColor.value)
    }

    // Fog
    if (this.globalConfig.FogColor && this.fog) {
      this.localState.uniforms['uFogNear'].value = this.globalConfig.FogNear.value
      this.localState.uniforms['uFogFar'].value = this.globalConfig.FogFar.value
      this.localState.uniforms['uFogColor'].value = new Color(this.globalConfig.FogColor.value)
    }

    // Environments
    this.environment = this.globalConfig.Environment.value
    // console.log("this.environment", this.scene.textureLoader.getTexture(this.environment))
    if (this.environment !== this.lastEnv) {
      this.lastEnv = this.environment
      this.localState.uniforms["uSpecularEnvSampler"].value = this.scene.textureLoader.getTexture(this.environment)
      this.localState.uniforms["uSpecularEnvSampler"].value.needsUpdate = true
    }

    this.diffuseenvironment = this.globalConfig.EnvironmentDiffuse.value
    if (this.diffuseenvironment !== this.lastEnvDiffuse) {
      this.lastEnvDiffuse = this.diffuseenvironment
      this.localState.uniforms["uDiffuseEnvSampler"].value = this.scene.textureLoader.getTexture(this.diffuseenvironment)
      this.localState.uniforms["uDiffuseEnvSampler"].value.needsUpdate = true
    }

    this.localState.uniforms['uEnvOffset'].value = this.globalConfig.EnvRotationOffset.value

    // Color Correction
    this.localState.uniforms["uTint"].value = new Color(this.config.Tint.value)
    this.localState.uniforms["uTintOpacity"].value = this.config.TintOpacity.value
    this.localState.uniforms["uExposure"].value = this.config.Exposure.value
    this.localState.uniforms["uContrast"].value = this.config.Contrast.value
    this.localState.uniforms["uSaturation"].value = this.config.Saturation.value

    // Refraction
    this.localState.uniforms["uIOR"].value = this.config.IOR.value
    this.localState.uniforms["uRefractionRoughness"].value = this.config.RefractionRoughness.value
    this.localState.uniforms["uBackfaceInfluence"].value = this.config.BackfaceInfluence.value

    this.localState.uniforms["uIorR"].value = this.config.IorR.value
    this.localState.uniforms["uIorY"].value = this.config.IorY.value
    this.localState.uniforms["uIorG"].value = this.config.IorG.value
    this.localState.uniforms["uIorC"].value = this.config.IorC.value
    this.localState.uniforms["uIorB"].value = this.config.IorB.value
    this.localState.uniforms["uIorP"].value = this.config.IorP.value

    if (this.customPrerender) { this.customPrerender() }

    // Scene RT render
    this.mesh.visible = false
    this.scene.renderer.render({
      scene: this.scene.root,
      camera: this.scene.camera,
      clear: true,
      frustumCull: true,
      sort: true,
      post: this,
    })
    this.mesh.visible = true

    // Backface Pass
    this.backFaceMesh.visible = true
    this.scene.renderer.render({
      scene: this.backFaceMesh,
      camera: this.scene.camera,
      clear: true,
      frustumCull: true,
      sort: true,
      post: { rt: this.rtBackFaceNrm },
    })
    this.backFaceMesh.visible = false

    this.rtTexture.needsUpdate = true
    this.localState.uniforms['uSceneTextureSampler'].value = this.rtTexture

    this.rtTextureBackFaceNrm.needsUpdate = true
    this.program.uniforms['uBackfaceTextureSampler'].value = this.rtTextureBackFaceNrm
  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}

export default MeshEntity
