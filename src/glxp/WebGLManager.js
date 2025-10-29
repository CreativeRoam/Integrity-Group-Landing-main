import MainScene from '@/glxp/scenes/Main'

import Emitter from 'event-emitter'

import TextureLoader from '@/glxp/utils/TextureLoaderManager'
import debounce from '@/glxp/utils/debounce'

import { Renderer } from '@/glxp/ogl/core/Renderer.js'

import PerformanceManager from './managers/PerformanceManager'
import DebugController from '@/glxp/debug/DebugController'

class Manager {
  constructor() {
    this.scenes = {}
    this.initialized = false

    this.clearColor = [0, 0, 0, 1]

    this._emitter = {}
    Emitter(this._emitter)
    this.on = this._emitter.on.bind(this._emitter)

    this.performanceManager = new PerformanceManager(this, {
      thresholds: {
        potato: 53,
        low: 57,
      }
    })

    window.GLXP = this
    this.maxDpr = 2
  }

  init(container) {
    this.dpr = Math.max(Math.min(window.devicePixelRatio, this.maxDpr), 1)
    this.width = container.offsetWidth * this.dpr
    this.height = container.offsetHeight * this.dpr
    this.container = container
    this.catchContext()
    this.textureLoader = new TextureLoader(this.gl)
    this.initialized = true
    DebugController.setManager(this)

    this.initScenes()

    this.debouncedResize = debounce(this.resize.bind(this), 30)
    window.addEventListener('resize', this.debouncedResize)

    return this
  }

  initScenes() {
    this.addScene('main', MainScene)
  }

  addScene(id, Scene) {
    this.scenes[id] = {
      scene: new Scene(this.container, this),
      active: false,
      callbackCanvas: null,
    }
  }

  registerCallbackCanvas(id, canvas) {
    this.scenes[id].callbackCanvas = canvas
  }

  getScene(id) {
    return this.scenes[id].scene
  }

  loadScene(id) {
    if (this.scenes[id].scene.loaded === false) {
      let promise = new Promise((resolve, reject) => {
        this.scenes[id].scene.load()
        this.scenes[id].scene.on('loaded', () => {
          this.resize()
          this.scenes[id].scene.onResize()
          resolve()
        })
      })

      return promise
    }
  }

  activate(id) {
    this.scenes[id].active = true

    const activationPromise = this.scenes[id].scene.activate()

    activationPromise.then(() => {
      this.performanceManager.setOnAverageCallback((fps) => {
        const calcFPS = Math.min(Math.round(fps), 60) // Cap FPS due to higher refresh rate screens. Round it as well.
        this.performanceManager.onPerfCheck({ fps: calcFPS })
      })

      if (DebugController.active) {
        this.performanceManager.setDebugEvents()
      }
    })

    return activationPromise
  }

  resize() {
    this._emitter.emit('resize')

    this.width = this.container.offsetWidth * this.dpr
    this.height = this.container.offsetHeight * this.dpr
    this.renderer.setSize(this.width, this.height)

    this.canvas.style.minWidth = `${this.container.offsetWidth}px`
    this.canvas.style.minHeight = `${this.container.offsetHeight}px`

    // resize scenes after changes
    for (const scene in this.scenes) {
      if (this.scenes.hasOwnProperty(scene)) {
        const sc = this.scenes[scene].scene
        sc.onResize()

        // resize subscenes if exist
        if (sc.subscenes) {
          sc.subscenes.forEach((subscene) => {
            subscene.onResize()
          })
        }
      }
    }
  }

  desactivate(id) {
    this.scenes[id].active = false
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.colorMask(true, true, true, true)
  }

  catchContext() {
    this.renderer = new Renderer({
      antialias: false,
      // webgl: 1
      powerPreference: 'high-performance',
      stencil: false,
    })
    this.gl = this.renderer.gl

    if (!this.renderer.isWebgl2) {
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

    this.canvas = this.gl.canvas
    this.container.appendChild(this.gl.canvas)

    this.resize()
    setTimeout(() => {
      this.resize()
    }, 1000)
  }

  render() {
    let gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.colorMask(true, true, true, true)

    this.renderer.drawCalls = 0

    // Important: PerformanceManager should be updated
    // before render() calls, as doing otherwise might
    // cause black screens on dpr change
    // see: DIG Castles
    this.performanceManager.update()

    for (const scene in this.scenes) {
      if (this.scenes.hasOwnProperty(scene)) {
        const sc = this.scenes[scene]
        if (sc.active === true) {
          sc.scene.render()
          gl.clearColor(sc.scene.clearColor[0], sc.scene.clearColor[1], sc.scene.clearColor[2], sc.scene.clearColor[3])
        }
      }
    }
  }
}

const out = new Manager()
export default out
