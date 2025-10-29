import { Vec3 } from '@/glxp/ogl/math/Vec3.js'
import { Mat4 } from '@/glxp/ogl/math/Mat4.js'
import { Sphere } from '@/glxp/ogl/extras/Sphere.js'
import { Color } from '@/glxp/ogl/math/Color.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'

import Shader from '@/glxp/utils/shader'
import ShaderManifest from '@/glxp/shaderManifest'

import GlobalEmitter from '@/glxp/utils/emitter'
import { EVENTS } from '@/utils/constants'

import { map } from '@/glxp/utils/math'

const _tempVec3 = new Vec3()
const _tempMat4 = new Mat4()

// Hotspot data structure
// {
//   name: 'hotspot-name',
//   worldPosition:  new Vec3(0, 0, 0),
//   screenPosition: new Vec3(),
//   screenPositionPx: new Vec2(),
//   distanceToCamera: 1,
//   inView: false,
//   visibility: 1
// }

export default class HotspotManager {
  constructor(gl, { scene, debug = false, hotspots = [], debugRadius = .1 }) {
    this.gl = gl
    this.scene = scene
    this.debug = debug
    this.hotspots = hotspots
    this.debugRadius = debugRadius

    this.ratioWidth = this.scene.width / this.scene.dpr
    this.ratioHeight = this.scene.height / this.scene.dpr

    if (this.debug) this.debugMarkers = this.initDebugMarkers()
  }

  // DEBUG
  initDebugMarkers() {
    return this.hotspots.map((hotspot) => this.createDebugMarker(hotspot, { opacity: hotspot.visibility }))
  }

  createDebugMarker(hotspot, { opacity = .75 }) {
    const shader = new Shader(ShaderManifest['debugHotspot'], 1)

    this.geometry = new Sphere(this.gl, { radius: this.debugRadius })
    this.program = new Program(this.gl, {
      vertex: shader.vert,
      fragment: shader.frag,
      depthTest: false,
      depthWrite: true,
      transparent: true,
      uniforms: {
        uAlpha: { value: opacity },
        uColor: { value: new Color('#894adb') },
      },
    })

    const markerMesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
      forceRenderOrder: true,
      renderOrder: 1000,
    })

    markerMesh.position = hotspot.worldPosition
    markerMesh.opacity = opacity

    markerMesh.setParent(this.scene.root)

    return markerMesh
  }

  // UTILS
  setHotspotLinkScreenSpaceInfos(hotspot) {
    _tempVec3.copy(hotspot.worldPosition)

    if (hotspot.scale) {
      _tempVec3.multiply(hotspot.scale)
    }

    _tempMat4.identity()
    _tempMat4.translate(_tempVec3)
    _tempMat4.multiply(this.scene.camera.projectionViewMatrix, _tempMat4)
    _tempVec3.set(0, 0, 0)
    _tempVec3.applyMatrix4(_tempMat4)

    hotspot.screenPosition.copy(_tempVec3)
    hotspot.screenPositionPx.x = map(_tempVec3.x, -1, 1, 0, this.ratioWidth)
    hotspot.screenPositionPx.y = map(_tempVec3.y, 1, -1, 0, this.ratioHeight)
    hotspot.inView =
      _tempVec3.z < 1 &&
      _tempVec3.x > -1 &&
      _tempVec3.x < 1 &&
      _tempVec3.y > -1 &&
      _tempVec3.y < 1
    hotspot.distanceToCamera = hotspot.worldPosition.distance(
      this.scene.camera.position
    )
  }

  // EVENTS
  resize(width, height) {
    this.ratioWidth = width / this.scene.dpr
    this.ratioHeight = height / this.scene.dpr
  }

  // UPDATE
  update() {
    for (let i = 0; i < this.hotspots.length; i += 1) {
      const hotspot = this.hotspots[i]
      this.setHotspotLinkScreenSpaceInfos(hotspot)
      GlobalEmitter.emit(EVENTS.HOTSPOT_POSITION, { hotspot })

      // Set debug markers opacity based on hotspot visibility
      if (this.debug) {
        this.debugMarkers[i].program.uniforms.uAlpha.value = hotspot.visibility * this.debugMarkers[i].opacity
      }
    }
  }
}
