import PostProcessRT from './PostProcessRT'
import Rendable from '@/glxp/abstract/rendable'
import Shader from '@/glxp/utils/Shader'
import Mouse from '@/glxp/utils/Mouse'

import ShaderManifest from '@/glxp/shaderManifest'
import DebugController from '@/glxp/debug/DebugController'

const VERTICES  = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
const INDICES   = [0, 1, 2, 0, 2, 3]
const UVS       = [0, 1, 0, 0, 1, 0, 1, 1]

class Post extends Rendable {
  constructor(scene) {
    super(scene)
    this.hasNormal = false
    // this.onlyVertices = false

    var shader = new Shader(ShaderManifest['post'])

    this.initProgram(shader.vert, shader.frag)
    this.initBuffer({
      vertices: VERTICES,
      uvs: UVS,
      indices: INDICES,
    })
    this.initVao()
    this.createUniforms()

    this.rt = new PostProcessRT(this.scene)

    this.config = {
      HueShift: { value: 0, range: [0, Math.PI * 2] },
    }

    DebugController.addConfig(this.config, 'Post')
  }

  createUniforms() {
    this.createUniform('uTexture', 'texture')
    this.createUniform('uRez', 'float2')
    this.createUniform('uMouse', 'float2')
    this.createUniform('uTime')
    this.createUniform('uHueShift')
  }

  applyState() {
    let gl = this.gl
    this.scene.applyDefaultState()
    gl.disable(gl.DEPTH_TEST)
    // gl.disable(gl.BLEND)
  }

  preRender() {
    this.rt.preRender()
  }

  postRender() {
    this.rt.postRender()
  }

  render() {
    let gl = this.gl

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    this.applyState()

    gl.activeTexture(gl.TEXTURE0)
    this.rt.bind()
    this.bindUniform('uTexture', 0)

    this.bindUniform('uRez', [this.scene.width, this.scene.height])
    this.bindUniform('uMouse', Mouse.cursor)
    this.bindUniform('uTime', this.scene.time)
    this.bindUniform('uHueShift', this.config.HueShift.value)

    gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)
    gl.bindVertexArray(null)
  }
}

export default Post
