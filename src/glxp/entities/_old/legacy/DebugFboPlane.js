import Rendable from '@/glxp/abstract/rendable'

const scale = 0.1
const VERTICES = [-1, -scale, 0, -1, -1, 0, -scale, -1, 0, -scale, -scale, 0]
const INDICES = [0, 1, 2, 0, 2, 3]
const UVS = [0, 1, 0, 0, 1, 0, 1, 1]

class Debug extends Rendable {
  constructor(scene, fbo) {
    super(scene)
    this.hasNormal = false
    this.fbo = fbo
    // this.onlyVertices = false

    this.initProgram(
      `
            precision highp float;

            attribute vec3 aPos;
            attribute vec2 aUvs;

            varying vec2 vUv;

            void main(void) {
                vUv = aUvs;
                gl_Position = vec4(aPos*.5 - .5, 1.0);
            }
            `,
      `
            
            precision highp float;

            uniform sampler2D uTexture;
            varying vec2 vUv;

            void main() {
                
                vec3 color = vec3(0.);
                color += texture2D( uTexture, vec2(vUv.x * .2 + 0.0, vUv.y * .2 - 0.19)).rgb * ceil(vUv.y * .2 - 0.19);
                color += texture2D( uTexture, vec2(vUv.x * .2 + 0.2, vUv.y * .2 - 0.18)).rgb * ceil(vUv.y * .2 - 0.18);
                color += texture2D( uTexture, vec2(vUv.x * .2 + 0.4, vUv.y * .2 - 0.17)).rgb * ceil(vUv.y * .2 - 0.17);
                color += texture2D( uTexture, vec2(vUv.x * .2 + 0.6, vUv.y * .2 - 0.16)).rgb * ceil(vUv.y * .2 - 0.16);
                color += texture2D( uTexture, vec2(vUv.x * .2 + 0.8, vUv.y * .2 - 0.15)).rgb * ceil(vUv.y * .2 - 0.15);

                gl_FragColor = vec4(color, 1.);
            }
            
            `
    )
    this.initBuffer({
      vertices: VERTICES,
      uvs: UVS,
      indices: INDICES,
    })
    this.initVao()
    this.createUniforms()

    // DebugController.addConfig(this.config, 'Post')
  }

  createUniforms() {
    this.createUniform('uTexture', 'texture')
    this.createUniform('uRez', 'float2')
    this.createUniform('uTime')
    this.createUniform('uIndex')
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

  bindTexture() {
    this.rt.bind()
  }

  render() {
    let gl = this.gl

    gl.useProgram(this.program)
    gl.bindVertexArray(this.vao)
    this.applyState()

    gl.activeTexture(gl.TEXTURE0)
    this.fbo.bindTexture()
    // this.scene.ground.rt.bind()
    this.bindUniform('uTexture', 0)

    this.bindUniform('uRez', [this.scene.width, this.scene.height])
    this.bindUniform('uTime', this.scene.time)

    gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_SHORT, 0)
    gl.bindVertexArray(null)
    gl.useProgram(null)
  }
}

export default Debug
