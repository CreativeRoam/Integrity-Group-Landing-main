import { mat3 } from 'gl-matrix'

import { Mesh } from '@/glxp/ogl/core/Mesh'
import { Program } from '@/glxp/ogl/core/Program.js'
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { Sphere } from '@/glxp/ogl/extras/Sphere'

//import DebugController from '@/glxp/debug/DebugController'
import ShaderManifest from '@/glxp/shaderManifest'
import Shader from '@/glxp/utils/shader'

export default class MeshTestMatcap extends Mesh {
  geometry
  program
  textureId
  scene
  matcapTexture
  altNormalMatrix
  config = {
    
  }

  constructor(
    scene,
    {
      textureId = 'matcap',
      geometry = new Sphere(scene.gl, {
        radius: 2,
        widthSegments: 54,
        heightSegments: 54,
      }),
    }
  ) {
    const shader = new Shader(ShaderManifest['matcap'])
    const program = new Program(scene.gl, {
      vertex: shader.vert,
      fragment: shader.frag,
      uniforms: {
        uEye: { value: scene.camera.position },
        uViewMatrix: { value: scene.camera.viewMatrix },
        uNormalMatrix: { value: mat3.create() },
        uMatcap: { value: new Texture(scene.gl, {}) },
        uResolution: { value: [0, 0] },
        uTime: { value: 0 },
      },
    })

    super(scene.gl, { geometry, program })
    // this.mode = this.gl.LINE_LOOP
    this.geometry = geometry
    this.program = program
    this.scene = scene
    this.textureId = textureId
    this.altNormalMatrix = mat3.create()

    //DebugController.addBlade(this.config, `${this.scene.name} - Matcap`, 1)
  }

  onLoaded() {
    if (this.textureId) {
      this.matcapTexture = this.scene.textureLoader.getTexture(this.textureId)
      this.matcapTexture.needsUpdate = true
      this.program.uniforms['uMatcap'].value = this.matcapTexture
    }
  }

  preRender() {
    // Ogl normal matrix is fucked?
    mat3.fromMat4(this.altNormalMatrix, this.modelViewMatrix)
    mat3.invert(this.altNormalMatrix, this.altNormalMatrix)
    mat3.transpose(this.altNormalMatrix, this.altNormalMatrix)
    this.program.uniforms['uNormalMatrix'].value = this.altNormalMatrix

    this.program.uniforms['uTime'].value = this.scene.time

    this.program.uniforms['uResolution'].value = [
      this.scene.width,
      this.scene.height,
    ]
  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}
