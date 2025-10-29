import PostProcessRT from './PostProcessRT'
import Rendable from '@/glxp/abstract/rendable'
import Shader from '@/glxp/utils/Shader'
import Mouse from '@/glxp/utils/Mouse'

import ShaderManifest from '@/glxp/shaderManifest'

const VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
const INDICES = [0, 1, 2, 0, 2, 3]
const UVS = [0, 1, 0, 0, 1, 0, 1, 1]

class Blur extends Rendable {
  constructor(scene, parent) {
    super(scene)
    this.hasNormal = false

    this.parent = parent
    this.direction = [0, 0]

    var shader = new Shader(ShaderManifest['postBlur'], 2, {
      TRANSPARENT: parent.transparent ? 1 : 0,
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

    this.rts = [new PostProcessRT(this.scene, parent.rtScale, 'rgba', null, true, 'linear', parent.transparent), new PostProcessRT(this.scene, parent.rtScale, 'rgba', null, true, 'linear', parent.transparent)]
  }

  createUniforms() {
    this.createUniform('uTexture', 'texture')
    this.createUniform('uRez', 'float2')
    this.createUniform('uDir', 'float2')
    this.createUniform('uPower')
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

  bind() {
    this.rts[this.activeRt].bind()
  }

  render() {
    let gl = this.gl

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    this.applyState()

    this.preRender()

    this.bindUniform('uRez', [this.scene.width, this.scene.height])
    this.direction = this.parent.blurPass[0]
    this.bindUniform('uDir', this.direction)

    gl.activeTexture(gl.TEXTURE0)
    this.parent.rt.bind()
    this.bindUniform('uTexture', 0)

    this.bindUniform('uPower', this.parent.power)

    gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)

    this.postRender()

    for (let i = 1; i < this.parent.blurPass.length; i++) {
      this.preRender()

      this.direction = this.parent.blurPass[i]
      this.bindUniform('uDir', this.direction)
      gl.activeTexture(gl.TEXTURE0)
      this.rts[this.activeRt].bind()
      this.bindUniform('uTexture', 0)

      gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)

      this.postRender()
    }

    gl.bindVertexArray(null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
}

class Post extends Rendable {
  constructor(
    scene,
    {
      needRt = false,
      rtScale = 0.2,
      blurPass = [
        [10, 0],
        [0, 10],
        [5, 0],
        [0, 5],
      ],
      transparent = false,
      isAdditive = true,
      isScreen = false,
      colorCorrection = false,
      config = null,
    }
  ) {
    super(scene)
    this.hasNormal = false
    this.rtScale = rtScale
    this.blurPass = blurPass
    this.needRt = needRt
    this.transparent = transparent
    this.colorCorrection = colorCorrection
    this.isAdditive = isAdditive
    this.isScreen = isScreen
    this.config = config

    var shader = new Shader(ShaderManifest['postBlur'], 2, {
      TRANSPARENT: this.transparent ? 1 : 0,
      COLOR_CORRECTION: this.colorCorrection ? 1 : 0,
    })

    this.initProgram(shader.vert, shader.frag)
    this.initBuffer({
      vertices: VERTICES,
      uvs: UVS,
      indices: INDICES,
    })
    this.initVao()
    this.createUniforms()

    this.blur = new Blur(this.scene, this)
    this.rt = new PostProcessRT(this.scene, 1, 'rgba', null, true, 'linear', transparent)

    this.power = 0
  }

  createUniforms() {
    this.createUniform('uBlur', 'texture')
    this.createUniform('uRez', 'float2')
    if (this.config) {
      this.createUniform('uShift')
      this.createUniform('uBrightness')
      this.createUniform('uContrast')
    }
  }

  applyState() {
    let gl = this.gl
    this.scene.applyDefaultState()
    gl.disable(gl.DEPTH_TEST)
    gl.depthMask(false)
    if (this.isAdditive) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR)
    }
    if (this.isScreen) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    }
  }

  preRender() {
    this.rt.preRender()
  }
  postRender() {
    this.rt.postRender()
  }
  bind() {
    this.rt.bind()
  }
  getTexture() {
    this.rt.getTexture()
  }

  render() {
    let gl = this.gl
    this.blur.render()

    if (this.needRt) {
      this.preRender()
    }

    this.gl.viewport(0, 0, this.scene.width, this.scene.height)

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    this.applyState()

    gl.activeTexture(gl.TEXTURE0)
    this.blur.bind()
    this.bindUniform('uBlur', 0)
    this.bindUniform('uRez', [this.scene.width, this.scene.height])

    if (this.config) {
      this.bindUniform('uShift', this.config.hueShift.value)
      this.bindUniform('uBrightness', this.config.brightness.value)
      this.bindUniform('uContrast', this.config.contrast.value)
    }

    gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)
    gl.bindVertexArray(null)

    if (this.needRt) {
      this.postRender()
    }
  }
}

export default Post
