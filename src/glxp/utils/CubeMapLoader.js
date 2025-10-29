import when from 'when'

class CubeMapLoader {
  constructor(scene) {
    this.scene = scene
    this.gl = scene.gl
    this.textures = {}
    this.currentUnit = 0
  }

  load(img, id) {
    const gl = this.scene.gl

    var faces = [
      [img.url + '_right' + img.ext, gl.TEXTURE_CUBE_MAP_POSITIVE_X],
      [img.url + '_left' + img.ext, gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
      [img.url + '_top' + img.ext, gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
      [img.url + '_bottom' + img.ext, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
      [img.url + '_front' + img.ext, gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
      [img.url + '_back' + img.ext, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z],
    ]

    let promises = []
    this.textures[id] = {
      imgs: [],
      texture: null,
      defer: when.defer(),
    }

    for (let i = 0; i < faces.length; i++) {
      let face = faces[i][1]
      let image = new Image()
      let defer = new when.defer()
      image.crossOrigin = 'anonymous'
      promises.push(defer.promise)
      image.onload = () => {
        this.textures[id].imgs.push({
          image,
          face,
        })
        defer.resolve()
      }
      image.src = faces[i][0]
    }

    when.all(promises).then(() => {
      this.initTexture(this.textures[id], id)
    })

    return this.textures[id].defer.promise
  }

  initTexture(tex, id) {
    let gl = this.gl

    // create
    tex.texture = gl.createTexture()
    tex.texture.id = id

    const texture = tex.texture
    const imgs = tex.imgs

    // bind it to operate on it
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)

    let wrap = gl.CLAMP_TO_EDGE

    // Set the filter wrapping and filter parameters.
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, wrap)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, wrap)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i]
      gl.texImage2D(img.face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img.image)
    }

    tex.defer.resolve()
  }

  getTexture(id) {
    if (this.textures[id].texture) {
      return this.textures[id].texture
    }
  }

  getImage(id) {
    if (this.textures[id].texture) {
      return this.textures[id].img
    }
    return null
  }
}

export default CubeMapLoader
