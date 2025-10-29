import ShaderManifest from '@/glxp/shaderManifest'
import DebugController from '@/glxp/debug/DebugController'
import PostProcessRT from './PostProcessRT'
import Mouse from '@/glxp/utils/Mouse'
import Shader from '@/glxp/utils/Shader'
import { isDesktop } from '@/glxp/utils/device'

import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Geometry } from '@/glxp/ogl/core/Geometry.js'
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { Plane } from '@/glxp/ogl/extras/Plane.js'
import { Color } from '@/glxp/ogl/math/Color.js'

const VERTICES  = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
const INDICES   = [0, 1, 2, 0, 2, 3]
const UVS       = [ 0, 1, 0, 0, 1, 0, 1, 1 ]

class PostSobel {
  constructor(scene, {
    blendFunc = {},
    transparent = false,
    depthTest = false,
    depthWrite = false,
    renderOrder = 0,
    alpha = 1,
    fxaa = undefined,
  } = {}) {
    this.gl = scene.gl
    this.scene = scene

    this.rt = new PostProcessRT(this.scene, 1, 'rgb', null, true)

    this.transparent = transparent
    this.blendFunc = blendFunc
    this.depthTest = depthTest
    this.depthWrite = depthWrite
    this.textureId = null
    this.renderOrder = renderOrder
    this.shader = new Shader(ShaderManifest['postSobel'])

    this.texture = new Texture(this.gl, {
      rt: this.rt,
      width: this.rt.width,
      height: this.rt.height,
    })
    this.depthTexture = new Texture(this.gl, {
      rt: this.rt,
      depth: true,
      width: this.rt.width,
      height: this.rt.height,
    })
    this.bloomTexture = new Texture(this.gl)

    this.alpha = alpha
    this.fxaa = fxaa === undefined ? isDesktop && this.scene.manager.dpr < 2 : fxaa

    this.config = {
      Bloom: { value: true, params: {} },
      ShowDepth: { value: false, params: {} },
      //   GrainScale: { value: 1, params: {min: 0, max: 3, step: 0.01} },
      BloomOpacity: { value: 0.25, params: { min: 0, max: 1, step: 0.01 } },
      NoiseOpacity: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      Gamma: { value: 1.1, params: { min: 0, max: 2, step: 0.01 } },
      Exposure: { value: 0, params: { min: -2, max: 2, step: 0.01 } },
      Contrast: { value: 0, params: { min: -1, max: 1, step: 0.01 } },
      Vignette: { value: 0.25, params: { min: 0, max: 1, step: 0.01 } },
      ChromaticAberations: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      VignetteColor: { value: '#000000', params: {} },
      VignetteStrength: { value: 0.5, params: { min: 0, max: 1, step: 0.01 } },
      OutlineColor: { value: '#1c000c', params: {} },
      OutlineDepthThickness: { value: 0.002, params: { min: 0.0, max: 0.005, step: 0.0001 } },
      OutlineNormalsThickness: { value: 0.001, params: { min: 0.0, max: 0.005, step: 0.0001 } },
      OutlineCutoff: { value: 0.99, params: { min: 0.01, max: 1, step: 0.01 } },
      OutlineNormalsBias: { value: 1, params: { min: 1, max: 5, step: 1 } },
      FXAA: { value: this.fxaa, params: {} },
    }

    DebugController.addBlade(this.config, `Post Processing Sobel - ${this.scene.name || 'Unknown'}`, 0)

    this.init()
  }

  init() {
    this.geometry = new Plane(this.gl)

    const attribs = {
      position: { size: 3, data: new Float32Array(VERTICES) },
      uv: { size: 2, data: new Float32Array(UVS) },
      index: { data: new Uint16Array(INDICES) },
    }
    this.geometry = new Geometry(this.gl, attribs)
    this.program = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.frag,
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      uniforms: {
        uTexture: { value: this.texture },
        uTextureSobelNormals: { value: this.scene.sobel.rtt },
        uDepth: { value: this.scene.sobel.rttDepth },
        uBloom: { value: this.bloomTexture },
        uTime: { value: this.scene.time },
        uRez: { value: [this.scene.width, this.scene.height] },
        uMouse: { value: Mouse.cursor },
        uVignette: this.config.Vignette,
        uVignetteColor: this.config.VignetteColor,
        uVignetteStrength: this.config.VignetteStrength,
        uNoiseOpacity: this.config.NoiseOpacity,
        uChromaticAberations: this.config.ChromaticAberations,
        uGamma: this.config.Gamma,
        uBloomOpacity: this.config.BloomOpacity,
        uExposure: this.config.Exposure,
        uContrast: this.config.Contrast,
        uBloomEnabled: this.config.Bloom,
        uShowDepth: this.config.ShowDepth,
        uOutlineDepthThickness: this.config.OutlineDepthThickness,
        uOutlineNormalsThickness: this.config.OutlineNormalsThickness,
        uOutlineColor: { value: new Color(this.config.OutlineColor.value) },
        uOutlineCutoff: this.config.OutlineCutoff,
        uOutlineNormalsBias: this.config.OutlineNormalsBias,
      },
    })

    this.program.cullFace = false
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: this.renderOrder })
  }

  onLoaded() {
    if (this.scene.bloomPass) {
      this.bloomTexture = new Texture(this.gl, {
        rt: this.scene.bloomPass.rts[0],
        width: this.scene.bloomPass.rts[0].width,
        height: this.scene.bloomPass.rts[0].height,
      })
    }

    this.program.uniforms['uBloom'].value = this.bloomTexture
  }

  preRender() {
    this.rt.preRender()
  }

  postRender() {
    this.rt.postRender()
  }

  render({ target = null } = {}) {
    this.program.uniforms['uTime'].value = this.scene.time
    this.program.uniforms['uRez'].value = [this.scene.width, this.scene.height]
    this.program.uniforms['uMouse'].value = Mouse.cursor
    this.program.uniforms['uVignetteColor'].value = new Color(this.config.VignetteColor.value)
    this.program.uniforms['uOutlineColor'].value = new Color(this.config.OutlineColor.value)

    this.texture.needsUpdate = true

    if (target) {
      this.scene.renderer.render({
        scene: this.mesh,
        clear: true,
        frustumCull: false,
        sort: false,
        target: target,
      })
    } else {
      this.scene.renderer.render({
        scene: this.mesh,
        clear: true,
        frustumCull: false,
        sort: false,
      })
    }
  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}

export default PostSobel
