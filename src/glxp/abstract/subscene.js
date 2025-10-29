import Emitter from 'event-emitter'
import Node from './node'

import DebugController from '@/glxp/debug/DebugController'

// Subscene is a lighter version of Scene without the logic updating the dom canvas
class Subscene {
  constructor(container, manager = null, textureLoader, shouldFirstDraw = false) {
    this.mobile = typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1

    this.dpr = manager.dpr
    this.width = container.offsetWidth * this.dpr
    this.height = container.offsetHeight * this.dpr
    this.container = container

    this.active = false
    this.hasAlreadyActivated = false
    this.inTransition = false
    this.time = 0
    this.dt = 0

    this.passes = []

    if (manager !== null) {
      this.manager = manager
      this.renderer = manager.renderer
      this.canvas = this.manager.canvas
      this.gl = this.manager.gl
    } else {
      this.catchContext()
    }

    this.textureLoader = textureLoader

    // Meshes
    this.root = new Node()
    this.meshes = []

    // First Draw
    this.shouldFirstDraw = shouldFirstDraw
    this.didFirstDraw = false
    this.pendingFDMeshes = []
    this.pendingFDMeshesPassed = []

    // Events
    this._emitter = {}
    Emitter(this._emitter)
    this.on = this._emitter.on.bind(this._emitter)

    // For optimization, can be changed from webglmanager
    this.postOptions = {}
    this.hasBloom = true
  }

  getMesh(name) {
    for (let i = 0; i < this.meshes.length; i++) {
      if (this.meshes[i].name == name) {
        return this.meshes[i]
      }
    }
  }

  getMeshes(name) {
    let out = []
    for (let i = 0; i < this.meshes.length; i++) {
      if (this.meshes[i].name == name) {
        out.push(this.meshes[i])
      }
    }
    return out
  }

  getParentInNodeTree(tree, meshName) {
    for (const key in tree) {
      if (Object.hasOwnProperty.call(tree, key)) {
        const el = tree[key]
        if (el.childrenIds.indexOf(meshName) > -1) {
          return el.transform
        }
      }
    }
    return undefined
  }

  // First Draw
  getFirstDrawPromises() {
    let promises = []

    this.meshes.forEach((mesh) => {
      if (mesh.getFirstDrawPromise) {
        promises.push(mesh.getFirstDrawPromise())
        this.pendingFDMeshes.push(mesh)
      }
    })

    return promises
  }

  drawNextFDMesh() {
    if (this.pendingFDMeshes.length > 0) {
      this.pendingFDMeshes[0].firstDraw()
      this.pendingFDMeshesPassed.push(this.pendingFDMeshes.shift())
    }
  }

  // Lifecycle
  activate() {
    return new Promise((resolve) => {
      if (!this.hasAlreadyActivated) this.onFirstActivate()

      this.active = true
      this.activationResolve = resolve
      this.onPostFirstDraw()
      this.onActivate()
    })
  }

  disable() {
    this.active = false

    this.onDisable()
  }
  
  dispose() {
    this.disposeMeshes()
  }

  disposeMeshes() {
    this.meshes.forEach(mesh => {
      if (mesh.dispose) {
        mesh.dispose()
      } else {
        mesh.setParent(null)
      }
    })

    this.meshes = []
  }

  // Utils
  catchContext() {
    this.gl = this.canvas.getContext('webgl', {
      // antialias: false
    })

    if (this.gl === undefined) {
      return
    }

    // enable extensions
    // VAO Polyfill
    let vaoExt = this.gl.getExtension('OES_vertex_array_object')
    if (vaoExt) {
      this.gl['createVertexArray'] = function () {
        return vaoExt['createVertexArrayOES']()
      }
      this.gl['deleteVertexArray'] = function (vao) {
        vaoExt['deleteVertexArrayOES'](vao)
      }
      this.gl['bindVertexArray'] = function (vao) {
        vaoExt['bindVertexArrayOES'](vao)
      }
      this.gl['isVertexArray'] = function (vao) {
        return vaoExt['isVertexArrayOES'](vao)
      }
    }
    this.gl.getExtension('OES_standard_derivatives')
    this.gl.getExtension('EXT_shader_texture_lod')

    this.gl.getExtension('OES_texture_float')
    this.gl.getExtension('OES_texture_float_linear')
    this.gl.getExtension('OES_texture_half_float')
    this.gl.getExtension('OES_texture_half_float_linear')
    this.gl.getExtension('EXT_color_buffer_half_float')
  }

  resize() {
    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].onResize()
    }
  }

  // Events
  onResize() {
    // called from webglManager.js
    if (this.inTransition && this.mobile) return

    this.width = this.container.offsetWidth * this.dpr
    this.height = this.container.offsetHeight * this.dpr

    if (this.resize) this.resize()
  }

  onActivate() {}

  onDisable() {}

  onFirstActivate() {
    this.hasAlreadyActivated = true

    DebugController.addBlade(this.config, `Global Settings - ${this.name || 'Unknown'}`)
  }

  onPostFirstDraw() {}
}

export default Subscene
