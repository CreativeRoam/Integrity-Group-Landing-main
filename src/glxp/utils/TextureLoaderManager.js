import { Texture } from '@/glxp/ogl/core/Texture.js'
import { BasisManager } from '@/glxp/ogl/extras/BasisManager'

class TextureLoaderManager {
  constructor(gl) {
    this.gl = gl
    this.textures = {}
    this.currentUnit = 0

    this.USE_AVIF_IF_SUPPORTED = true // constant, set to false if you don't want any .avif

    this.avifPromise = null
    this.isCompressedSupport = false
    this.fallbackFormatWithoutTransparency = '.jpg'
    this.detectFallbackFormats()

    const EXT = {
      astcSupported: !!gl.renderer.getExtension('WEBGL_compressed_texture_astc'),
      etc1Supported: !!gl.renderer.getExtension('WEBGL_compressed_texture_etc1'),
      etc2Supported: !!gl.renderer.getExtension('WEBGL_compressed_texture_etc'),
      dxtSupported: !!gl.renderer.getExtension('WEBGL_compressed_texture_s3tc'),
      bptcSupported: !!gl.renderer.getExtension('EXT_texture_compression_bptc'),
      pvrtcSupported: !!gl.renderer.getExtension('WEBGL_compressed_texture_pvrtc') || !!gl.renderer.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
    }

    for (const [key, extension] of Object.entries(EXT)) {
      if (extension) this.isCompressedSupport = true
    }

    this.basisManager = new BasisManager(`/vendors/basis/BasisWorker.js`)
  }

  async detectFallbackFormats() {
    if (this.avifPromise) {
      // avoid detecting twice
      return this.avifPromise
    }

    // detect webp support (synchronous)
    this.supportsWebp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0
    this.fallbackFormatWithoutTransparency = this.supportsWebp ? '.webp' : '.jpg'
    
    // detect avif support (asynchronous)
    if (this.USE_AVIF_IF_SUPPORTED) {
      this.avifPromise = new Promise((resolve) => {
        const image = new Image()
        image.onerror = resolve
        image.onload = () => {
          this.fallbackFormatWithoutTransparency = '.avif'
          resolve()
        }
        image.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
      }).catch(() => false)
    } else {
      return new Promise(resolve => {
        resolve()
      })
    }

    return this.avifPromise
  }

  load(url, id, options) {
    const isCompressed = options.indexOf('compressed') > -1
    const needsTransparence = options.indexOf('transparent') > -1
    const isTargetJPG = options.indexOf('jpg') > -1
    const isTargetPNG = options.indexOf('png') > -1
    const isTargetWEBP = options.indexOf('webp') > -1

    let lodsTarget = options.filter((element) => {
      if (element.indexOf('lodTarget') !== -1) {
        return true
      }
    })[0]
    lodsTarget = lodsTarget !== undefined ? lodsTarget.replace('lodTarget=', '') : ''
    const isLods = lodsTarget !== ''


    const imageFileName = url.replace(/^.*[\\\/]/, '')
    const pathRoot = url.replace(imageFileName, '')
    const basePath = `${pathRoot}${lodsTarget}/${imageFileName}`
    let imageUrl = url

    if (isLods) {
      // take .avif or .webp inside lodTarget
      imageUrl = `${basePath}${this.fallbackFormatWithoutTransparency}`
    }

    if (isCompressed && this.isCompressedSupport) {
      if (isLods) {
        imageUrl = `${basePath}.ktx2`
      } else {
        imageUrl = `${pathRoot}${imageFileName.replace(/\.[^/.]+$/, '')}.ktx2`
      }

      this.textures[id] = {
        options,
      }

      const promise = new Promise((resolve) => {
        fetch(imageUrl).then((test) => {
          test.arrayBuffer().then((buffer) => {
            this.basisManager.parseTexture(buffer).then((text) => {
              const texture = this.initCompressedTexture(text, options)

              this.textures[id].texture = texture
              this.textures[id].unit = this.currentUnit
              texture.update()
              this.currentUnit++
              resolve(texture)
            })
          })
        })
      })

      return promise
    } else {
      if (isTargetPNG || needsTransparence) {
        imageUrl = `${basePath}.png`
      }
      if (isTargetJPG) {
        imageUrl = `${basePath}.jpg`
      }
      if (isTargetWEBP && this.supportsWebp) {
        imageUrl = `${basePath}.webp`
      }

      // <iOS14: if the target is webp but webp is not supported, replace with .jpg
      if (!this.supportsWebp && imageUrl.includes('.webp')) {
        imageUrl = imageUrl.replace('.webp', '.jpg')
      }

      let image = new Image()
      image.crossOrigin = 'anonymous'
      const promise = new Promise((resolve) => {
        image.onload = () => {
          let texture = this.initTexture(image, options)
          this.textures[id].texture = texture
          this.textures[id].unit = this.currentUnit
          this.currentUnit++
          resolve(texture)
        }
      })
      image.src = imageUrl
      this.textures[id] = {
        img: image,
        options,
      }
      return promise
    }
  }

