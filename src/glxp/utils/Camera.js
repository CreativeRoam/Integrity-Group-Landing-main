import { mat4, quat } from 'gl-matrix'
import Node from '@/glxp/abstract/node'

class Camera {
  constructor(scene, fov) {
    this.scene = scene
    this.gl = scene.gl
    this.fov = fov
    this.pMatrix = mat4.create()
    this.node = new Node(true)
    this.position = this.node.position
    this.rotation = this.node.rotation
  }

  getProjectionMatrix() {
    return this.pMatrix
  }

  getViewMatrix() {
    let nodeMatrix = mat4.clone(this.node.getMatrix())
    mat4.invert(nodeMatrix, nodeMatrix)
    return nodeMatrix
  }

  updateProjection(ratio) {
    mat4.perspective(this.pMatrix, (this.fov * Math.PI) / 180, ratio, 0.1, 10000.0)
  }
}

export default Camera
