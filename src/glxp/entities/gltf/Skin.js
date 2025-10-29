import { mat4, vec3, quat } from 'gl-matrix'
import Node from '@/glxp/abstract/node'
import { Transform } from '@/glxp/ogl/core/Transform.js'

const _MAT4 = mat4.create()
const _QUAT = quat.create()

class Skin {
  constructor(mesh, skinData, rootNode) {
    this.mesh = mesh
    this.bonesNumb = skinData.joints.length

    this.skinData = skinData
    this.rootNode = rootNode
    this.rootnodeName = rootNode.name

    this.allocateData()
    this.initNodes()
    this.getBindPose()
  }

  initNodes() {
    let matrixData

    if (this.mesh.gltf.isDracoCompressed) {
      matrixData = this.skinData.inverseBindMatrices.value
    } else {
      const accessorInvBindPose = this.mesh.gltf.accessors[this.skinData.inverseBindMatrices]
      const bufferView = this.mesh.gltf.bufferViews[accessorInvBindPose.bufferView]
      const arrayBuffer = this.mesh.gltf.bin
      let byteStride = null
      if (bufferView && bufferView.byteStride) byteStride = bufferView.byteStride
      let byteOffset = bufferView.byteOffset ? bufferView.byteOffset : 0
      const start = byteOffset
      const end = start + bufferView.byteLength
      const slicedBuffer = arrayBuffer.slice(start, end)
      matrixData = new Float32Array(slicedBuffer)
    }

    // Get inverse bind matrix data
    // Todo get accessor data from Draco GLTF
    for (let i = 0; i < this.mesh.joints.length; i++) {
      const joint = this.mesh.joints[i]
      const invBindMatrix = matrixData.slice(joint.jointId * 16, joint.jointId * 16 + 16)
      joint.invBindMatrix = invBindMatrix
      this.bonesNode.push(joint)
    }

    this.mesh.transform.addChild(this.rootNode)

    for (let i = 0; i < this.bonesNode.length; i++) {
      this.bonesNode[i].updateMatrixWorld(true)
      this.bonesNode[i].updateMatrix(true)
    }
  }

  allocateData() {
    this.boneArray          = new Float32Array(this.bonesNumb * 16)
    this.boneMatrices       = []  // the uniform data
    this.bindPose           = []  // the bind matrix        
    this.bindPoseInv        = []  
    this.bonesNode          = []

    for (var i = 0; i < this.bonesNumb; ++i) {
      this.boneMatrices.push(new Float32Array(this.boneArray.buffer, i * 4 * 16, 16))
      this.bindPose.push(mat4.create()) // just allocate storage
      this.bindPoseInv.push(mat4.create()) // just allocate storage
    }
  }

  // Specific kinda
  getBindPose() {
    for (let i = 0; i < this.bonesNode.length; i++) {
      mat4.copy(this.bindPoseInv[i], this.bonesNode[i].invBindMatrix)
    }
  }

  update() {
    this.rootNode.updateMatrix()
    this.rootNode.updateMatrixWorld(true)
    for (let i = 0; i < this.bonesNode.length; i++) {
      const b = this.bonesNode[i]
      b.updateMatrix()
      b.updateMatrixWorld(true)
      mat4.copy(this.boneMatrices[i], b.worldMatrix)
      mat4.multiply(this.boneMatrices[i], this.boneMatrices[i], this.bindPoseInv[i])
    }
  }
}

export default Skin
