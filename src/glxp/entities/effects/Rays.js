import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'

import { Cylinder } from '@/glxp/ogl/extras/Cylinder.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { vec3 } from 'gl-matrix'
import { Color } from '@/glxp/ogl/math/Color.js'

import DebugController from '@/glxp/debug/DebugController'
import { GUI_PANEL_CUSTOM } from '@/glxp/data/dataGUIPanels'

class Rays {
  constructor(
    scene,
    {
      parent = null,
      scale = 1,
      blendFunc = {
        src: scene.gl.SRC_ALPHA,
        dst: scene.gl.ONE_MINUS_SRC_ALPHA,
      },
      transparent = true,
      depthTest = true,
      depthWrite = true,
      renderOrder = 0,
      alpha = 1,
      name = 'Rays',
    } = {}
  ) {
    this.gl = scene.gl
    this.scene = scene
    this.parent = parent ? parent : scene.root
    this.scale = scale
    this.transparent = transparent
    this.blendFunc = blendFunc
    this.depthTest = depthTest
    this.depthWrite = depthWrite
    this.renderOrder = renderOrder
    this.shader = new Shader(ShaderManifest['rays'])
    this.alpha = alpha
    this.name = name
    this.color = vec3.fromValues(0, 0, 0)

    this.config = {
      Color: { value: '#8c5e22', params: {} },
      Scale_X: { value: 4, params: { min: 0, max: 8, step: 0.1 } },
      Fade: { value: 0.5, params: { min: 0, max: 3, step: 0.01 } },
      TimeScale: { value: 1, params: { min: 0, max: 3, step: 0.01 } },
      Height: { value: 1, params: { min: 0, max: 3, step: 0.01 } },
      Width: { value: 1, params: { min: 0, max: 3, step: 0.01 } },
      Opacity: { value: 1, params: { min: 0, max: 1, step: 0.01 } },
    }
    DebugController.addBlade(this.config, `${this.scene.name}_${this.name}`, GUI_PANEL_CUSTOM)

    this.init()
  }

  init() {
    this.geometry = new Cylinder(this.gl, {
      // radiusTop: .05,
      // radiuBottom: 2,
      height: 2,
      radialSegments: 512,
      openEnded: true,
    })
    this.program = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.frag,
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      depthFunc: this.gl.ALWAYS,
      cullFace: this.gl.FRONT,
      uniforms: {
        uTime: { value: this.scene.time },
        uAlpha: { value: this.alpha },
        uColor: { value: this.color },
        uFade: this.config.Fade,
        uHeight: this.config.Height,
        uWidth: this.config.Width,
        uOpacity: this.config.Opacity,
        uCamera: { value: [0, 0, 0] },
        uScale: { value: [this.config.Scale_X.value, this.config.Scale_X.value] },
        uRez: { value: [this.scene.width, this.scene.height] },
      },
    })

    this.program.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE)
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: this.renderOrder })
    this.mesh.name = this.name
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    this.mesh.setParent(this.parent)
  }

  onLoaded() {}

  preRender() {
    this.program.uniforms['uTime'].value = this.scene.time * this.config.TimeScale.value
    this.program.uniforms['uAlpha'].value = this.alpha
    this.program.uniforms['uCamera'].value = this.scene.camera.position
    this.program.uniforms['uColor'].value = new Color(this.config.Color.value)
    this.program.uniforms['uScale'].value = [this.config.Scale_X.value, this.config.Scale_X.value]
    this.program.uniforms['uRez'].value = [this.scene.width, this.scene.height]
  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}

export default Rays
