import MeshPBR                      from './MeshPBR'
import DebugController              from '@/glxp/debug/DebugController'

import { Color }                    from '@/glxp/ogl/math/Color'

class MeshPBRCarpaint extends MeshPBR {
  constructor(
    scene,
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
      shaderId = 'carpaint',
      overwriteMaterial = true,
      renderOrder = 0,
      globalConfig = null,
      fog = false,
      alpha = 1,
    } = {}
  ) {
    super(scene, { parent, id, blendFunc, gltf, data, node, name, materialName, material, transparent, shaderId, overwriteMaterial, depthTest, depthWrite, renderOrder, globalConfig, fog, alpha })
  }

  initConfig() {
    this.config = {
      albedoColor:                { value: "#ffffff", params: {}},
      IBL:                        { value: .15, params: {min: 0, max: .5, step: 0.01} },
      IBLAlbedoMix:               { value: 0, params: { min: 0, max: 1, step: 0.01 } },
      IBLRoughnessImpact:         { value: 0, params: { min: 0, max: 1, step: 0.01 } },
      NormalScale:                { value: 1, params: {min: 0, max: 2, step: 0.01} },
      MetalicFactor:              { value: .25, params: {min: 0, max: 1, step: 0.01} },
      RoughnessFactor:            { value: .3, params: {min: 0, max: 1, step: 0.01} },
      EmissiveColor:              { value: "#ffffff", params: {} },
      EmissivePower:              { value: 1, params: {min: 0, max: 5, step: 0.01} },
      OcclusionFactor:            { value: 1, params: {min: 0, max: 1, step: 0.01} },
      SheenColor:                 { value: "#ffffff", params: {} },
      SheenOpacity:               { value: 1, params: {min: 0, max: 1, step: 0.01} },
      SheenDepth:                 { value: 2, params: {min: 1, max: 8, step: 0.1} },
      
      ClearCoatRoughness:         { value: .2, params: {min: 0, max: 1, step: 0.01} },
      ClearCoatThickness:         { value: 8., params: {min: 0, max: 20, step: 0.1} },
      ClearCoatColor:             { value: "#e8d2aa", params: {}},
      
      FlakesScale:                { value: 10, params: {min: 2, max: 30, step: 0.1} },
      FlakesWeight:               { value: 1., params: {min: 0, max: 3, step: 0.01} },
      FlakesDensity:              { value: .5, params: {min: 0, max: 1, step: 0.01} },
      FlakesColor:                { value: "#ff5411", params: {}},
      
      Alpha:                      { value: 1, params: {min: 0, max: 1, step: 0.01} },
      Tint:                       { value: "#ffffff", params: {}},
      TintOpacity:                { value: 0, params: {min: 0, max: 1, step: 0.01} },
      Exposure:                   { value: 0, params: {min: -2, max: 2, step: 0.01} },
      Contrast:                   { value: 0, params: {min: -1, max: 1, step: 0.01} },
      Saturation:                 { value: 1, params: {min: 0, max: 2, step: 0.01} },
    }

    if (DebugController.guiIsReady) {
      this.initGUI()
    } else {
      DebugController.on('gui-lazyloaded', this.initGUI.bind(this))
    }
  }

  initGUI() {
    this.guiName = `${this.scene.name || 'undefined'} - ${this.name || 'undefined'}`
    this.gui = DebugController.addBlade(this.config, this.guiName, this.groupId)
    DebugController.addTextureUpload(this)
  }

  initMaterialCustom() {
    const defineTexture = this.meshUtils.defineTexture.bind(this.meshUtils)
    defineTexture('uFlakesSampler', 'HAS_FLAKES', 'flakes')
  }

  createUniformsCustom() {
    this.localState.uniforms['uFlakesScale']          = { 'type': 'float1', 'value': 8 }
    this.localState.uniforms['uFlakesDensity']        = { 'type': 'float1', 'value': .5 }
    this.localState.uniforms['uFlakesWeight']         = { 'type': 'float1', 'value': 1 }
    this.localState.uniforms['uFlakesColor']          = { 'type': 'float3', value: [0.0, 0.5, 0.5] }
    this.localState.uniforms['uClearCoatColor']       = { 'type': 'float3', value: [1, 1, 1] }
    this.localState.uniforms['uClearcoat']            = { 'type': 'float2', value: [0.0, 1.] }
  }

  customPrerender() {
    this.localState.uniforms['uFlakesColor'].value          = new Color(this.config.FlakesColor.value)
    this.localState.uniforms['uClearCoatColor'].value       = new Color(this.config.ClearCoatColor.value)
    this.localState.uniforms['uFlakesScale'].value          = this.config.FlakesScale.value
    this.localState.uniforms['uFlakesWeight'].value         = this.config.FlakesWeight.value
    this.localState.uniforms['uFlakesDensity'].value        = this.config.FlakesDensity.value
    this.localState.uniforms['uClearcoat'].value            = [this.config.ClearCoatRoughness.value, this.config.ClearCoatThickness.value ]
  }
}

export default MeshPBRCarpaint
