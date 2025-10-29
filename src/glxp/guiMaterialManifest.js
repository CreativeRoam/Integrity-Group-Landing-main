import DebugController from '@/glxp/debug/DebugController'

// TODO: Is this really a manifest? Maybe refactor somewhere else

class GUIMaterialManifest {
  constructor() {
    this.params = {}
    this.guis = {}
  }

  // PBR
  createPBRMaterial (matName, customParams = {}) {
    if (this.params[matName] !== undefined) {
      return this.params[matName]
    }

    this.params[matName] = {
      albedoColor: { value: '#ffffff', params: {} },
      IBL: { value: 0.5, params: { min: 0, max: 10, step: 0.01 } },
      IBLAlbedoMix: { value: 0.5, params: { min: 0, max: 1, step: 0.01 } },
      IBLRoughnessImpact: { value: 0.8, params: { min: 0, max: 1, step: 0.01 } },
      NormalScale: { value: 1, params: { min: 0, max: 10, step: 0.01 } },
      MetalicFactor: { value: 1, params: { min: 0, max: 3, step: 0.01 } },
      RoughnessFactor: { value: 0.5, params: { min: 0, max: 2, step: 0.01 } },
      EmissiveColor: { value: '#ffffff', params: {} },
      EmissivePower: { value: 1, params: { min: 0, max: 5, step: 0.01 } },
      OcclusionFactor: { value: 1, params: { min: 0, max: 1, step: 0.01 } },
      SheenColor: { value: '#ffffff', params: {} },
      SheenOpacity: { value: 1, params: { min: 0, max: 1, step: 0.01 } },
      SheenDepth: { value: 2, params: { min: 1, max: 16, step: 0.1 } },
      Alpha: { value: 1, params: { min: 0, max: 1, step: 0.01 } },
      Tint: { value: '#ffffff', params: {} },
      TintOpacity: { value: 0, params: { min: 0, max: 1, step: 0.01 } },
      Exposure: { value: 0, params: { min: -2, max: 2, step: 0.01 } },
      Contrast: { value: 0, params: { min: -1, max: 1, step: 0.01 } },
      Saturation: { value: 1, params: { min: 0, max: 2, step: 0.01 } },
      ...customParams
    }

    return this.params[matName]
  }
  
  createPBRCelshadingMaterial (matName) {
    if (this.params[matName] !== undefined) {
      return this.params[matName]
    }

    const config = this.createPBRMaterial(matName)

    this.params[matName] = {
      ...config,
      ShadowColor: { value: '#000000', params: {} },
      ShadowOpacity: { value: 1, params: { min: 0, max: 1, step: 0.01 } },
      ShadowMultiplyBlend: { value: 0.5, params: { min: 0, max: 1, step: 0.01 } },
      SketchFrequency: { value: 1, params: { min: 0.01, max: 5, step: 0.01 } },
      SketchFalloutShadow: { value: 0.3, params: { min: 0, max: 0.5, step: 0.01 } },
      SketchFalloutSheen: { value: 0.3, params: { min: 0, max: 0.5, step: 0.01 } },
      SketchVisibility: { value: 0.5, params: { min: 0, max: 1, step: 0.01 } },
    }

    return this.params[matName]
  }

  addPBRMaterialToGUI (matName, id) {
    if (this.guis[matName] !== undefined) {
      return
    }

    this.guis[matName] = DebugController.addBlade(this.params[matName], matName, id)
  }

  // UNLIT
  createUnlitMaterial (matName) {
    if (this.params[matName] !== undefined) {
      return this.params[matName]
    }

    this.params[matName] = {
      BaseColor: { value: '#ffffff', params: {} },
      TextureScale: { value: 1, params: { min: 0.1, max: 200, step: 0.1 } },
      Alpha: { value: 1, params: { min: 0, max: 1, step: 0.01 } },
      Tint: { value: '#ffffff', params: {} },
      TintOpacity: { value: 0, params: { min: 0, max: 1, step: 0.01 } },
      Exposure: { value: 0, params: { min: -2, max: 3, step: 0.01 } },
      Contrast: { value: 0, params: { min: -1, max: 1, step: 0.01 } },
      Saturation: { value: 1, params: { min: 0, max: 2, step: 0.01 } },
      SheenColor: { value: '#ffffff', params: {} },
      SheenOpacity: { value: 0, params: { min: 0, max: 1, step: 0.01 } },
      SheenDepth: { value: 2, params: { min: 1, max: 10, step: 0.1 } },
    }

    return this.params[matName]
  }

  createUnlitSketchMaterial (matName) {
    if (this.params[matName] !== undefined) {
      return this.params[matName]
    }

    const config = this.createUnlitMaterial(matName)

    this.params[matName] = {
      ...config,
      ShadowColor: { value: '#000000', params: {} },
      SketchFrequency: { value: 5, params: { min: 0, max: 20, step: 0.01 } },
      SketchFallout: { value: 0.3, params: { min: 0, max: 0.5, step: 0.01 } },
      SketchVisibility: { value: 0.5, params: { min: 0, max: 1, step: 0.01 } },
    }

    return this.params[matName]
  }

  addUnlitMaterialToGUI (matName, id) {
    if (this.guis[matName] !== undefined) {
      return
    }

    // I think this is useless - Fred
    // const isSheen = manifestMaterial && manifestMaterial['SheenColor'] !== undefined
    // this.guis[matName] = DebugController.addBlade(this.params[matName], `${matName} ${isSheen ? 'SHEEN' : ''}`, id)

    this.guis[matName] = DebugController.addBlade(this.params[matName], `${matName}`, id)
  }

  // UTILS
  getGui (matName) {
    return this.guis[matName] ? this.guis[matName] : null
  }
}

const out = new GUIMaterialManifest()
export default out
