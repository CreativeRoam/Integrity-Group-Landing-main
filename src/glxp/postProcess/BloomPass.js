import PostProcessRT from './PostProcessRT'
import Rendable from '@/glxp/abstract/rendable'
import Shader from '@/glxp/utils/Shader'

import ShaderManifest from '@/glxp/shaderManifest'
import DebugController from '@/glxp/debug/DebugController'
import { Color } from '@/glxp/ogl/math/Color'
import { vec3 } from 'gl-matrix'

const VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
const INDICES = [0, 1, 2, 0, 2, 3]
const UVS = [0, 1, 0, 0, 1, 0, 1, 1]

class Blur extends Rendable {
  constructor(scene, parent, id) {
    super(scene)
    this.hasNormal = false

    this.parent = parent
    this.rtScale = 0.15
    this.power = 0
    this.id = id
    this.transparent = true
    this.direction = [0, 0]
    this.threshold = 0
    this.color = vec3.fromValues(1, 1, 1)

    this.blurPass = [
      [4, -1],
      [-1, 4],
      [1, 0],
      [0, 1],
    ]

    var shader = new Shader(ShaderManifest['postBlur'], 2, {
      TRANSPARENT: this.transparent ? 1 : 0,
    })

    this.initProgram(shader.vert, shader.passes[0])
    this.initBuffer({
      vertices: VERTICES,
      uvs: UVS,
      indices: INDICES,
    })
    this.initVao()
    this.createUniforms()

    this.activeRt = 0
    this.disabledRt = 1

    this.rts = [new PostProcessRT(this.scene, this.rtScale, 'rgba', null, true, 'linear', this.transparent), new PostProcessRT(this.scene, this.rtScale, 'rgba', null, true, 'linear', this.transparent)]

    this.config = {
      BloomTint: { value: '#ffffff', params: {} },
      Threshold: { value: 0.7, params: { min: 0, max: 1.25, step: 0.01 } },
      Blur: { value: 1, params: { min: 0, max: 1, step: 0.01 } },
      Overdrive: { value: 0, params: { min: 0, max: 1, step: 0.01 } },
      Similarity: { value: 0.1, params: { min: 0, max: 0.2, step: 0.001 } },
    }
    DebugController.addBlade(this.config, `Bloom - ${this.scene.name || 'Unknown'}`, 0)
  }

  createUniforms() {
    this.createUniform('uTexture', 'texture')
    this.createUniform('uRez', 'float2')
    this.createUniform('uDir', 'float2')
    this.createUniform('uTint', 'float3')
    this.createUniform('uPower')
    this.createUniform('uIsFirstPass')
    this.createUniform('uThresold')
    this.createUniform('uSimilarity')
    this.createUniform('uOverdrive')
  }

  applyState() {
    let gl = this.gl
    this.scene.applyDefaultState()
    gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
  }

  preRender() {
    this.rts[this.disabledRt].preRender()
  }

  postRender() {
    this.rts[this.disabledRt].postRender()
    this.activeRt = this.activeRt === 1 ? 0 : 1
    this.disabledRt = this.disabledRt === 1 ? 0 : 1
  }

  clear() {
    this.rts[this.activeRt].clear()
    this.rts[this.disabledRt].clear()
  }

  bind() {
    this.rts[this.activeRt].bind()
  }

  getTexture() {
    return this.rts[this.activeRt].getTexture()
  }

  render() {
    let gl = this.gl

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    this.applyState()

    this.preRender()

    this.power = this.config.Blur.value
    this.color = new Color(this.config.BloomTint.value)
    this.threshold = this.config.Threshold.value

    this.bindUniform('uRez', [this.scene.width, this.scene.height])
    this.direction = this.blurPass[0]
    this.bindUniform('uDir', [this.direction[0] * this.scene.dpr, this.direction[1] * this.scene.dpr])

    gl.activeTexture(gl.TEXTURE0)
    this.parent.rt.bind()
    this.bindUniform('uTexture', 0)

    this.bindUniform('uPower', this.power)
    this.bindUniform('uIsFirstPass', 1)
    this.bindUniform('uTint', this.color)
    this.bindUniform('uThresold', this.threshold)
    this.bindUniform('uSimilarity', this.config.Similarity.value)
    this.bindUniform('uOverdrive', this.config.Overdrive.value)

    gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)

    this.postRender()

    for (let i = 1; i < this.blurPass.length; i++) {
      this.preRender()

      this.direction = this.blurPass[i]
      this.bindUniform('uDir', [this.direction[0] * this.scene.dpr, this.direction[1] * this.scene.dpr])
      gl.activeTexture(gl.TEXTURE0)
      this.rts[this.activeRt].bind()
      this.bindUniform('uTexture', 0)
      this.bindUniform('uIsFirstPass', 0)

      gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)

      this.postRender()
    }

    gl.bindVertexArray(null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
}

export default Blur
