import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'

import { Text } from '@/glxp/ogl/extras/Text.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Geometry } from '@/glxp/ogl/core/Geometry.js'
import { Transform } from '@/glxp/ogl/core/Transform.js'
import { Color } from '@/glxp/ogl/math/Color'

class TextManager {
  constructor(scene) {
    this.scene = scene
    this.gl = scene.gl
    this.meshes3D = []
    this.meshes2D = []
  }

  create3DText({
    font,
    textContent,
    shaderId = 'MSDFUnlit',
    width = Infinity,
    align = 'left',
    size = 1,
    letterSpacing = 0,
    lineHeight = 1.4,
    wordSpacing = 0,
    alpha = 1,
    progress = 0,
    color = '#ffffff',
    wordBreak = false,
    // legacy params
    parent = null,
    cullFace = this.scene.gl.BACK,
    scale = 1,
    transparent = true,
    depthTest = true,
    depthWrite = true,
  } = {}) {
    let loadedFont = this.scene.fontLoader.getFont(font)
    let shader = new Shader(ShaderManifest[shaderId])

    const t = new Text({
      font: loadedFont.font,
      text: textContent,
      width,
      align,
      letterSpacing,
      size,
      lineHeight,
      wordSpacing,
      wordBreak,
    })

    const geometry = new Geometry(this.gl, {
      position: { size: 3, data: t.buffers.position },
      center: { size: 3, data: t.buffers.centroid },
      uv: { size: 2, data: t.buffers.uv },
      charsId: { size: 1, data: t.buffers.id },
      index: { data: t.buffers.index },
    })

    const program = new Program(this.gl, {
      vertex: shader.vert,
      fragment: shader.frag,
      depthTest,
      depthWrite,
      cullFace,
      transparent,
      uniforms: {
        tMap: { value: loadedFont.texture },
        uColor: { value: new Color(color) },
        uMaxIds: { value: t.numChars - 1 },
        uAnimationDirrection: { value: [-1, 0] },
        uRez: { value: [this.scene.width, this.scene.height] },
        uAlpha: { value: alpha },
        uProgress: { value: progress },
      },
    })

    const text = new Transform()
    text.scale.set(scale, scale, scale)
    text.setParent(parent ? parent : this.scene.root)

    const mesh = new Mesh(this.gl, { geometry, program })
    mesh.setParent(text)
    mesh.position.y = t.height * 0.5
    this.meshes3D.push(mesh)
    text.mesh = mesh
    text.text = t

    return text
  }

  // create2DText(){

  // }

  preRender() {
    for (let i = 0; i < this.meshes3D.length; i++) {
      const m = this.meshes3D[i]
      m.program.uniforms['uRez'].value = [this.scene.width, this.scene.height]
    }
  }
}

export default TextManager
