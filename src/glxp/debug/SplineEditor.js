import DebugController from '@/glxp/debug/DebugController'

// OGL
import { Transform } from '@/glxp/ogl/core/Transform.js'
import { Raycast } from '@/glxp/ogl/extras/Raycast.js'
import { Polyline } from '@/glxp/ogl/extras/Polyline.js'
import { Color } from '@/glxp/ogl/math/Color.js'

import { vec3 } from 'gl-matrix'
import Mouse from '@/glxp/utils/Mouse'
import CatmullCurve from '@/glxp/utils/CatmullCurve'
import { FloatArrayToVec3Array, HslToHex } from '@/glxp/utils/math'

/*
To add in the config file
"_SplinesEditorData": {
    "camera": {
        "name": "camera",
        "points": [
        [0, 0, 0],
        [0, 15, 10],
        [15, 15, -10],
        [0, 15, -20]
        ]
    },
}

*/

const _VEC3 = vec3.create()
const DRAG_SPEED = 0.15

class SplineEditor {
  constructor(scene, manager) {
    this.scene = scene
    this.manager = manager
    this.root = new Transform()
    this.raycast = new Raycast(this.scene.gl)

    this.currentGizmosId = 0
    this.currentSplineId = 0
    this.gizmosMeshes = []
    this.gizmosPointGroups = []
    this.splines = {}
    this.raycastHit = null

    this.needsDrag = false
    this.dragAxis = null
    this.dragActiveGroup = null

    this.init()

    if (DebugController.active) {
      this.initEvents()
    }
  }

  init() {
    vec3.copy(this.root.position, this.scene.root.position)
    vec3.copy(this.root.rotation, this.scene.root.rotation)
    vec3.copy(this.root.scale, this.scene.root.scale)
    vec3.scale(this.root.scale, this.root.scale, 0.01)

    if (localStorage.getItem('_SplinesEditorData')) {
      this.data = JSON.parse(localStorage.getItem('_SplinesEditorData'))
      for (const key in this.data) {
        this.activeSpline = key
        if (Object.hasOwnProperty.call(this.data, key)) {
          const element = this.data[key]
          element.points.forEach((point, index) => {
            this.addControlPoint(vec3.fromValues(point[0], point[1], point[2]), key, index)
          })
          this.createSpline(key)
        }
      }
    } else if (DebugController.config['_SplinesEditorData'] == undefined) {
      this.data = {}
      this.addSpline('camera')
      this.activeSpline = 'camera'
      DebugController.config['_SplinesEditorData'] = this.data
      this.addControlPoint(vec3.create())
      this.addControlPoint(vec3.fromValues(0, 15, 10))
      this.addControlPoint(vec3.fromValues(15, 15, -10))
      this.addControlPoint(vec3.fromValues(0, 15, -20))
      this.createSpline('camera')
    } else {
      this.data = DebugController.config['_SplinesEditorData']
      for (const key in this.data) {
        this.activeSpline = key
        if (Object.hasOwnProperty.call(this.data, key)) {
          const element = this.data[key]
          element.points.forEach((point, index) => {
            this.addControlPoint(vec3.fromValues(point[0], point[1], point[2]), key, index)
          })
          this.createSpline(key)
        }
      }
    }
  }

  addSpline(id) {
    this.data[id] = {
      name: id,
      points: [],
    }
  }

