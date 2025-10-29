import MeshPBR                      from './MeshPBR'
import DebugController              from '@/glxp/debug/DebugController'

// OGL
import { Color }                    from '@/glxp/ogl/math/Color'

// Manifest
import GUIMaterialManifest          from '@/glxp/guiMaterialManifest'

// Data
import { GUI_PANEL_PBR } from '@/glxp/data/dataGUIPanels'

class MeshPBRCelshading extends MeshPBR {
  constructor(
    scene,
    args = {}
  ) {
    args.id = GUI_PANEL_PBR
    args.shaderId = 'standard-celshading'

    super(scene, args)

    this.useIBL = args.useIBL || false
  }

  initConfig() {
    this.guiName = `${this.scene.name || 'undefined'} - ${this.materialName || 'undefined'}`

    const customParams = {}

    this.config = GUIMaterialManifest.createPBRCelshadingMaterial(this.guiName, customParams)

    if (DebugController.guiIsReady) {
      this.initGUI()
    } else {
      DebugController.on('gui-lazyloaded', this.initGUI.bind(this))
    }
  }

  initGUI() {
    GUIMaterialManifest.addPBRMaterialToGUI(this.guiName, this.groupId)
    this.gui = GUIMaterialManifest.getGui(this.guiName)

    // WIP
    if (this.gui.params.IBL) {
      this.gui.params.IBL.hidden = !this.useIBL
    }

    // if (this.gui) {
    //     DebugController.addTextureUpload(this)
    // }
  }

  // Custom Adds
  initMaterialCustom() {
    this.defines['USE_IBL'] = this.useIBL ? 1 : 0

    const getImageInfo = this.meshUtils.getImageInfo.bind(this.meshUtils)
    getImageInfo(this.textureIds.celshadingSketch || 'black', 'uNoiseTexture')
  }

  createUniformsCustom() {
    this.localState.uniforms['uShadowColor'] = { 'type': 'float3', value: [0.0, 0.5, 0.5] }
    this.localState.uniforms['uShadowOpacity'] = { 'type': 'float1', 'value': 1 }
    this.localState.uniforms['uShadowMultiplyBlend'] = { 'type': 'float1', 'value': 0.5 }
    this.localState.uniforms['uSketchFrequency'] = { 'type': 'float1', 'value': 1 }
    this.localState.uniforms['uSketchFalloutShadow'] = { 'type': 'float1', 'value': 0.5 }
    this.localState.uniforms['uSketchFalloutSheen'] = { 'type': 'float1', 'value': 0.5 }
    this.localState.uniforms['uSketchVisibility'] = { 'type': 'float1', 'value': 0.5 }
  }

  customPrerender() {
    this.localState.uniforms['uShadowColor'].value = new Color(this.config.ShadowColor.value)
    this.localState.uniforms['uShadowOpacity'].value = this.config.ShadowOpacity.value
    this.localState.uniforms['uShadowMultiplyBlend'].value = this.config.ShadowMultiplyBlend.value
    this.localState.uniforms['uSketchFrequency'].value = this.config.SketchFrequency.value
    this.localState.uniforms['uSketchFalloutShadow'].value = this.config.SketchFalloutShadow.value
    this.localState.uniforms['uSketchFalloutSheen'].value = this.config.SketchFalloutSheen.value
    this.localState.uniforms['uSketchVisibility'].value = this.config.SketchVisibility.value
  }
}

export default MeshPBRCelshading
