import { mat3, mat4, quat, vec3 } from 'gl-matrix'

const MAT3 = mat3.create(),
  VX = new Float32Array(MAT3.buffer, 0 * 4, 3),
  VY = new Float32Array(MAT3.buffer, 3 * 4, 3),
  VZ = new Float32Array(MAT3.buffer, 6 * 4, 3),
  VUP = vec3.fromValues(0, 1, 0)
const QUAT = quat.create()
const VEC3 = vec3.create()
import RAF from '@/glxp/utils/RAF'

class Node {
  constructor(isCamera = false) {
    this.parent = null
    this.children = []

    this.position = vec3.fromValues(0, 0, 0)
    this.positionDamped = vec3.fromValues(0, 0, 0)
    this.scale = vec3.fromValues(1, 1, 1)
    this.rotation = vec3.fromValues(0, 0, 0)
    this.rotationDamped = vec3.fromValues(0, 0, 0)
    this.quaternion = quat.create()
    this.matrix = mat4.create()
    this.lmatrix = mat4.create()

    this.damped = false
    this.dampedRot = false
    this.damping = 0.03
    this.rotDamping = 0.03

    this.lookAtNode = null

    this.needUpdate = true
    this.forceUpdate = false
    this.manualRot = false
    this.isCamera = isCamera

    RAF.nextFrame(() => {
      this.getMatrix()
    })

    return this
  }

  setPosition(x, y, z) {
    this.needUpdate = true
    this.position[0] = x
    this.position[1] = y
    this.position[2] = z
  }

  setRotation(x, y, z) {
    this.needUpdate = true
    this.rotation[0] = x
    this.rotation[1] = y
    this.rotation[2] = z
  }

  setScale(s) {
    this.needUpdate = true
    this.scale[0] = s
    this.scale[1] = s
    this.scale[2] = s
  }

  activateDamping(damping) {
    this.positionDamped = vec3.clone(this.position)
    this.damped = true
    this.damping = damping
    this.needUpdate = true
    this.getMatrix()
  }

  registerNodeToLookAt(node) {
    this.lookAtNode = node
    this.needUpdate = true
  }

  lookAt(tgt) {
    if (this.damped) {
      vec3.subtract(VZ, this.positionDamped, tgt)
    } else {
      vec3.subtract(VZ, this.position, tgt)
    }
    vec3.normalize(VZ, VZ)
    vec3.cross(VX, VUP, VZ)
    vec3.normalize(VX, VX)
    vec3.cross(VY, VZ, VX)
    quat.fromMat3(QUAT, MAT3)

    if (this.damped) {
      mat4.fromRotationTranslationScale(this.matrix, QUAT, this.positionDamped, this.scale)
    } else {
      mat4.fromRotationTranslationScale(this.matrix, QUAT, this.position, this.scale)
    }

    if (this.parent !== null) {
      mat4.mul(this.matrix, this.parent.getMatrix(), this.matrix)
    }
    this.needUpdate = false
  }

  getMatrix() {
    if (!this.forceUpdate && !this.needUpdate && !this.damped && this.lookAtNode == null) {
      return this.matrix
    }
    mat4.identity(this.matrix)

    if (this.manualRot == false) {
      this.quaternion = quat.create()
      if (this.dampedRot) {
        vec3.sub(VEC3, this.rotation, this.rotationDamped)
        vec3.scale(VEC3, VEC3, this.rotDamping)
        vec3.add(this.rotationDamped, this.rotationDamped, VEC3)
        // C4D style
        quat.rotateY(this.quaternion, this.quaternion, this.rotationDamped[1])
        quat.rotateX(this.quaternion, this.quaternion, this.rotationDamped[0])
        quat.rotateZ(this.quaternion, this.quaternion, this.rotationDamped[2])
      } else {
        quat.rotateY(this.quaternion, this.quaternion, this.rotation[1])
        quat.rotateX(this.quaternion, this.quaternion, this.rotation[0])
        quat.rotateZ(this.quaternion, this.quaternion, this.rotation[2])
      }
    }

    if (this.damped) {
      vec3.sub(VEC3, this.position, this.positionDamped)
      vec3.scale(VEC3, VEC3, this.damping)
      vec3.add(this.positionDamped, this.positionDamped, VEC3)

      mat4.fromRotationTranslationScale(this.matrix, this.quaternion, this.positionDamped, this.scale)
    } else {
      mat4.fromRotationTranslationScale(this.matrix, this.quaternion, this.position, this.scale)
    }

    if (this.parent !== null) {
      mat4.mul(this.matrix, this.parent.getMatrix(), this.matrix)
    }

    if (this.lookAtNode !== null) {
      this.lookAtNode.getMatrix()
      if (this.lookAtNode.damped) {
        this.lookAt(this.lookAtNode.positionDamped)
      } else {
        this.lookAt(this.lookAtNode.position)
      }
      RAF.postFrame(() => {
        this.needUpdate = true
      })
    }
    this.needUpdate = false

    return this.matrix
  }

  getChildByName(n) {
    for (let i = 0; i < this.children.length; i++) {
      const element = this.children[i]
      if (element.name && element.name === n) {
        return element
      }
    }
  }

  addChildNode(node) {
    this.children.push(node)
    node.parent = this
  }

  fromPositionRotationScale(p, r, s) {
    this.position = vec3.clone(p)
    this.scale = vec3.clone(s)
    this.rotation = vec3.clone(r)
    return this
  }
}

export default Node
