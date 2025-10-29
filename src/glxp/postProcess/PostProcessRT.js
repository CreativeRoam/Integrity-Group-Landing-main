import { isDesktop } from '@/glxp/utils/device'
// import debounce from '@/glxp/utils/debounce'

class FBO {
  constructor(scene, pixelRatio = 1, format = 'rgb', size = null, depth = false, filter = 'linear', transparent = false, data = null) {
    this.scene = scene
    this.gl = scene.gl
    this.pixelRatio = pixelRatio
    this.format = format
    this.size = size
    this.depth = depth
    this.filter = filter
    this.transparent = transparent
    this.depthTexture = null
    this.previousFrameBuffer = null
    this.preventResize = false
    this.data = data

    if (size === null) {
      this.width = this.scene.width * this.pixelRatio
      this.height = this.scene.height * this.pixelRatio
    } else {
      this.width = size
      this.height = size
    }

    this.createTexture()
    if (depth) {
      this.createDepthTexture()
    }
    this.createFB()

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)

    // Now listening to WebGLManager resize
    // TODO: Debounce/Throttle the WebGLManager resize?
    this.scene.manager.on('resize', this.onResize.bind(this))
    setTimeout(() => {
      this.onResize()
    }, 1000)
    // this.debouncedResize = debounce(this.onResize.bind(this), 30)
    // window.addEventListener('resize', this.debouncedResize)

    // this.scene.passes.push(this)
  }

  createTexture() {
    let gl = this.gl

    this.targetTexture = this.gl.createTexture()

    gl.bindTexture(gl.TEXTURE_2D, this.targetTexture)

    let level = 0
    let internalFormat = gl.RGBA
    let border = 0
    let format = gl.RGBA
    let type = gl.UNSIGNED_BYTE
    if (this.format === 'float') {
      // console.log(gl.FLOAT)
      type = isDesktop ? gl.FLOAT : gl.HALF_FLOAT || gl.renderer.extensions['OES_texture_half_float'].HALF_FLOAT_OES
      internalFormat = gl.renderer.isWebgl2 ? (type === gl.FLOAT ? gl.RGBA32F : gl.RGBA16F) : gl.RGBA
    }
    let data = this.data

    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, this.width, this.height, border, format, type, data)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    if (this.filter == 'nearest') {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    }

    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  createDepthTexture() {
    let gl = this.scene.gl

    this.depthTexture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.renderer.isWebgl2 ? gl.DEPTH_COMPONENT24 : gl.DEPTH_COMPONENT, this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  onResize() {
    if (this.preventResize) {
      return
    }
    let gl = this.gl
    if (this.size === null) {
      this.width = this.scene.width * this.pixelRatio
      this.height = this.scene.height * this.pixelRatio
    } else {
      this.width = this.size
      this.height = this.size
    }
    gl.deleteTexture(this.targetTexture)
    if (this.depth) {
      gl.deleteTexture(this.depthTexture)
    }
    gl.deleteFramebuffer(this.fb)
    this.createTexture()
    if (this.depth) {
      this.createDepthTexture()
    }
    this.createFB()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  createFB() {
    let gl = this.gl
    this.fb = gl.createFramebuffer()
    this.fb.width = this.width
    this.fb.height = this.height
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb)

    const level = 0
    const attachmentPoint = gl.COLOR_ATTACHMENT0
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.targetTexture, level)

    // create a depth renderbuffer
    const depthBuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer)

    // make a depth buffer and the same size as the targetTexture
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer)
    if (this.depth) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0)
    }
  }

  clear() {
    let gl = this.gl
    if (this.transparent) {
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    } else {
      gl.clearColor(this.scene.clearColor[0], this.scene.clearColor[1], this.scene.clearColor[2], this.scene.clearColor[3])
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }
  }

  preRender() {
    let gl = this.gl
    this.previousFrameBuffer = this.scene.activeFrameBuffer !== undefined ? this.scene.activeFrameBuffer : null
    this.scene.activeFrameBuffer = this.fb
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene.activeFrameBuffer)
    gl.viewport(0, 0, this.width, this.height)
    this.clear()
  }

  postRender() {
    let gl = this.gl
    this.scene.activeFrameBuffer = this.previousFrameBuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene.activeFrameBuffer)
    gl.viewport(0, 0, this.scene.width, this.scene.height)
  }

  bind() {
    let gl = this.gl
    gl.bindTexture(gl.TEXTURE_2D, this.targetTexture)
  }

  bindDepth() {
    let gl = this.gl
    if (this.depth) {
      gl.bindTexture(gl.TEXTURE_2D, this.depthTexture)
    }
  }

  getTexture() {
    return this.targetTexture
  }

  getDepthTexture() {
    return this.depthTexture
  }
}

export default FBO
