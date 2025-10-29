import Rendable from '@/glxp/abstract/rendable'
import Shader from '@/glxp/utils/Shader'
import Node from '@/glxp/abstract/node'

import ShaderManifest from '@/glxp/shaderManifest'
import { vec3 } from 'gl-matrix'

class Leaf extends Rendable {
  constructor(scene, geoms, shader) {
    super(scene)

    this.gl = scene.gl
    this.scene = scene
    this.geoms = geoms

    this.node = new Node()
    this.scene.root.addChildNode(this.node)
    this.shader = new Shader(ShaderManifest[shader])
    this.attributes = []

    // this.hasNormal = false
    this.createAttribute('aUvs', 'aUvs', 2, geoms[0].uvs)
    this.createAttribute('aPos00', 'aPos', 3, geoms[0].vertices)
    this.createAttribute('aNormal00', 'aNormal', 3, geoms[0].normals)

    this.initBuffer({
      indices: geoms[0].indices,
    })

    this.initProgram(this.shader.vert, this.shader.frag)
    this.initVao()
    this.initMatrix()
    this.createUniforms()

    this.node.scale = vec3.fromValues(0.007, 0.007, 0.007)
  }

  createAttribute(name, attributeName, dimensions, data) {
    this.attributes.push({ active: true, name, attributeName, dimensions, buffer: null, data })
  }

  initProgram(vert, frag) {
    let gl = this.gl

    let vertShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertShader, vert)
    gl.compileShader(vertShader)

    let fragSahder = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragSahder, frag)
    gl.compileShader(fragSahder)

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      console.error('error vert', this, gl.getShaderInfoLog(vertShader))
      return null
    }

    if (!gl.getShaderParameter(fragSahder, gl.COMPILE_STATUS)) {
      console.error('error frag', this, gl.getShaderInfoLog(fragSahder))
      return null
    }

    let shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertShader)
    gl.attachShader(shaderProgram, fragSahder)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Could not initialise shaders', gl.getProgramInfoLog(shaderProgram))
    }

    gl.useProgram(shaderProgram)

    // Custom attibutes
    this.attributes.forEach((attr) => {
      shaderProgram[`${attr.attributeName}Attribute`] = gl.getAttribLocation(shaderProgram, attr.attributeName)
    })

    this.vertShader = vertShader
    this.fragSahder = fragSahder
    this.program = shaderProgram

    const numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES)
    for (let ii = 0; ii < numAttribs; ++ii) {
      const attribInfo = gl.getActiveAttrib(shaderProgram, ii)
      gl.getAttribLocation(shaderProgram, attribInfo.name)
    }
  }

  initBuffer(geom) {
    let gl = this.gl

    this.attributes.forEach((attr) => {
      attr.buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attr.data), gl.STATIC_DRAW)
    })

    let indicesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geom.indices), gl.STATIC_DRAW)
    this.indicesBuffer = indicesBuffer
  }

  createUniforms() {
    this.createUniform('uTexture', 'texture')
  }

  applyState() {
    let gl = this.gl

    this.scene.applyDefaultState()

    gl.disable(gl.CULL_FACE)
    // gl.disable(gl.DEPTH_TEST)
    // gl.depthMask(false)
  }

  preRender() {
    this.node.rotation[1] = this.scene.time * 0.2
    this.node.rotation[2] = this.scene.time * 0.05
    this.node.needUpdate = true
  }

  render() {
    this.preRender()

    let gl = this.gl
    gl.useProgram(this.program)

    this.applyState()

    // Buffer Binding
    for (let i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes[i]
      if (attr.active) {
        gl.enableVertexAttribArray(this.program[attr.attributeName + 'Attribute'])
        gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer)
        gl.vertexAttribPointer(this.program[attr.attributeName + 'Attribute'], attr.dimensions, gl.FLOAT, false, 0, 0)
      }
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)

    // Buffer Binding
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.scene.textureLoader.getTexture('test'))
    this.bindUniform('uTexture', 0)
    this.bindMatrixUniforms(this.scene.camera)

    gl.drawElements(gl.TRIANGLES, this.geoms[0].indices.length, gl.UNSIGNED_SHORT, 0)
  }
}

export default Leaf
