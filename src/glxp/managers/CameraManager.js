import DebugController from '@/glxp/debug/DebugController'

import OrbitController from '@/glxp/camera/OrbitController'
import { Camera } from '@/glxp/ogl/core/Camera.js'
import { Vec3 } from '@/glxp/ogl/math/Vec3.js'

// import Catmull from '@/glxp/utils/CatmullCurve'
// import { FloatArrayToGlMatrixVec3Array } from '@/glxp/utils/math'
import { vec3 } from 'gl-matrix'

export default class CameraManager {
  constructor(gl, options) {
    this.width = options.width
    this.height = options.height
    this.scene = options.scene
    this.debug = options.debug
    this.fov = options.fov || 40

    this.gl = gl
    this.toGo = new Vec3(0, 0, 10)
    this.toLook = new Vec3(0, 0, 0)
    this.lastWheel = 0
    this.catmulls = {}

    this.mouse = [0, 0]

    this.camera = new Camera(this.gl, {
      near: 0.01,
      far: 1000,
      fov: this.fov,
      aspect: this.width / this.height,
    })

    if (this.debug) {
      this.debugMode = true
      this.orbit = new OrbitController(this.scene, this.camera, {
        startAngleX: options.frontFacing ? Math.PI : 2.5,
        startAngleY: options.frontFacing ? -Math.PI / 2 : -1,
        startDistance: 7,
        target: [0, 0.5, 0],
      })

      DebugController.on('gui-lazyloaded', this.initDebugEvents)
    }

    window.__cameraManager = this
  }
  resize(width, height) {
    this.camera.perspective({
      aspect: width / height,
    })
  }

  initDebugEvents() {
    // Old hook that got duplicated, remove if really not needed
  }

  preRender() {
    this.update()

    if (this.orbit) {
      this.orbit.update()
    }
  }

  // addSplineFromCurve(curve, id) {
  //   const catmull = new Catmull(FloatArrayToGlMatrixVec3Array(curve._data.vertices))
  //   catmull.node.position = vec3.clone(curve._data.translate)
  //   catmull.node.rotation = vec3.clone(curve._data.rotation)
  //   catmull.node.scale = vec3.clone(curve._data.scale)
  //   catmull.generate()
  //   this.catmulls[id] = catmull
  // }

  addSpline(catmull, id) {
    this.catmulls[id] = catmull
  }

  update() {
    if (this.debugMode) {
      this.scene.progressTarget = (this.scene.time * 0.01) % 1
      this.scene.progress = this.scene.progressTarget
    } else {
      if (this.catmulls['camera']) {
        vec3.copy(this.toGo, this.catmulls['camera'].getPointLinearMotion(this.scene.progress))
        vec3.mul(this.camera.position, this.toGo, this.scene.debugManager.splineEditor.root.scale)
      }

      if (this.catmulls['lookat']) {
        vec3.copy(this.toLook, this.catmulls['lookat'].getPointLinearMotion(this.scene.progress + 0.01))
      }
    }

    // Camera position is in World position
    vec3.mul(this.camera.position, this.toGo, this.scene.root.scale)
    vec3.mul(this.toLook, this.toLook, this.scene.root.scale)
    this.camera.lookAt(this.toLook)
  }
}
