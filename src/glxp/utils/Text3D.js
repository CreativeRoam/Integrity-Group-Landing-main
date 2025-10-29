import { Texture } from '@/glxp/ogl/core/Texture'
import { Program } from '@/glxp/ogl/core/Program'
import { Geometry } from '@/glxp/ogl/core/Geometry'
import { Mesh } from '@/glxp/ogl/core/Mesh'
import { Color } from '@/glxp/ogl/math/Color'
import when from 'when'

import { Text } from '@/glxp/utils/TextOGL'
import ShaderManifest from '@/glxp/shaderManifest'
import Shader from '@/glxp/utils/Shader'

class Text3D {
  constructor() {
    window.__Text3D = this
    this.ready = when.defer()
  }

  setGL(gl, renderer) {
    this.gl = gl
    this.renderer = renderer
  }

  async loadFonts() {
    this.ophianTexture = new Texture(this.gl, {
      generateMipmaps: false,
    })
    this.proximaTexture = new Texture(this.gl, {
      generateMipmaps: false,
    })
    this.proximaBoldTexture = new Texture(this.gl, {
      generateMipmaps: false,
    })
    this.ophianTexture.wrapS = this.gl.CLAMP_TO_EDGE
    this.ophianTexture.wrapT = this.gl.CLAMP_TO_EDGE
    this.proximaTexture.wrapS = this.gl.CLAMP_TO_EDGE
    this.proximaTexture.wrapT = this.gl.CLAMP_TO_EDGE
    this.proximaBoldTexture.wrapS = this.gl.CLAMP_TO_EDGE
    this.proximaBoldTexture.wrapT = this.gl.CLAMP_TO_EDGE

    const img1 = new Image()
    img1.onload = () => {
      this.ophianTexture.image = img1
      this.ophianTexture.needsUpdate = true
    }
    img1.src = '/fonts/msdf/Ophian.png'

    const img2 = new Image()
    img2.onload = () => {
      this.proximaTexture.image = img2
      this.proximaTexture.needsUpdate = true
    }
    img2.src = '/fonts/msdf/ProximaNova.png'

    const img3 = new Image()
    img3.onload = () => {
      this.proximaBoldTexture.image = img3
      this.proximaBoldTexture.needsUpdate = true
    }
    img3.src = '/fonts/msdf/ProximaNova-Bold.png'

    this.fontOphian = await (await fetch('/fonts/msdf/Ophian-msdf.json')).json()
    this.fontProxima = await (await fetch('/fonts/msdf/ProximaNova-msdf.json')).json()
    this.fontProximaBold = await (await fetch('/fonts/msdf/ProximaNova-Bold-msdf.json')).json()

    this.ready.resolve(true)
  }

  getNewProgram(color = '#FFFFFF', alpha = 1.0, font, depthTest) {
    let fontTexture = font === 'Ophian' ? this.ophianTexture : this.proximaTexture
    const shader = new Shader(ShaderManifest['text'])

    const vertex100 = shader.vert
    const fragment100 =
      `#extension GL_OES_standard_derivatives : enable
    precision highp float;
    ` + shader.frag
    const vertex300 =
      `#version 300 es
    #define attribute in
    #define varying out
    ` + shader.vert
    const fragment300 =
      `#version 300 es
    precision highp float;
    #define varying in
    #define texture2D texture
    #define gl_FragColor FragColor
    out vec4 FragColor;
    ` + shader.frag

    return new Program(this.gl, {
      // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
      vertex: this.renderer.isWebgl2 ? vertex300 : vertex100,
      fragment: this.renderer.isWebgl2 ? fragment300 : fragment100,
      uniforms: {
        tMap: { value: fontTexture },
        uColor: { value: new Color(color) },
        uAlpha: { value: alpha },
        uNumChars: { value: 0 },
        uAnimation: { value: 0 },
      },
      transparent: true,
      depthTest: depthTest,
      // cullFace: null,
      depthWrite: false,
    })
  }

