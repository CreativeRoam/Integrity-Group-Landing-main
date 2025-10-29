import { vec3 } from 'gl-matrix'
import Node from '@/glxp/abstract/node'

import { map, clamp } from '@/glxp/utils/math'

class CatmullCurve {
  constructor(points) {
    this.points = Array.from(points)

    this.points.unshift(this.points[0])
    this.points.push(this.points[this.points.length - 1])

    this.params = []
    this.totalLength = 0

    this.node = new Node()
  }

  applyNodeMatrix() {
    let MMatrix = this.node.getMatrix()
    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = vec3.transformMat4(this.points[i], this.points[i], MMatrix)
    }
  }

  generate() {
    this.applyNodeMatrix()
    let points = this.points
    for (let i = 0; i + 3 < points.length; i++) {
      this.params.push({
        p1: points[i + 0],
        p2: points[i + 1],
        p3: points[i + 2],
        p4: points[i + 3],
        dt: vec3.distance(points[i + 1], points[i + 2]),
      })
    }
    for (let i = 0; i < this.params.length; i++) {
      this.totalLength += this.params[i].dt
    }
  }

  getPointsUniform(pointsCount) {
    const pointBySection = Math.ceil(pointsCount / this.params.length)
    const pointsData = []
    for (let i = 0; i < this.params.length; i++) {
      const param = this.params[i]
      for (let j = 0; j < pointBySection; j++) {
        let point = this.catmullRom(this.params[i].p1, this.params[i].p2, this.params[i].p3, this.params[i].p4, j / pointBySection)
        pointsData.push(point[0])
        pointsData.push(point[1])
        pointsData.push(point[2])
      }
    }
    return pointsData
  }

  // Get point based on time and catmull length
  getPointLinearMotion(time) {
    time = Math.min(Math.max(time, 0.0000001), 1)
    let t = time * this.totalLength
    let maxTbS = 0
    let prevTbS = 0
    let sectionId = 0
    for (let i = 0; i < this.params.length; i++) {
      if (maxTbS < t) {
        prevTbS = maxTbS
        maxTbS += this.params[i].dt
        sectionId = i
      } else {
        continue
      }
    }
    let adv = (t - prevTbS) / (maxTbS - prevTbS)

    return this.catmullRom(this.params[sectionId].p1, this.params[sectionId].p2, this.params[sectionId].p3, this.params[sectionId].p4, adv)
  }

  // Get point based on overall progress, can handle loops with progress > 1
  getPointProgress(progress) {
    const cleanProgress = progress > 1 ? progress % 1 : progress
    const progressIndex = map(cleanProgress, 0, 1, 0, this.params.length)
    let pointIndex = progressIndex < 0.01 ? 0 : parseInt(progressIndex)
    pointIndex = clamp(pointIndex, 0, this.params.length - 1)
    const betweenRatio = progressIndex - pointIndex

    return this.catmullRom(this.params[pointIndex].p1, this.params[pointIndex].p2, this.params[pointIndex].p3, this.params[pointIndex].p4, betweenRatio)
  }

  catmullRom(p1, p2, p3, p4, t) {
    return vec3.fromValues(this.calc(p1[0], p2[0], p3[0], p4[0], t), this.calc(p1[1], p2[1], p3[1], p4[1], t), this.calc(p1[2], p2[2], p3[2], p4[2], t))
  }

  calc(w, x, y, z, t) {
    return (((-w + 3 * x - 3 * y + z) * t + (2 * w - 5 * x + 4 * y - z)) * t + y - w) * 0.5 * t + x
  }
}
export default CatmullCurve