  initEvents() {
    Mouse.on('down', () => {
      if (this.raycastHit !== null) {
        this.needsDrag = true
        this.dragAxis = this.raycastHit
        this.dragActiveGroup = this.gizmosPointGroups[this.raycastHit.groupId]
        DebugController._emitter.emit('prevent')
      }
    })

    Mouse.on('up', () => {
      if (this.dragAxis !== null) {
        this.needsDrag = false
        this.dragAxis = null
        this.dragActiveGroup = null
        DebugController._emitter.emit('unprevent')
      }
    })

    this.guiInputs = {}

    let folder = DebugController.scenePane.addFolder({
      title: 'Spline Editor',
      expanded: false,
    })
    this.guiInputs['splineList'] = folder.addBlade({
      view: 'list',
      label: 'Spline to edit',
      options: this.data,
      value: this.data[this.activeSpline],
    })
    folder.addBlade({ view: 'separator' })
    this.guiInputs['add'] = folder.addButton({ title: 'Add control point' })
    this.guiInputs['remove'] = folder.addButton({ title: 'Remove control point' })
    folder.addBlade({ view: 'separator' })
    this.guiInputs['save'] = folder.addButton({ title: 'SAVE Spline Locally' })
    this.guiInputs['clear'] = folder.addButton({ title: 'CLEAR Local config' })
    folder.addBlade({ view: 'separator' })
    this.guiInputs['dump'] = folder.addButton({ title: 'Dump config (Dev Only)' })

    this.guiInputs['clear'].disabled = !localStorage.getItem('_SplinesEditorData')
    this.guiInputs['add'].on('click', () => {
      const nextPos = this.data[this.activeSpline].points[this.data[this.activeSpline].points.length - 1]
      this.addControlPoint(vec3.fromValues(nextPos[0] + 2, nextPos[1] + 2, nextPos[2] + 2), this.activeSpline)
      this.updateSpline(this.activeSpline)
    })
    this.guiInputs['dump'].on('click', () => {
      DebugController.config['_SplinesEditorData'] = JSON.parse(JSON.stringify(this.data))
      DebugController.dump()
    })
    this.guiInputs['save'].on('click', () => {
      localStorage.setItem('_SplinesEditorData', JSON.stringify(this.data))
    })
    this.guiInputs['clear'].on('click', () => {
      localStorage.removeItem('_SplinesEditorData')
    })
    this.guiInputs['splineList'].on('change', (evt) => {
      this.activeSpline = evt.value.name
    })
    DebugController.on('beforeSave', () => {
      DebugController.config['_SplinesEditorData'] = JSON.parse(JSON.stringify(this.data))
    })
  }

  addControlPoint(pos, splineName = 'default', id = null) {
    if (this.activeSpline) {
      splineName = this.activeSpline
    }

    let gizmoId = this.currentGizmosId
    let controllPointGroup = new Transform()
    controllPointGroup.setParent(this.root)
    this.gizmosPointGroups.push(controllPointGroup)
    let pointId
    if (id == null) {
      this.data[splineName].points.push(Array.from(pos))
      pointId = this.data[splineName].points.length - 1
    } else {
      pointId = id
    }
    vec3.copy(controllPointGroup.position, pos)

    if (!(DebugController.active && DebugController.queryDebug('orbit'))) {
      return
    }
    let point = this.manager.createDebugCube(0.12 * (0.1 / this.root.scale.x), '#FFFFFF', 0.3, controllPointGroup)
    let axisX = this.manager.createDebugAxis(0.3 * (0.1 / this.root.scale.x), '#FF0000', 0.3, 'X+', controllPointGroup)
    let axisY = this.manager.createDebugAxis(0.3 * (0.1 / this.root.scale.x), '#00FF00', 0.3, 'Y+', controllPointGroup)
    let axisZ = this.manager.createDebugAxis(0.3 * (0.1 / this.root.scale.x), '#0000FF', 0.3, 'Z+', controllPointGroup)

    axisX.point = axisY.point = axisZ.point = point

    this.gizmosMeshes.push(point)
    this.gizmosMeshes.push(axisX)
    this.gizmosMeshes.push(axisY)
    this.gizmosMeshes.push(axisZ)

    point.groupId = gizmoId
    axisX.groupId = gizmoId
    axisY.groupId = gizmoId
    axisZ.groupId = gizmoId

    point.splineName = splineName
    axisX.splineName = splineName
    axisY.splineName = splineName
    axisZ.splineName = splineName

    point.name = `GizmoPoint_${gizmoId}_${pointId}`
    axisX.name = `GizmoAxisX_${gizmoId}_${pointId}`
    axisY.name = `GizmoAxisY_${gizmoId}_${pointId}`
    axisZ.name = `GizmoAxisZ_${gizmoId}_${pointId}`

    this.currentGizmosId++
  }

