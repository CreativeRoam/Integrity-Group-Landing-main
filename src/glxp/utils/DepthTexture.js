class DepthTexture {
  constructor(scene, resolution = 512) {
    this.scene = scene
    this.resolution = resolution

    this.createTexture()
  }

  createTexture() {
    let gl = this.scene.gl

    this.framebuffer = gl.createFramebuffer()
    this.texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, this.resolution, this.resolution, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null)

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.texture, 0)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  bind() {
    let gl = this.scene.gl
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
  }

  bindFrameBuffer() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
  }

  unBindFrameBuffer() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  update(target) {
    let gl = this.scene.gl

    gl.viewport(0, 0, this.resolution, this.resolution)
    // gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.texture, 0)
    // gl.bindTexture(gl.TEXTURE_2D, null)
    gl.viewport(0, 0, this.scene.width, this.scene.height)
  }
}

export default DepthTexture
