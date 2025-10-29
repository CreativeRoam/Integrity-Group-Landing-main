class SimpleNoise1D {
  constructor() {
    this.MAX_VERTICES = 256
    this.MAX_VERTICES_MASK = this.MAX_VERTICES - 1
    this.amplitude = 1
    this.scale = 1
    this.r = []

    for (var i = 0; i < this.MAX_VERTICES; ++i) {
      this.r.push(Math.random())
    }
  }

  getVal(x) {
    var scaledX = x * this.scale
    var xFloor = Math.floor(scaledX)
    var t = scaledX - xFloor
    var tRemapSmoothstep = t * t * (3 - 2 * t)

    var xMin = xFloor % this.MAX_VERTICES_MASK
    var xMax = (xMin + 1) % this.MAX_VERTICES_MASK

    var y = this.lerp(this.r[xMin], this.r[xMax], tRemapSmoothstep)

    return y * this.amplitude
  }

  lerp(a, b, t) {
    return a * (1 - t) + b * t
  }
}

export default SimpleNoise1D