  updateSpline(id) {
    if (this.data[id].points.length < 4) {
      return
    }
    this.splines[id].catmull = new CatmullCurve(this.data[id].points)
    this.splines[id].catmull.generate()

    if (!(DebugController.active && DebugController.queryDebug('orbit'))) {
      return
    }
    let points = this.splines[id].catmull.getPointsUniform(500)
    this.splines[id].polyline.points = FloatArrayToVec3Array(points)
    this.splines[id].polyline.updateGeometry()
  }

  createSpline(id) {
    // const points = curve.getPoints()
    if (this.splines[id] == undefined) {
      this.splines[id] = {}
    }
    if (this.data[id].points.length < 3) {
      return
    }
    this.splines[id].catmull = new CatmullCurve(this.data[id].points)
    this.splines[id].catmull.generate()

    if (!(DebugController.active && DebugController.queryDebug('orbit'))) {
      return
    }
    let points = this.splines[id].catmull.getPointsUniform(500)
    points = FloatArrayToVec3Array(points)

    this.splines[id].polyline = new Polyline(this.scene.gl, {
      points,
      uniforms: {
        uColor: { value: new Color(HslToHex((this.currentSplineId / 7) * 360, 100, 50)) },
        uThickness: { value: 1 * this.scene.dpr },
      },
    })
    this.splines[id].polyline.mesh.setParent(this.root)
    this.currentSplineId++
  }

  preRender() {
    this.raycastHit = null
    this.raycast.castMouse(this.scene.camera, [Mouse.cursor[0], -Mouse.cursor[1]])
    this.gizmosMeshes.forEach((mesh) => {
      mesh.isHit = false
      mesh.visible = mesh.splineName == this.activeSpline
      mesh.castable = mesh.splineName == this.activeSpline
      mesh.program.uniforms['uAlpha'].value = mesh.alpha
    })
    const hits = this.raycast.intersectBounds(this.gizmosMeshes)
    hits.forEach((mesh) => (mesh.isHit = true))
    if (hits.length > 0) {
      this.raycastHit = hits[0]
      if (this.raycastHit.point) {
        this.raycastHit.program.uniforms['uAlpha'].value = 1
        this.raycastHit.point.program.uniforms['uAlpha'].value = 1
      }
    }

    if (this.needsDrag) {
      const axis = this.dragAxis.axis
      const splinePointId = parseInt(this.dragAxis.name.split('_')[2])
      vec3.sub(_VEC3, this.scene.camera.worldPosition, this.dragActiveGroup.worldPosition)
      if (axis == 'X+') {
        this.dragActiveGroup.position.x += Mouse.velocity[0] * (this.scene.width / this.scene.dpr) * 0.5 * Math.sign(_VEC3[2]) * DRAG_SPEED
      } else if (axis == 'Y+') {
        this.dragActiveGroup.position.y += Mouse.velocity[1] * (this.scene.height / this.scene.dpr) * -0.5 * DRAG_SPEED
      } else if (axis == 'Z+') {
        this.dragActiveGroup.position.z += Mouse.velocity[0] * (this.scene.width / this.scene.dpr) * -0.5 * Math.sign(_VEC3[0]) * DRAG_SPEED
      }
      vec3.copy(this.data[this.dragAxis.splineName].points[splinePointId], this.dragActiveGroup.position)
      this.updateSpline(this.dragAxis.splineName)

      //  this.dragAxis = null
      // this.dragActiveGroup = null
    }
  }

  render() {
    this.preRender()

    this.scene.renderer.render({
      scene: this.root,
      camera: this.scene.camera,
      clear: false,
      frustumCull: false,
      sort: false,
    })
  }
}

export default SplineEditor
