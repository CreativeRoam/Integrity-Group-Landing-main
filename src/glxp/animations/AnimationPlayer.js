import Emitter from 'event-emitter'

class AnimationPlayer {
    constructor(scene, node, name, animation, {
        timeScale = 1,
        playing = true,
        loop = true,
        autoUpdate = false,
        optimised = false,
        time = 0,
    } = {}) {
    this.scene = scene
    this.node = node
    this.name = name
    this.animation = animation
    this.autoUpdate = autoUpdate
    this.timeScale = timeScale
    this.playing = playing
    this.optimised = optimised
    this.loop = loop
    this.time = time
    this.notEnoughFrames = false
    this.tracks = {}
    this.tracksId = []
    this.lastOut = null

    this._emitter = {}
    Emitter(this._emitter)
    this.on = this._emitter.on.bind(this._emitter)

    this.init()
  }

  bezier(t, p0, p1, p2, p3) {
    var cX = 3 * (p1.x - p0.x),
      bX = 3 * (p2.x - p1.x) - cX,
      aX = p3.x - p0.x - cX - bX

    var cY = 3 * (p1.y - p0.y),
      bY = 3 * (p2.y - p1.y) - cY,
      aY = p3.y - p0.y - cY - bY

    var x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x
    var y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y

    return { x: x, y: y }
  }

  reset() {
    this.time = 0
  }

  init() {
    const tracks = {}
    let maxTime = 0
    if (this.animation.frameLength < 3) {
      this.notEnoughFrames = true
      for (let si = 0; si < this.animation.stride; si++) {
        tracks[this.animation.components[si]] = []
        this.tracksId.push(this.animation.components[si])
        let output = this.animation.source[0]
        let keyTime = this.animation.keyTime[0]
        let tangentInX = this.animation.inTangent[0 * 2 + 0]
        let tangentInY = this.animation.inTangent[0 * 2 + 1]
        let tangentOutX = this.animation.outTangent[0 * 2 + 0]
        let tangentOutY = this.animation.outTangent[0 * 2 + 1]
        tracks[this.animation.components[si]].push({
          time: keyTime,
          coords: { x: keyTime, y: output },
          tangentIn: { x: tangentInX, y: tangentInY },
          tangentOut: { x: tangentOutX, y: tangentOutY },
        })
      }
    }
    for (let si = 0; si < this.animation.stride; si++) {
      tracks[this.animation.components[si]] = []
      this.tracksId.push(this.animation.components[si])
      for (let f = 0; f < this.animation.frameLength; f++) {
        let output = this.animation.source[f * this.animation.stride + si]
        let keyTime = this.animation.keyTime[f * this.animation.stride + si]
        let tangentInX = this.animation.inTangent[(f * this.animation.stride + si) * 2 + 0]
        let tangentInY = this.animation.inTangent[(f * this.animation.stride + si) * 2 + 1]
        let tangentOutX = this.animation.outTangent[(f * this.animation.stride + si) * 2 + 0]
        let tangentOutY = this.animation.outTangent[(f * this.animation.stride + si) * 2 + 1]
        tracks[this.animation.components[si]].push({
          time: keyTime,
          coords: { x: keyTime, y: output },
          tangentIn: { x: tangentInX, y: tangentInY },
          tangentOut: { x: tangentOutX, y: tangentOutY },
        })
        if (maxTime < keyTime) {
          maxTime = keyTime
        }
      }
    }

    this.tracks = tracks
    this.maxTime = maxTime

    this.scene.animationPlayer?.push(this)
  }

  invalidate() {
    this.lastOut = null
  }

  update(time = null, direction = 1) {
    if (this.optimised && this.lastOut !== null) {
      return this.lastOut
    }

    if (this.notEnoughFrames) {
      this.time = 0
      let out = {}
      for (let i = 0; i < this.tracksId.length; i++) {
        const tId = this.tracksId[i]
        const track = this.tracks[tId]
        if (this.name == 'translate' || this.name == 'scale') {
          out[tId] = track[0].coords.y
        } else if (this.name == 'rotateX' || this.name == 'rotateY' || this.name == 'rotateZ') {
          out = (track[0].coords.y * Math.PI) / 180
        }
        return out
      }
    }

    if (this.autoUpdate) {
      if (direction == 1) {
        this.time = (this.scene.time * this.timeScale) % this.maxTime
      } else {
        this.time = this.maxTime - ((this.scene.time * this.timeScale) % this.maxTime)
      }
    } else if (time == null) {
      this.time += (this.scene.dt / 1000) * this.timeScale
      // console.log(this.scene.dt);
      if (this.loop) {
        this.time = this.time % this.maxTime
      } else {
        this.time = Math.min(this.time, this.maxTime - 0.0001)
      }
    } else {
      this.time = time * this.maxTime
    }

    // this.time = 0

    let out = {}
    for (let i = 0; i < this.tracksId.length; i++) {
      let pointIn
      let pointOut
      const tId = this.tracksId[i]
      const track = this.tracks[tId]
      for (let i = 0; i < track.length; i++) {
        if (track[i].time <= this.time) {
          pointIn = track[i]
        }
      }
      for (let i = track.length - 1; i >= 0; i--) {
        if (track[i].time > this.time) {
          pointOut = track[i]
        }
      }

      if (pointOut == undefined || pointIn == undefined) {
        continue
      }

      let t = (this.time - pointIn.time) / (pointOut.time - pointIn.time)
      let v = this.bezier(t, pointIn.coords, pointIn.tangentIn, pointOut.tangentOut, pointOut.coords)

      if (this.node) {
        if (this.name == 'translate') {
          this.node.mesh.position[tId] = v.y
        } else if (this.name == 'scale') {
          this.node.mesh.scale[tId] = v.y
        } else if (this.name == 'rotateX') {
          this.node.mesh.rotation.x = (v.y * Math.PI) / 180
        } else if (this.name == 'rotateY') {
          this.node.mesh.rotation.y = (v.y * Math.PI) / 180
        } else if (this.name == 'rotateZ') {
          this.node.mesh.rotation.z = (v.y * Math.PI) / 180
        }
      } else {
        if (this.name == 'translate' || this.name == 'scale') {
          out[tId] = v.y
        } else if (this.name == 'rotateX' || this.name == 'rotateY' || this.name == 'rotateZ') {
          out = (v.y * Math.PI) / 180
        }
      }
    }

    this.lastOut = out
    return out
  }
}

export default AnimationPlayer
