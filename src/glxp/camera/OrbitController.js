import Mouse from '@/glxp/utils/Mouse'
import DebugController from '@/glxp/debug/DebugController'
import { vec3 } from 'gl-matrix'
import Node from '@/glxp/abstract/node'

import { Vec3 } from '@/glxp/ogl/math/Vec3.js'

const _VEC3 = vec3.create()
const _VEC3_1 = vec3.create()
const _UP = vec3.fromValues(0, 1, 0)

class OrbitController {
  constructor (scene, camera, {
    pan = true,
    startDistance = 10,
    minDistance = 0.0001,
    maxDistance = Infinity,
    applyTransform = true,
    startAngleX =  Math.PI,
    startAngleY = -Math.PI / 2,
    angleLimitY = [ -Math.PI+0.1, -.1],
    dragVelocity = 5,
    target = [0, 0, 0]
  }={}){
    this.scene = scene
    this.camera = camera
    this.node = new Node()

    this.offset = vec3.fromValues(startAngleY, startAngleX, 0)
    this.offsetTarget = vec3.fromValues(startAngleY, startAngleX, 0)
    this.radiusTarget = startDistance
    this.radius = startDistance
    this.pinchStartRadius = startDistance

    this.target = vec3.fromValues(target[0], target[1], target[2])
    this.targetCopy = new Vec3()
    this.canPan = pan
    this.dragVelocity = dragVelocity
    this.angleLimitY = angleLimitY
    this.pan = vec3.create()
    this.altPressed = false
    this.prevent = false
    this.applyTransform = applyTransform
    this.canZoom = true
    this.canRotate = true

    // temp values
    this.cameraDir = vec3.create()
    this.cameraUp = vec3.create()
    this.cameraRight = vec3.create()

    this.config = {
      camera_damping: { value: 0.2, range: [0.001, 0.1] },
    }

    Mouse.on('pinch-start', () => {
      if (!this.canZoom || this.prevent) {
        return
      }
      this.pinchStartRadius = this.radiusTarget
    })

    Mouse.on('pinch', () => {
      if (!this.canZoom || this.prevent) {
        return
      }
      this.radiusTarget = this.pinchStartRadius + Mouse.pinchDistance * 0.03
      this.radiusTarget = Math.max(Math.min(this.radiusTarget, maxDistance), minDistance)
    })

    Mouse.on('wheel', () => {
      if (!this.canZoom) {
        return
      }
      if (!this.prevent) {
        if (Mouse.wheelDir == 'up') {
          this.radiusTarget += 0.1
        } else {
          this.radiusTarget -= 0.1
        }
      }
      this.radiusTarget = Math.max(Math.min(this.radiusTarget, maxDistance), minDistance)
    })

    if (this.canPan) {
      window.addEventListener('keydown', (evt) => {
        if (evt.key == 'Alt') {
          this.altPressed = true
        }
      })
      window.addEventListener('keyup', (evt) => {
        if (evt.key == 'Alt') {
          this.altPressed = false
        }
      })
    }

    DebugController.on('drag-prevent', () => {
      this.prevent = true
    })
    DebugController.on('drag-unprevent', () => {
      this.prevent = false
    })

    DebugController.addConfig(this.config, 'Orbit')
  }

  update() {
    if (!this.prevent) {
      if (this.altPressed) {
        if (Mouse.isDown) {
          vec3.zero(this.cameraDir)
          vec3.zero(this.cameraRight)
          vec3.zero(this.cameraUp)

          this.pan[0] = Mouse.velocity[0] * -10
          this.pan[1] = Mouse.velocity[1] * (this.scene.width / this.scene.height) * 5

          vec3.sub(this.cameraDir, this.node.position, this.target)
          vec3.normalize(this.cameraDir, this.cameraDir)

          vec3.cross(this.cameraRight, _UP, this.cameraDir)
          vec3.normalize(this.cameraRight, this.cameraRight)
          vec3.cross(this.cameraUp, this.cameraDir, this.cameraRight)

          vec3.scale(_VEC3, this.cameraRight, this.pan[0])
          vec3.scale(_VEC3_1, this.cameraUp, this.pan[1])
          vec3.add(_VEC3, _VEC3, _VEC3_1)
          vec3.add(this.target, this.target, _VEC3)
        }
      } else {
        if (Mouse.isDown && this.canRotate) {
          this.offsetTarget[1] += Mouse.velocity[0] * this.dragVelocity
          this.offsetTarget[0] += Mouse.velocity[1] * (this.scene.width / this.scene.height) * this.dragVelocity
        }
      }
    }

    this.offsetTarget[0] = Math.min(Math.max(this.offsetTarget[0], this.angleLimitY[0]), this.angleLimitY[1])
    // this.offsetTarget[1] += .01

    vec3.sub(_VEC3, this.offsetTarget, this.offset)
    vec3.scale(_VEC3, _VEC3, this.config.camera_damping.value)
    vec3.add(this.offset, this.offset, _VEC3)

    let tmp = this.radiusTarget - this.radius
    tmp *= this.config.camera_damping.value
    this.radius += tmp

    let r = this.radius
    this.node.position[0] = r * -Math.sin(this.offset[0]) * Math.sin(this.offset[1]) + this.target[0]
    this.node.position[1] = r * Math.cos(this.offset[0]) + this.target[1]
    this.node.position[2] = r * Math.sin(this.offset[0]) * Math.cos(this.offset[1]) + this.target[2]

    if (this.applyTransform) {
      this.camera.position.set(this.node.position[0], this.node.position[1], this.node.position[2])
      this.targetCopy.set(this.target[0], this.target[1], this.target[2])
      this.camera.lookAt(this.targetCopy)
    }
  }
}

export default OrbitController
