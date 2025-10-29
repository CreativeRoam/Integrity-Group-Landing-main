import ejs from 'ejs/ejs'
import ShaderManifest from '@/glxp/shaderManifest'
import WebglManager from '@/glxp/WebGLManager'

// replaceAll polyfill if needed (iOS < 13)
if (!String.prototype.replaceAll) {
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }

  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr)
    }

    // If a string
    return this.replace(new RegExp(escapeRegExp(str), 'g'), newStr)
  }
}

class Shader {
  constructor(string, passes = 1, defines = {}, attributesCount = false, uniformsCount = false) {
    this.string = string
    this.defines = defines
    let definesToString = function (defines) {
      let outStr = ''
      for (let def in defines) {
        outStr += '#define ' + def + ' ' + defines[def] + '\n'
      }
      return outStr
    }
    let _passes = {}

    let frag = ejs.render(this.string, {
      frag: true,
      vert: false,
      passes: _passes,
      commons: ShaderManifest.commons,
      defines,
    })
    let vert = ejs.render(this.string, {
      frag: false,
      vert: true,
      passes: _passes,
      commons: ShaderManifest.commons,
      defines,
    })

    const gl = WebglManager.gl
    let extensionStr = ''

    frag = frag.replaceAll('&lt;', '<')
    frag = frag.replaceAll('&gt;', '>')
    vert = vert.replaceAll('&lt;', '<')
    vert = vert.replaceAll('&gt;', '>')

    if (string.includes('needES300')) {
      string = string.replaceAll('needES300', '')
      frag = frag.replaceAll('needES300', '')
      vert = vert.replaceAll('needES300', '')
      if (WebglManager.renderer.isWebgl2) {
        extensionStr += '#version 300 es' + '\n'
      } else {
        this.defines['IS_WEBGL_1'] = 1
        extensionStr += '#extension GL_OES_standard_derivatives : enable' + '\n'

        vert = vert.replaceAll('texture(', 'texture2D(')
        vert = vert.replaceAll('in ', 'attribute ')
        vert = vert.replaceAll('out ', 'varying ')

        frag = frag.replaceAll('texture(', 'texture2D(')
        frag = frag.replaceAll('in ', 'varying ')
        frag = frag.replaceAll('out ', '// ')
      }
    }

    let shaderDefines = definesToString(this.defines)

    if (passes > 1) {
      this.passes = []
      for (let i = 0; i < passes - 1; i++) {
        _passes['pass_' + (i + 1)] = true
        let p = ejs.render(this.string, {
          frag: false,
          vert: false,
          passes: _passes,
          commons: ShaderManifest.commons,
          defines,
        })
        p = p.replaceAll('&lt;', '<')
        p = p.replaceAll('&gt;', '>')
        this.passes.push(extensionStr + shaderDefines + p)
        _passes['pass_' + (i + 1)] = false
      }
    }

    this.frag = extensionStr + shaderDefines + frag
    this.vert = extensionStr + shaderDefines + vert

    // TODO: calc this dynamically
    // example regex to get an exact match for 'uv' : /(?:^|\W)uv(?:$|\W)
    this.attributesCount = attributesCount
    this.uniformsCount = uniformsCount
  }
}

export default Shader
