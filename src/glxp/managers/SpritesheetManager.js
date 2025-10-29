import TextureMerger from '@/glxp/utils/TextureMerger'
import { Texture } from '@/glxp/ogl/core/Texture.js'

class SpritesheetManager {
  canvas = null
  spritesheet = null
  ranges = null
  framerate = 30

  constructor(scene) {
    this.scene = scene
    this.gl = scene.gl
  }

  fetchSpritesheetData(urlRoot = `/glxp/spritesheets/example-${this.framerate}fps/`, textureID = 'example_spritesheet') {
    return new Promise((resolve) => {
      const promises = [this.scene.textureLoader.load(urlRoot + `spritesheet.png`, textureID, ['compressed', 'lodTarget=1024']), fetch(urlRoot + 'spritesheet_ranges.json')]

      Promise.all(promises).then(async ([texture, response]) => {
        const ranges = await response.json() // Get JSON value from the response body
        resolve([texture, ranges])
      })
    })
  }

  buildTestSpritesheet(callback, size = 2048) {
    const texturePromises = new Array(this.framerate).fill().map((_, index) =>
      this.scene.textureLoader.load(
        `/glxp/sprites/example-${this.framerate}fps/000${("0" + index).slice(-2)}.jpg`, 
        `example_sprites_${index}`, 
        [""]
      )
    )

    Promise.all(texturePromises).then((textures) => {
      // Warning: blocks main thread
      const { ranges, canvas } = new TextureMerger(textures, size)

      this.canvas = canvas
      this.spritesheet = new Texture(this.gl, { image: canvas })
      this.ranges = ranges

      callback(this.spritesheet, this.ranges)
    })
  }

  downloadSpritesheet(format = 'image/png', spritesheetName = 'spritesheet.png', rangesName = 'spritesheet_ranges.json') {
    const spritesheetDataURL = this.canvas.toDataURL(format)
    const spritesheetAnchorEl = document.createElement('a')
    spritesheetAnchorEl.href = spritesheetDataURL
    spritesheetAnchorEl.download = spritesheetName
    document.body.appendChild(spritesheetAnchorEl)
    spritesheetAnchorEl.click()
    document.body.removeChild(spritesheetAnchorEl)

    const rangesDataURL = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.ranges))
    const rangesAnchorEl = document.createElement('a')
    rangesAnchorEl.href = rangesDataURL
    rangesAnchorEl.download = rangesName
    document.body.appendChild(rangesAnchorEl)
    rangesAnchorEl.click()
    document.body.removeChild(rangesAnchorEl)
  }
}

export default SpritesheetManager
