import Manifest from '@/glxp/manifest'

class FontLoader {
  constructor(scene) {
    this.scene = scene
    this.gl = this.scene.gl
    this.fonts = {}
  }

  async load(id) {
    await this.scene.textureLoader.load(Manifest['fonts'][id]['sdf'].url, `${id}-sdf`, Manifest['fonts'][id]['sdf'].options)
    const font = await (await fetch(Manifest['fonts'][id]['spritesheet'].url)).json()
    this.fonts[id] = {
      font,
      texture: this.scene.textureLoader.getTexture(`${id}-sdf`),
    }
  }

  getFont(id) {
    if (this.fonts[id]) {
      return this.fonts[id]
    }
  }
}

export default FontLoader
