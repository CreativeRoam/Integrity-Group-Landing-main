import Rendable from '@/glxp/abstract/rendable'
import Shader from '@/glxp/utils/Shader'

import ShaderManifest from '@/glxp/shaderManifest'

const VERTICES = [0, 0, 0]

class Point extends Rendable {
  constructor(scene) {
    super(scene)

    this.gl = scene.gl
    this.scene = scene
    this.vertices = VERTICES

    this.hasNormal = false
    this.onlyVertices = true

    this.color = [0, 0, 1]
    this.size = 3

    var shader = new Shader(ShaderManifest['point-debug'])

    this.initProgram(shader.vert, shader.frag)
    this.initBuffer({
      vertices: this.vertices,
    })
    this.initVao()
    this.initMatrix()
    this.createUniforms()
  }

  createUniforms() {
    this.createUniform('uColor', 'float3')
    this.createUniform('uSize')
  }

  applyState() {
    let gl = this.gl
    this.scene.applyDefaultState()
    gl.disable(gl.DEPTH_TEST)
    // gl.disable(gl.BLEND)
  }

  render() {
    let gl = this.gl

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    this.applyState()

    this.bindMatrixUniforms(this.scene.camera)
    this.bindUniform('uColor', this.color)
    this.bindUniform('uSize', this.size)

    // gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)
    gl.drawArrays(gl.POINT, 0, 1)

    gl.bindVertexArray(null)
  }
}

export default Point
