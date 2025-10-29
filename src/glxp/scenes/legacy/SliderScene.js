// Structural
import SceneAbs from '@/glxp/abstract/scene'
import Manifest from '@/glxp/manifest'

// Entities
import PlaneEntity from '@/glxp/entities/Plane'

// Post
import Bloom from '@/glxp/postProcess/BloomPass'
import Post from '@/glxp/postProcess/Post'

// Utils
import RAF from '@/glxp/utils/RAF'
import DebugController from '@/glxp/debug/DebugController'
import PBRConfigs from '@/glxp/debug/pbrConfigs'
import GlobalEmitter from '@/glxp/utils/EventEmitter'

// OGL
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { Transform } from '@/glxp/ogl/core/Transform.js'

// Managers
import CameraManager from '@/glxp/managers/CameraManager'
import DebugGizmoManager from '@/glxp/managers/DebugGizmoManager'
import Slider from '../entities/Slider'

class Scene extends SceneAbs {
  constructor(container, manager = null) {
    super(container, manager)

    this.name = 'Minimal'

    this.manager = manager
    this.renderer = manager.renderer

    this.time = 0
    this.dt = 0
    this.drawcalls = 0
    this.progress = 0
    this.progressDelta = 0
    this.progressTarget = 0.00001
    this.timescale = 1
    this.forceAllDraw = true

    this.clearColor = this.manager.clearColor
    this.loaded = false
    this.active = false

    // Meshes
    this.root = new Transform()
    this.root.scale.set(1, 1, 1)
    this.meshes = []

    // Loaders
    this.textureLoader = this.manager.textureLoader

    // Config & Debug
    this.debugGizmoManager = new DebugGizmoManager(this)

    this.config = {
      TimeScale: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
    }

    DebugController.addBlade(this.config, `Global Settings - ${this.name || 'Unknown'}`)

    this.PBRConfigs = PBRConfigs['CONFIG_0']

    this.initCameras()
    this.initDummy()
    this.initSlider()

    this.addEvents()
  }

  // Inits
  initCameras() {
    this.cameraManager = new CameraManager(this.gl, {
      width: this.width,
      height: this.height,
      scene: this,
      debug: true,
      frontFacing: true,
    })
    this.camera = this.cameraManager.camera
  }

  initDummy() {
    let plane = new PlaneEntity(this, 'grid', {
      scale: 50,
      name: 'DummyPlane',
    })
    plane.mesh.rotation.x = Math.PI / 2
    this.meshes.push(plane)
  }

  initSlider() {
    this.slider = new Slider(this, {})
    this.slider.root.position.x = -3
    this.slider.root.position.y = 1
    this.meshes.push(this.slider)
  }

  // Lifecycle
  setProgress(p) {
    this.progressTarget = p
  }

  activate() {
    return new Promise((resolve) => {
      this.active = true
      this.activationResolve = resolve
      this.postFirstDraw()
    })
  }

  async load() {
    this.post = new Post(this)

    let loadables = []

    loadables = [...loadables, ...this.loadTextures()]
    loadables = [...loadables, ...this.loadModels()]

    Promise.all(loadables).then(() => {
      this.onLoaded()
    })

    let percent = 0
    for (let i = 0; i < loadables.length; i++) {
      loadables[i].then(() => {
        percent++
        const formatedVal = Math.round((percent / loadables.length) * 100)
        this._emitter.emit('progress', formatedVal)
        GlobalEmitter.emit('loading_progress', { progress: formatedVal })
      })
    }
  }

  loadTextures() {
    const loadables = []

    const addTextureToLoadables = (groupKey) => {
      for (const key in Manifest[groupKey]) {
        if (Manifest[groupKey].hasOwnProperty(key)) {
          const element = Manifest[groupKey][key]
          loadables.push(this.textureLoader.load(element.url, key, element.options))
        }
      }
    }

    addTextureToLoadables('main')
    addTextureToLoadables('slides')

    return loadables
  }

  loadModels() {
    const loadables = []

    return loadables
  }

  applyDefaultState() {
    let gl = this.gl
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
  }

  // Events
  postFirstDraw() { }

  onLoaded() {
    this.active = true
    this._emitter.emit('loaded')
    GlobalEmitter.emit('webgl_loaded')

    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].onLoaded()
    }

    if (this.hasBloom) this.bloomPass = new Bloom(this, this.post)
    this.post.onLoaded()
    DebugController.onLoaded()
    this.debugGizmoManager.onLoaded()
  }

  resize() {
    this.cameraManager.resize(this.width, this.height)
  }

  // Increment slider active index
  onKeydown = (e) => {
    let index = 0

    switch (e.key) {
      case "ArrowRight":
        {
          index = (this.slider.state.activeIndex + 1) % this.slider.slides.length
        }
        break;

      case "ArrowLeft":
        {
          this.slider.state.activeIndex - 1 < 0 ? index = this.slider.slides.length - 1 : index = (this.slider.state.activeIndex - 1) % this.slider.slides.length
        }
        break

      default:
        break;
    }

    this.slider.state.activeIndex = Math.abs(index)
  }

  addEvents = () => {
    window.addEventListener('keydown', this.onKeydown)
  }

  // Render
  preRender() {
    this.timescale = this.config.TimeScale.value

    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].preRender()
    }
    this.cameraManager.preRender()
  }

  render() {
    if (!this.active) {
      return
    }
    let gl = this.gl

    this.time += RAF.dt / 1000
    this.dt = RAF.dt

    this.preRender()

    gl.viewport(0, 0, this.width, this.height)
    this.camera.perspective({ aspect: this.width / this.height })
    this.renderer.setViewport(this.width, this.height)

    // Render Time
    this.renderer.render({
      scene: this.root,
      camera: this.camera,
      clear: true,
      frustumCull: true,
      sort: false,
      post: this.post,
    })

    this.bloomPass && this.bloomPass.render()
    this.post.render()

    this.debugGizmoManager.render()

    this.postRender()
  }

  postRender() {
    this.gl.viewport(0, 0, this.width, this.height)
    this.drawcalls++

    if (this.forceAllDraw && this.drawcalls > 40) {
      this.forceAllDraw = false
      this.activationResolve()
    }
  }
}

export default Scene
