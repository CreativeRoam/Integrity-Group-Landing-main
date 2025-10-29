import PostProcessRT from '@/glxp/postProcess/PostProcessRT'
import { Texture } from '@/glxp/ogl/core/Texture.js'

class FloorRT {
  constructor(scene, {} = {}) {
    this.gl = scene.gl
    this.scene = scene

    this.rt = new PostProcessRT(this.scene, 0.25, 'rgb', null, true)

    this.texture = new Texture(this.gl, {
      rt: this.rt,
      width: this.rt.width,
      height: this.rt.height,
    })
  }

  preRender() {
    this.rt.preRender()
  }

  postRender() {
    this.rt.postRender()
  }
}

export default FloorRT
