import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'
import DebugController from '@/glxp/debug/DebugController'
import Mouse from '@/glxp/utils/Mouse'
import { Camera } from '@/glxp/ogl/core/Camera.js'

import { Plane } from '@/glxp/ogl/extras/Plane.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Geometry } from '@/glxp/ogl/core/Geometry.js'
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { mat4 } from 'gl-matrix'

// Data
import { GUI_PANEL_CUSTOM } from '@/glxp/data/dataGUIPanels'

const VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
const INDICES = [0, 1, 2, 0, 2, 3]
const UVS = [0, 1, 0, 0, 1, 0, 1, 1]

let _MAT4_1 = mat4.create()

class Skybox {
  constructor (scene, texture, {
    parent = null,
    blendFunc = {},
    transparent = false,
    depthTest = false,
    depthWrite = false,
    alpha = 1,
    name = "Skybox"
  } = {}) {
    this.gl = scene.gl
    this.scene = scene

    this.transparent = transparent
    this.blendFunc = blendFunc
    this.depthTest = depthTest
    this.depthWrite = depthWrite
    this.textureId = texture
    this.name = name
    this.parent = parent ? parent : scene.root
    this.viewDirProjInverse = mat4.create()

    this.shader = new Shader(ShaderManifest['skybox'])
    this.texture = new Texture(this.gl)
    this.alpha = alpha

    this.camera = new Camera(this.gl, {
      near: 0.01,
      far: 1000,
      fov: 40,
      aspect: this.width / this.height,
    })

    this.config = {
      Fov: { value: 80, params: { min: 10, max: 180, step: 1 } },
      OverwriteSkybox: { value: false, type: 'bool' },
      Skybox: { value: 'placeholder', type: 'input-image', input: null },
    }
    DebugController.addBlade(this.config, this.name, GUI_PANEL_CUSTOM)

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
        uTime: { value: this.scene.time },
        uViewDirProjInverse: { value: this.viewDirProjInverse },
        uRez: { value: [this.scene.width, this.scene.height] },
        uMouse: { value: Mouse.cursor },
      },
    })

    this.program.cullFace = false
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: -1 })
    this.mesh.name = this.name
    this.mesh.setParent(this.parent)
  }

  onLoaded() {
    if (this.textureId) {
      this.texture = this.scene.textureLoader.getTexture(this.textureId)
      this.texture.needsUpdate = true
      this.program.uniforms['uTexture'].value = this.texture
    }
  }

  postFirstDraw() {
    setTimeout(() => {
      DebugController.inputs[this.name]['Skybox'].on('change', (evt) => {
        if (!this.config.OverwriteSkybox.value) {
          return
        }
        const img = new Image()
        img.src = evt.value.src
        this.texture.image = img
        this.texture.needsUpdate = true
        DebugController.inputs[this.name]['Skybox'].controller_.view.element.querySelector('input').value = ''
      })
    }, 5000)
  }

  preRender() {
    this.camera.fov = this.config.Fov.value
    this.camera.perspective({
      aspect: this.scene.width / this.scene.height,
    })

    mat4.copy(_MAT4_1, this.scene.cameraManager.camera.viewMatrix)
    _MAT4_1[12] = _MAT4_1[13] = _MAT4_1[14] = 0
    mat4.mul(_MAT4_1, this.camera.projectionMatrix, _MAT4_1)
    mat4.invert(_MAT4_1, _MAT4_1)
    mat4.copy(this.viewDirProjInverse, _MAT4_1)

    this.program.uniforms['uTime'].value = this.scene.time
    this.program.uniforms['uViewDirProjInverse'].value = this.viewDirProjInverse
    this.program.uniforms['uRez'].value = [this.scene.width, this.scene.height]
    this.program.uniforms['uMouse'].value = Mouse.cursor
  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}

export default Skybox