  initCompressedTexture(text, options) {
    const gl = this.gl
    const texture = new Texture(gl, {
      generateMipmaps: options.indexOf('mipmap') > -1,
      internalFormat: text.internalFormat,
    })
    texture.image = text

    texture.flipY = options.indexOf('flipY') > -1
    texture.wrapS = options.indexOf('mirror') > -1 ? gl.MIRRORED_REPEAT : gl.CLAMP_TO_EDGE
    texture.wrapT = options.indexOf('mirror') > -1 ? gl.MIRRORED_REPEAT : gl.CLAMP_TO_EDGE
    texture.wrapS = options.indexOf('repeat') > -1 ? gl.REPEAT : texture.wrapS
    texture.wrapT = options.indexOf('repeat') > -1 ? gl.REPEAT : texture.wrapT
    texture.wrapS = options.indexOf('clamp') > -1 ? gl.CLAMP_TO_EDGE : texture.wrapS
    texture.wrapT = options.indexOf('clamp') > -1 ? gl.CLAMP_TO_EDGE : texture.wrapT
    texture.minFilter = options.indexOf('nearest') > -1 ? gl.NEAREST : texture.minFilter
    texture.magFilter = options.indexOf('nearest') > -1 ? gl.NEAREST : texture.magFilter
    texture.needsUpdate = true

    return texture
  }

  initTexture(image, options) {
    const gl = this.gl
    const texture = new Texture(gl, {
      generateMipmaps: options.indexOf('mipmap') > -1,
      flipY: options.indexOf('flipY') > -1,
    })
    texture.image = image
    texture.flipY = options.indexOf('flipY') > -1
    texture.wrapS = options.indexOf('mirror') > -1 ? gl.MIRRORED_REPEAT : gl.CLAMP_TO_EDGE
    texture.wrapT = options.indexOf('mirror') > -1 ? gl.MIRRORED_REPEAT : gl.CLAMP_TO_EDGE
    texture.wrapS = options.indexOf('repeat') > -1 ? gl.REPEAT : texture.wrapS
    texture.wrapT = options.indexOf('repeat') > -1 ? gl.REPEAT : texture.wrapT
    texture.wrapS = options.indexOf('clamp') > -1 ? gl.CLAMP_TO_EDGE : texture.wrapS
    texture.wrapT = options.indexOf('clamp') > -1 ? gl.CLAMP_TO_EDGE : texture.wrapT
    texture.minFilter = options.indexOf('nearest') > -1 ? gl.NEAREST : texture.minFilter
    texture.magFilter = options.indexOf('nearest') > -1 ? gl.NEAREST : texture.magFilter

    return texture
  }

  get(id) {
    if (this.textures[id]) {
      return this.textures[id]
    }
  }

  getTexture(id) {
    if (this.textures[id]) {
      return this.textures[id].texture
    }
  }

  getImage(id) {
    if (this.textures[id]) {
      return this.textures[id].img
    }
    return null
  }

  isTextureRegistered(id) {
    if (this.textures[id]) {
      return true
    }
    return false
  }
}

export default TextureLoaderManager
