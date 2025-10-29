import { vec3, quat } from 'gl-matrix'
import Node from '@/glxp/abstract/node'

const _QUAT1 = quat.create()
const _QUAT2 = quat.create()

const FPS = 60
const TIME_SCALE = 2

class Animator {
  constructor(scene, nodeTree, rootNode, mesh) {
    this.scene              = scene
    this.nodeTree           = nodeTree
    this.rootNode           = rootNode
    this.mesh               = mesh
    this.animations         = {}

    this.clock              = setTimeout(() => {}, 0)

    this.currentAnim        = null
    this.pendingAnim        = null
    this.animationBlending  = 0
    this.blendDamping       = 0.25

    this.positionOffset     = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0}
    this.states             = {}

    this.initTree()
  }

  setAnim(anim) {
    this.currentAnim = anim
    this.states[anim].progressTarget = 1
    this.states[anim].progress = 1
  }

  onLoaded() {
    for (const key in this.animations) {
      if (this.animations.hasOwnProperty(key)) {
        this.states[key] = {
          progress: 0,
          progressTarget: 0,
          direction: 1,
          active: false,
        }
        for (let i = 0; i < this.animations[key].length; i++) {
          const anim = this.animations[key][i]
          anim.time = 0
          anim.frame = 0
          anim.direction = 1
          anim.node = new Node()
          anim.node.name = anim.target

          let tmpMaxFrame = 0
          for (const key in anim.animations) {
            if (anim.animations.hasOwnProperty(key)) {
              const element = anim.animations[key]
              if (element.frameLength > tmpMaxFrame) {
                tmpMaxFrame = element.frameLength
              }
            }
          }
          anim.frameLength = tmpMaxFrame
        }
      }
    }
  }

  initTree() {
    this.nodesDictionary = {}
    for (let i = 0; i < this.nodeTree.length; i++) {
      this.nodeTree[i].initialPos = vec3.clone(this.nodeTree[i].position)
      this.nodeTree[i].initialRot = vec3.clone(this.nodeTree[i].rotation)
      this.nodeTree[i].forceUpdate = true
      this.nodesDictionary[this.nodeTree[i].name] = this.nodeTree[i]
      this.nodeTree[i].manualRot = true
    }
    this.rootNode.forceUpdate = true
  }

  getNode(name) {
    for (let i = 0; i < this.nodeTree.length; i++) {
      if (this.nodeTree[i].name == name) {
        return this.nodeTree[i]
      }
    }
  }

  updateAnimationTrack(id, reset = null) {
    for (let i = 0; i < this.animations[id].length; i++) {
      const anim = this.animations[id][i]
      anim.direction = this.states[id].direction
      if (anim.hasPlayer) {
        if (reset !== null) {
          anim.time = 0
          anim.frame = 0
        }
      } else {
        if (anim.frameLength > 2) {
          if (reset !== null) {
            anim.time = 0
            anim.frame = 0
          } else {
            anim.time = this.scene.time
            anim.time = anim.time % (anim.frameLength / FPS)
            anim.frame = this.scene.animFrame
            // anim.frame = Math.ceil(anim.time * FPS)
            anim.frame = anim.frame % anim.frameLength
          }
        }
      }
    }
  }

  getPosesFromTrack(id) {
    let nodes = []
    for (let i = 0; i < this.animations[id].length; i++) {
      const anim = this.animations[id][i]
      if (anim.frameLength === 0 || (!('rotateX' in anim.animations) && !('rotateY' in anim.animations) && !('rotateZ' in anim.animations) && !('translate' in anim.animations))) {
        continue
      }
      if (anim.hasPlayer) {
        anim.node.rotation[0] = anim.animations['rotateX'].player.update(null, anim.direction)
        anim.node.rotation[1] = anim.animations['rotateY'].player.update(null, anim.direction)
        anim.node.rotation[2] = anim.animations['rotateZ'].player.update(null, anim.direction)
        if (anim.target == this.rootNode.name && anim.animations['translate']) {
          let tmp = anim.animations['translate'].player.update(null, anim.direction)
          anim.node.position[0] = tmp.x
          anim.node.position[1] = tmp.y
          anim.node.position[2] = tmp.z
        }
        nodes.push(anim.node)
      } else {
        anim.node.rotation[0] = (anim.animations['rotateX'].source[anim.frame] / 180) * Math.PI
        anim.node.rotation[1] = (anim.animations['rotateY'].source[anim.frame] / 180) * Math.PI
        anim.node.rotation[2] = (anim.animations['rotateZ'].source[anim.frame] / 180) * Math.PI
        if (anim.target == this.rootNode.name && anim.animations['translate']) {
          const stride = anim.animations['translate'].stride
          anim.node.position[0] = anim.animations['translate'].source[anim.frame * stride + 0]
          anim.node.position[1] = anim.animations['translate'].source[anim.frame * stride + 1]
          anim.node.position[2] = anim.animations['translate'].source[anim.frame * stride + 2]
        }
        nodes.push(anim.node)
      }
    }
    return nodes
  }

  applyAnimationFromTracks(id1, id2, blend) {
    let poses1 = this.getPosesFromTrack(id1)
    let poses2
    if (id2 !== null) {
      poses2 = this.getPosesFromTrack(id2)
    }

    for (let i = 0; i < poses1.length; i++) {
      const n1 = poses1[i]
      const fNode = this.nodesDictionary[n1.name]

      if (fNode == undefined) {
        continue
      }
      // console.log(fNode);
      quat.identity(_QUAT1)
      quat.rotateY(_QUAT1, _QUAT1, n1.rotation[1])
      quat.rotateX(_QUAT1, _QUAT1, n1.rotation[0])
      quat.rotateZ(_QUAT1, _QUAT1, n1.rotation[2])

      if (id2 !== null) {
        const n2 = poses2[i]
        quat.identity(_QUAT2)
        quat.rotateY(_QUAT2, _QUAT2, n2.rotation[1])
        quat.rotateX(_QUAT2, _QUAT2, n2.rotation[0])
        quat.rotateZ(_QUAT2, _QUAT2, n2.rotation[2])
      }

      quat.slerp(fNode.quaternion, _QUAT1, _QUAT2, blend)

      fNode.readyToUse = true

      if (n1.name == this.rootNode.name) {
        if (id2 !== null) {
          vec3.lerp(fNode.position, n1.position, poses2[i].position, blend)
        } else {
          vec3.copy(fNode.position, n1.position)
        }
      } else {
        fNode.updateMatrix()
        fNode.updateMatrixWorld(true)
      }
    }
  }

  goToState(name, direction) {
    if (this.currentAnim == name) {
      return
    }
    for (const state in this.states) {
      if (Object.hasOwnProperty.call(this.states, state)) {
        this.states[state].progressTarget = 0
        this.states[state].direction = 1
      }
    }
    this.states[name].progressTarget = 1
    this.states[name].direction = direction
  }

  update() {
    console.log('characterAnimator.js:217', this.currentAnim)

    if (this.currentAnim == null) {
      return
    }

    const activeAnims = []
    for (const state in this.states) {
      if (Object.hasOwnProperty.call(this.states, state)) {
        let tmp = this.states[state].progressTarget - this.states[state].progress
        this.states[state].active = Math.abs(tmp) > 1e-2
        if (Math.abs(tmp) > 1e-2) {
          activeAnims.push(state)
        }
        tmp *= this.blendDamping
        this.states[state].progress += tmp
      }
    }
    // console.log(activeAnims);

    if (activeAnims.length > 0) {
      for (let i = 0; i < activeAnims.length; i++) {
        if (activeAnims[i] !== this.currentAnim) {
          this.pendingAnim = activeAnims[i]
          this.animationBlending = this.states[activeAnims[i]].progress
          break
        }
      }
    } else {
      for (const state in this.states) {
        if (Object.hasOwnProperty.call(this.states, state)) {
          if (this.states[state].progressTarget == 1) {
            this.currentAnim = state
          } else {
            this.updateAnimationTrack(state, true)
          }
        }
      }
      this.pendingAnim = null
      this.animationBlending = 0
    }

    this.updateAnimationTrack(this.currentAnim)
    if (this.pendingAnim !== null) {
      this.updateAnimationTrack(this.pendingAnim)
    }

    this.applyAnimationFromTracks(this.currentAnim, this.pendingAnim, this.animationBlending)
  }
}

export default Animator
