import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'

import { Plane } from '@/glxp/ogl/extras/Plane.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { vec3 } from 'gl-matrix'
import DebugController from '@/glxp/debug/DebugController'

class PlaneEntity {
  constructor(
    scene,
    shader,
    {
      parent = null,
      scale = 1,
      blendFunc = {
        src: scene.gl.SRC_ALPHA,
        dst: scene.gl.ONE_MINUS_SRC_ALPHA,
      },
      transparent = false,
      depthTest = true,
      depthWrite = true,
      renderOrder = 0,
      alpha = 1,
      hasShadow = false,
      name = 'PlaneEntity',
      textureId = null,
      textureScale = 1,
      cullFace = scene.gl.FRONT,
      color = [1, 1, 1]
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
    this.textureId = textureId
    this.textureScale = textureScale
    this.renderOrder = renderOrder
    this.hasShadow = hasShadow
    this.name = name
    this.cullFace = cullFace

    this.defines = {}
    if (this.hasShadow) this.defines['HAS_SHADOW'] = 1
    if (this.textureId) this.defines['HAS_BASECOLORMAP'] = 1
    this.shader = new Shader(ShaderManifest[shader], 1, this.defines)
    this.texture = new Texture(this.gl)
    this.alpha = alpha
    this.color = vec3.fromValues(color[0], color[1], color[2])

    this.init()
  }

  init() {
    this.geometry = new Plane(this.gl)
    this.uniforms = {
      uTexture: { value: this.texture },
      uTime: { value: this.scene.time },
      uAlpha: { value: this.alpha },
      uColor: { value: this.color },
      uRez: { value: [this.scene.width, this.scene.height] },
    }
    if (this.textureId) {
      Object.assign(this.uniforms, {
        uTextureScale: { value: this.textureScale },
      })
    }
    this.program = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.frag,
      // Try these two parameters for optimisation :
      // uniformsCount: 2, // Change integer based on number of uniforms used in shader, 2 is for default 'grid' shader
      // calcAttributesCount: true,
      debugShader: DebugController.active,
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      uniforms: this.uniforms,
    })

    this.program.cullFace = this.cullFace
    this.program.setBlendFunc(this.blendFunc.src, this.blendFunc.dst)
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: this.renderOrder })
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    this.mesh.name = this.name
    this.mesh.setParent(this.parent)
  }

  onLoaded() {
    if (this.textureId) {
      this.texture = this.scene.textureLoader.getTexture(this.textureId)
      if (!this.texture){
        console.error(`Texture ${this.textureId} not found`)
        return
      } 
      this.texture.needsUpdate = true
      this.program.uniforms['uTexture'].value = this.texture
    }
  }

  preRender() {
    this.program.uniforms['uTime'].value = this.scene.time
    this.program.uniforms['uAlpha'].value = this.alpha
    this.program.uniforms['uColor'].value = this.color
    this.program.uniforms['uRez'].value = [this.scene.width, this.scene.height]
  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}

export default PlaneEntity
