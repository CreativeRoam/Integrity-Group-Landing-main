import { mat4 } from 'gl-matrix'

class Skin {
  constructor(mesh, skinData, rootnodeName) {
    this.mesh = mesh
    this.bonesNumb = skinData.joints.length

    this.skinData = skinData
    this.rootnodeName = rootnodeName

    this.allocateData()
    this.initNodes()
    this.getBindPose()
    this.computeAttributeData()
  }

  initNodes() {
    for (let i = 0; i < this.skinData.joints.length; i++) {
      const joint = this.skinData.joints[i]
      for (let j = 0; j < this.mesh.nodes.length; j++) {
        const element = this.mesh.nodes[j]
        if (element.sid !== undefined && element.sid == joint.sid) {
          joint.node = element
          element.joint = joint
          this.bonesNode.push(element)
        }
      }
    }

    let rootNode
    for (let i = 0; i < this.mesh.nodes.length; i++) {
      if (this.mesh.nodes[i].name == this.rootnodeName) {
        rootNode = this.mesh.nodes[i]
      }
    }
    // for (let i = 0; i < this.bonesNode.length; i++) {
    //     if (this.bonesNode[i].name == this.rootnodeName) {
    //         rootNode = this.bonesNode[i]
    //     }
    // }
    this.mesh.transform.addChild(rootNode)
    this.rootNode = rootNode

    for (let i = 0; i < this.bonesNode.length; i++) {
      this.bonesNode[i].updateMatrixWorld(true)
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

  computeAttributeData() {
    let stacks = this.skinData.attribStackNum
    this.attribData = {}

    for (let i = 0; i < stacks; i++) {
      let weightData = this.skinData['weight_' + i]
      let ndxData = this.skinData['ndx_' + i]
      let refactorWeight = []
      let refactorNdx = []
      for (let j = 0; j < this.mesh.geomData.vertexIndex.length; j++) {
        const weightIdx = this.mesh.geomData.vertexIndex[j]
        refactorWeight.push(weightData[weightIdx * 4 + 0])
        refactorWeight.push(weightData[weightIdx * 4 + 1])
        refactorWeight.push(weightData[weightIdx * 4 + 2])
        refactorWeight.push(weightData[weightIdx * 4 + 3])
        refactorNdx.push(ndxData[weightIdx * 4 + 0])
        refactorNdx.push(ndxData[weightIdx * 4 + 1])
        refactorNdx.push(ndxData[weightIdx * 4 + 2])
        refactorNdx.push(ndxData[weightIdx * 4 + 3])
      }
      this.attribData['weight_' + i] = new Float32Array(refactorWeight)
      this.attribData['ndx_' + i] = new Float32Array(refactorNdx)
    }
  }

  // Specific kinda
  getBindPose() {
    for (let i = 0; i < this.bonesNode.length; i++) {
      let tmp = mat4.create()
      mat4.transpose(tmp, this.bonesNode[i].joint.invBindMatrrix)
      mat4.invert(tmp, tmp)
      mat4.copy(this.bindPose[i], tmp)
    }

    for (let i = 0; i < this.bindPose.length; i++) {
      mat4.invert(this.bindPoseInv[i], this.bindPose[i])
    }
  }

  update() {
    for (let i = 0; i < this.bonesNode.length; i++) {
      const b = this.bonesNode[i]
      let animatedBone = null
      for (let j = 0; j < this.mesh.scene.animatorBones.length; j++) {
        const element = this.mesh.scene.animatorBones[j]
        if (this.mesh.scene.animatorBones[j].name == b.name) {
          animatedBone = this.mesh.scene.animatorBones[j]
        }
      }
      // if (animatedBone !== null && animatedBone.readyToUse) {
      //     mat4.copy(this.boneMatrices[i], animatedBone.worldMatrix)
      //     mat4.multiply(this.boneMatrices[i], this.boneMatrices[i], this.bindPoseInv[i])
      // } else {
      // }
      b.updateMatrix()
      b.updateMatrixWorld(true)
      mat4.copy(this.boneMatrices[i], b.worldMatrix)
      mat4.multiply(this.boneMatrices[i], this.boneMatrices[i], this.bindPoseInv[i])
    }
    // this.rootNode.updateMatrix()
    // this.rootNode.updateMatrixWorld(true)
  }
}

export default Skin
