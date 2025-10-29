import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'
import DebugController from '@/glxp/debug/DebugController'

import { Plane } from '@/glxp/ogl/extras/Plane.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { vec3 } from 'gl-matrix'
import { Color } from '@/glxp/ogl/math/Color'

class FakeReflectionFloor {
  constructor(
    scene,
    shader,
    texture,
    {
      parent = null,
      id = 0,
      blendFunc = {
        src: scene.gl.SRC_ALPHA,
        dst: scene.gl.ONE_MINUS_SRC_ALPHA,
      },
      transparent = false,
      depthTest = true,
      depthWrite = true,
      rt = null,
      renderOrder = 0,
      alpha = 1,
    } = {}
  ) {
    this.gl = scene.gl
    this.scene = scene
    this.parent = parent ? parent : scene.root
    this.scale = 2000
    this.transparent = transparent
    this.blendFunc = blendFunc
    this.depthTest = depthTest
    this.depthWrite = depthWrite
    this.rt = rt
    this.textureId = texture
    this.renderOrder = renderOrder
    this.shader = new Shader(ShaderManifest[shader])

    this.name = 'Floor_' + id
    ;(this.texture = new Texture(this.gl, {
      rt: this.rt,
      width: this.rt.width,
      height: this.rt.height,
    })),
      (this.noiseTexture = new Texture(this.gl))

    this.alpha = alpha
    this.color = vec3.fromValues(0, 0, 0)

    this.config = {
      floorColor:             { value: "#8f8f8f", params: {}},
      ReflectionOpacity:      { value: 0.5, params: {min: 0, max: 1, step: 0.01} },
      ReflectionSize:         { value: 5, params: {min: 0, max: 15, step: 0.1} },
      ReflectionScale:        { value: 0.035, params: {min: 0, max: .1, step: 0.001} },
      CircleRadius:           { value: 0.33, params: {min: 0, max: 1, step: 0.001} },
      Feather:                { value: 0.1, params: {min: 0, max: 1, step: 0.001} },
      ScrollSpeed:            { value: 0.07, params: {min: 0, max: .1, step: 0.001} },
    }
    DebugController.addBlade(this.config, this.name, id + 1)

    this.init()
  }

  init() {
    this.geometry = new Plane(this.gl)
    this.program = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.frag,
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      cullFace: this.gl.FRONT,
      uniforms: {
        uTexture: { value: this.texture },
        uNoiseTexture: { value: this.noiseTexture },
        uTime: { value: this.scene.time },
        uAlpha: { value: this.alpha },
        uColor: { value: this.color },
        uReflectionOpacity: this.config.ReflectionOpacity,
        uReflectionSize: this.config.ReflectionSize,
        uReflectionScale: this.config.ReflectionScale,
        uCircleRadius: this.config.CircleRadius,
        uFeather: this.config.Feather,
        uScrollSpeed: this.config.ScrollSpeed,
        uRez: { value: [this.scene.width, this.scene.height] },
      },
    })

    this.program.setBlendFunc(this.blendFunc.src, this.blendFunc.dst)
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: this.renderOrder })
    this.mesh.name = this.name
    this.mesh.scale.set(this.scale, this.scale, this.scale)
    this.mesh.rotation.x = Math.PI / 2
    this.mesh.setParent(this.parent)

    this.scene.on('konami', () => [(this.config.ScrollSpeed.value = 0)])
  }

  onLoaded() {
    // if (this.textureId) {
    // }
    this.noiseTexture = this.scene.textureLoader.getTexture('noiseGroundTest')
    this.noiseTexture.needsUpdate = true
    this.program.uniforms['uNoiseTexture'].value = this.noiseTexture
  }

  preRender() {
    this.texture.needsUpdate = true
    this.program.uniforms['uTime'].value = this.scene.time
    this.program.uniforms['uAlpha'].value = this.alpha
    this.program.uniforms['uColor'].value = new Color(this.config.floorColor.value)
    this.program.uniforms['uRez'].value = [this.scene.width, this.scene.height]
  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}

export default FakeReflectionFloor
