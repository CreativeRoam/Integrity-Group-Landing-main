// OGL
import { Color } from '@/glxp/ogl/math/Color.js'
import { Polyline } from '@/glxp/ogl/extras/Polyline.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Program } from '@/glxp/ogl/core/Program'
import { Geometry } from '@/glxp/ogl/core/Geometry.js'
import { Box } from '@/glxp/ogl/extras/Box'
import { Transform } from '@/glxp/ogl/core/Transform.js'

// GL Types
import { vec3 } from 'gl-matrix'

// Managers
import DebugController from '@/glxp/debug/DebugController'

// Geom
import GizmoAxis from '@/glxp/geom/gizmo'
import CameraGeom from '@/glxp/geom/camera'

// Utils
import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'
import SplineEditor from '@/glxp/debug/SplineEditor'

// TODO: Refactor whole Gizmo and Spline system.
// This is the gros bordel, there are interlinks everywhere.
// See : https://github.com/Dogstudio/dogstudio-webgl-starter/issues/44
class DebugGizmoManager {
  constructor(scene) {
    this.scene = scene
    this.debugMeshes = []
    this.root = new Transform()
  }

  onLoaded() {
    vec3.copy(this.root.position, this.scene.root.position)
    vec3.copy(this.root.rotation, this.scene.root.rotation)
    vec3.copy(this.root.scale, this.scene.root.scale)

    this.initSplineEditor()
  }

  initSplineEditor() {
    this.splineEditor = new SplineEditor(this.scene, this)
  }

  createDebugProgram() {
    let shader = new Shader(ShaderManifest['debugUnlit'])
    return new Program(this.scene.gl, {
      vertex: shader.vert,
      fragment: shader.frag,
      transparent: true,
      uniforms: {
        uColor: { value: new Color('#FF0000') },
        uAlpha: { value: 1 },
      },
    })
  }

  createDebugAxis(scale, color = '#FF0000', alpha = 1, axis = 'Z+', parent = this.root) {
    let geom = new Geometry(this.scene.gl, {
      position: { size: 3, data: new Float32Array(GizmoAxis.vertices) },
      uv: { size: 2, data: new Float32Array(GizmoAxis.uvs) },
      index: { data: new Uint16Array(GizmoAxis.indices) },
    })
    let program = this.createDebugProgram()
    program.uniforms.uColor.value = new Color(color)
    program.uniforms.uAlpha.value = alpha

    let mesh = new Mesh(this.scene.gl, { geometry: geom, program })
    mesh.alpha = alpha
    mesh.setParent(parent)
    if (scale.x) {
      mesh.scale.set(scale.x, scale.y, scale.z)
    } else {
      mesh.scale.set(scale, scale, scale)
    }
    mesh.axis = axis
    this.debugMeshes.push(mesh)

    if (axis == 'X+') {
      mesh.rotation.y = -Math.PI / 2
    } else if (axis == 'Y+') {
      mesh.rotation.x = Math.PI / 2
    }

    return mesh
  }

  createDebugCube(scale, color = '#FF0000', alpha = 1, parent = this.root) {
    let program = this.createDebugProgram()
    program.uniforms.uColor.value = new Color(color)
    program.uniforms.uAlpha.value = alpha

    let mesh = new Mesh(this.scene.gl, { geometry: new Box(this.scene.gl, 1, 1, 1), program })
    mesh.setParent(parent)
    mesh.alpha = alpha
    if (scale.x) {
      mesh.scale.set(scale.x, scale.y, scale.z)
    } else {
      mesh.scale.set(scale, scale, scale)
    }
    this.debugMeshes.push(mesh)

    return mesh
  }

  createDebugCamera(scale, color = '#FFFFFF', alpha = 1, parent = this.root) {
    let program = this.createDebugProgram()
    program.uniforms.uColor.value = new Color(color)
    program.uniforms.uAlpha.value = alpha

    let geom = new Geometry(this.scene.gl, {
      position: { size: 3, data: new Float32Array(CameraGeom.vertices) },
      uv: { size: 2, data: new Float32Array(CameraGeom.uvs) },
      index: { data: new Uint16Array(CameraGeom.indices) },
    })

    let mesh = new Mesh(this.scene.gl, { geometry: geom, program })
    mesh.setParent(parent)
    mesh.alpha = alpha
    if (scale.x) {
      mesh.scale.set(scale.x, scale.y, scale.z)
    } else {
      mesh.scale.set(scale, scale, scale)
    }
    this.debugMeshes.push(mesh)

    return mesh
  }

  createDebugSpline(geom, curve) {
    const points = curve.getPoints()
    const colors = { Camera_Spline: '#f00', Lookat_Spline: '#0f0', Light_Spline: '#00f' }
    const polyline = new Polyline(this.scene.gl, {
      points,
      uniforms: {
        uColor: { value: new Color(colors[geom.name]) },
        uThickness: { value: 1.5 },
      },
    })
    const mesh = new Mesh(this.scene.gl, { geometry: polyline.geometry, program: polyline.program })
    mesh.position.set(geom.translate[0], geom.translate[1], geom.translate[2])
    mesh.rotation.set(geom.rotation[0], geom.rotation[1], geom.rotation[2])
    mesh.scale.set(geom.scale[0], geom.scale[1], geom.scale[2])
    mesh.setParent(this.scene.root)
    mesh.visible = this.sceneConfig.Splines_Debug.value == 'on'
    this.debugMeshes.push(mesh)
  }

  render() {
    if (DebugController.active && this.debugMeshes.length > 0) {
      this.scene.renderer.render({
        scene: this.root,
        camera: this.scene.camera,
        clear: false,
        frustumCull: false,
        sort: false,
      })

      this.splineEditor?.render()
    }
  }
}

export default DebugGizmoManager