  getParagraphProgram(color = '#FFFFFF', alpha = 1.0, font, depthTest) {
    let fontTexture = this.ophianTexture
    if (font === 'Proxima') fontTexture = this.proximaTexture
    else if (font === 'Proxima-Bold') fontTexture = this.proximaBoldTexture
    const shader = new Shader(ShaderManifest['paragraph'])

    const vertex100 = shader.vert
    const fragment100 =
    `#extension GL_OES_standard_derivatives : enable
    precision highp float;
    ` + shader.frag
    const vertex300 =
    `#version 300 es
    #define attribute in
    #define varying out
    ` + shader.vert
    const fragment300 =
    `#version 300 es
    precision highp float;
    #define varying in
    #define texture2D texture
    #define gl_FragColor FragColor
    out vec4 FragColor;
    ` + shader.frag

    return new Program(this.gl, {
      // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
      vertex: this.renderer.isWebgl2 ? vertex300 : vertex100,
      fragment: this.renderer.isWebgl2 ? fragment300 : fragment100,
      uniforms: {
        tMap: { value: fontTexture },
        uColor: { value: new Color(color) },
        uAlpha: { value: alpha },
        uNumChars: { value: 0 },
        uAnimationIn: { value: 0 },
        uAnimationOut: { value: 0 },
      },
      transparent: true,
      depthTest: depthTest,
      // cullFace: null,
      depthWrite: false,
    })
  }

  getTitleProgram(color = '#FFFFFF', alpha = 1.0, font, colorTexture, depthTest = false) {
    let fontTexture = font === 'Ophian' ? this.ophianTexture : this.proximaTexture

    const shader = new Shader(ShaderManifest['title'])

    const titleVertex100 = shader.vert

    const titleFragment100 =
    `#extension GL_OES_standard_derivatives : enable
    precision highp float;
    ` + shader.frag

    const titleVertex300 =
    `#version 300 es
    #define attribute in
    #define varying out
    ` + shader.vert

    const titleFragment300 =
    `#version 300 es
    precision highp float;
    #define varying in
    #define texture2D texture
    #define gl_FragColor FragColor
    out vec4 FragColor;
    ` + shader.frag

    return new Program(this.gl, {
      // Get fallback shader for WebGL1 - needed for OES_standard_derivatives ext
      vertex: this.renderer.isWebgl2 ? titleVertex300 : titleVertex100,
      fragment: this.renderer.isWebgl2 ? titleFragment300 : titleFragment100,
      uniforms: {
        tMap: { value: fontTexture },
        uLevelsMap: { value: new Texture(this.gl) },
        uColor: { value: new Color(color) },
        uAlpha: { value: alpha },
        uNumChars: { value: 0 },
        uAnimationIn: { value: 0 },
        uAnimationOut: { value: 0 },

        uDebug: { value: 12 },
      },
      transparent: true,
      depthTest: depthTest,
      // cullFace: null,
      // depthWrite: true
    })
  }

  createText({ textContent, size = 0.1, font = 'Ophian', color = '#FFFFF', alpha = 1.0, letterSpacing = 0.0, align = 'center', lineHeight = 1.1, customProgram = false, width = null, renderOrder = 100, depthTest = true }) {
    let program
    if (customProgram) {
      if (customProgram === 'title') program = this.getTitleProgram(color, alpha, font, depthTest)
      if (customProgram === 'paragraph') program = this.getParagraphProgram(color, alpha, font, depthTest)
    } else {
      program = this.getNewProgram(color, alpha, font, depthTest)
    }

    let fontFamily = this.fontOphian
    if (font === 'Proxima') fontFamily = this.fontProxima
    else if (font === 'Proxima-Bold') fontFamily = this.fontProximaBold

    let text
    if (width) {
      text = new Text({
        font: fontFamily,
        text: textContent,
        align,
        letterSpacing: letterSpacing,
        size: size,
        width: width,
        lineHeight: lineHeight,
      })
    } else {
      text = new Text({
        font: fontFamily,
        text: textContent,
        align,
        letterSpacing: letterSpacing,
        size: size,
        lineHeight: lineHeight,
      })
    }

    program.uniforms.uNumChars.value = text.numChars

    let geometry = new Geometry(this.gl, {
      position: { size: 3, data: text.buffers.position },
      uv: { size: 2, data: text.buffers.uv },
      id: { size: 1, data: text.buffers.id },
      index: { data: text.buffers.index },
    })

    let mesh
    if (renderOrder > 0) {
      mesh = new Mesh(this.gl, {
        geometry: geometry,
        program: program,
        renderOrder: renderOrder,
      })
    } else {
      mesh = new Mesh(this.gl, {
        geometry: geometry,
        program: program,
      })
    }

    return {
      mesh: mesh,
      text: text,
    }
  }
}

export default new Text3D()
