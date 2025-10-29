import Emitter from 'event-emitter'
import Node from './node'

import { isMobile } from '@/glxp/utils/device'

class Scene {
  constructor(container, manager) {
    this.dpr = manager.dpr
    this.width = container.offsetWidth * this.dpr
    this.height = container.offsetHeight * this.dpr
    this.container = container

    this.isMobile = isMobile

    this.active = false
    this.time = 0
    this.dt = 0

    this.passes = []

    if (manager !== null) {
      this.manager = manager
      this.canvas = this.manager.canvas
      this.gl = this.manager.gl
    } else {
      this.catchContext()
    }
    this.inTransition = false
    this.root = new Node()

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

  catchContext() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.maxWidth = this.container.offsetWidth + 'px'
    this.canvas.style.maxHeight = this.container.offsetHeight + 'px'
    this.container.appendChild(this.canvas)

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
    // this is usually overriden in each scene

    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].onResize()
    }
  }

  onResize() {
    // called from webglManager.js
    if (this.inTransition && this.isMobile) return
    this.dpr = this.manager.dpr
    this.width = this.container.offsetWidth * this.dpr
    this.height = this.container.offsetHeight * this.dpr
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.maxWidth = this.container.offsetWidth + 'px'
    this.canvas.style.maxHeight = this.container.offsetHeight + 'px'
    this.gl.viewport(0, 0, this.width, this.height)

    if (this.resize) this.resize()

    if (this.post) this.post.resize()
  }

  dispose() {
    this.disposeMeshes()
  }

  disposeMeshes() {
    if (this.meshes) {
      this.meshes.forEach(mesh => {
        if (mesh.dispose) {
          mesh.dispose()
        } else {
          if (mesh.setParent) mesh.setParent(null)
        }
      })
      this.meshes = []
    }
  }
}

export default Scene
