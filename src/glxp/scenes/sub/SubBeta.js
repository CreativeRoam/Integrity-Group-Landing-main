// Structural
import SubsceneAbs from '@/glxp/abstract/subscene'
import Manifest from '@/glxp/manifest'
import ShaderManifest from '@/glxp/shaderManifest'
import Shader from '@/glxp/utils/Shader'

// Entities
import PlaneEntity from '@/glxp/entities/Plane'

// Post
import Bloom from '@/glxp/postProcess/BloomPass'
import Post from '@/glxp/postProcess/Post'

// Utils
import RAF from '@/glxp/utils/RAF'
import DebugController from '@/glxp/debug/DebugController'
import PBRConfigs from '@/glxp/debug/pbrConfigs'

// OGL
import { Transform } from '@/glxp/ogl/core/Transform.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { RenderTarget } from '@/glxp/ogl/core/RenderTarget.js'
import { Box } from '@/glxp/ogl/extras/Box.js'
import { Color } from '@/glxp/ogl/math/Color.js'

// Managers
import CameraManager from '@/glxp/managers/CameraManager'
import DebugGizmoManager from '@/glxp/managers/DebugGizmoManager'

class SceneSubBeta extends SubsceneAbs {
  constructor(container, manager = null, textureLoader, shouldFirstDraw = false) {
    super(container, manager, textureLoader, shouldFirstDraw)

    this.name = 'Sub Beta'

    this.manager = manager
    this.renderer = manager.renderer
    this.textureLoader = textureLoader

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

    // Meshes & Entities
    this.root = new Transform()
    this.root.scale.set(1, 1, 1)
    this.meshes = []

    // Debug
    this.debugGizmoManager = new DebugGizmoManager(this)

    // Config
    this.config = {
      Pause: { value: false, type: 'bool' },
      time_scale: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
      debug: { value: 0, params: { min: 0, max: 0.1, step: 0.0001 } },
      scroll_damping: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      scroll_speed: { value: 5, params: { min: 0, max: 10, step: 0.1 } },
    }

    this.PBRConfigs = PBRConfigs['CONFIG_0']

    // Inits
    this.initCameras()
    this.initRT()
    this.initDummy()
  }

  // Inits
  initRT() {
    this.rt = new RenderTarget(this.gl)
  }

  initCameras() {
    this.cameraManager = new CameraManager(this.gl, {
      width: this.width,
      height: this.height,
      scene: this,
      debug: true,
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

    // Test Box
    const boxGeom = new Box(this.gl)
    const boxShader = new Shader(ShaderManifest['debugUnlit'])
    const boxProgram = new Program(this.gl, {
      vertex: boxShader.vert,
      fragment: boxShader.frag,
      uniforms: {
        uColor: { value: new Color('#0000FF') },
        uAlpha: { value: 1 },
      },
    })
    this.box = new Mesh(this.gl, { geometry: boxGeom, program: boxProgram })
    this.box.position.y = 1
    this.box.setParent(this.root)
  }

  setProgress(p) {
    this.progressTarget = p
  }

  // Lifecycle
  // Check subscene abstract for lifecycle events. They should start with super().
  fetchLoadableTextures() {
    let loadables = []

    this.post = new Post(this)

    for (const key in Manifest.main) {
      if (Manifest.main.hasOwnProperty(key)) {
        const element = Manifest.main[key].url
        loadables.push({ groupKey: 'main', element, key, options: Manifest.main[key].options })
      }
    }

    return loadables
  }

  loadModels() {
    return null
  }

  // Utils
  applyDefaultState() {
    let gl = this.gl
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
  }

  // Events
  onLoaded() {
    // this.active = true
    this._emitter.emit('loaded')

    // First Draw
    if (this.shouldFirstDraw) {
      const firstDrawPromises = this.getFirstDrawPromises()

      this.firstDrawAllPromise = Promise.all(firstDrawPromises).then(() => {
        this.didFirstDraw = true
        // GlobalEmitter.emit('webgl_loaded')
        console.log(`Subscene ${this.name} finished first draw`)
      })
    }

    // Meshes
    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].onLoaded()
    }

    // Post
    if (this.hasBloom) this.bloomPass = new Bloom(this, this.post)
    this.post.onLoaded()

    // Debug
    DebugController.onLoaded()
    this.debugGizmoManager.onLoaded()
  }

  postFirstDraw() {}

  resize() {
    this.cameraManager.resize(this.width, this.height)
    this.rt.setSize(this.width, this.height)
  }

  // Rendering
  preRender() {
    let tmp
    tmp = this.progressTarget - this.progress
    this.progressDelta = tmp
    tmp *= this.config.scroll_damping.value

    this.timescale = this.config.time_scale.value

    this.progress += tmp

    // Meshes
    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].preRender()
    }

    this.box.rotation.x = this.time
    this.box.rotation.y = this.time

    this.cameraManager.preRender()
  }

  render() {
    // First Draw
    if (this.shouldFirstDraw && !this.didFirstDraw) {
      this.drawNextFDMesh()
      return
    }

    if (!this.active) {
      return
    }

    // Timings
    this.time += RAF.dt / 1000
    this.dt = RAF.dt

    // Pre render
    this.preRender()

    if (this.meshes.length > 0) {
      // Aspect
      this.gl.viewport(0, 0, this.width, this.height)
      this.camera.perspective({ aspect: this.width / this.height })
      this.renderer.setViewport(this.width, this.height)

      // Render Time
      this.renderer.render({
        scene: this.root,
        camera: this.camera,
        clear: true,
        frustumCull: true,
        sort: true,
        post: this.post,
      })

      // Post
      this.bloomPass && this.bloomPass.render()
      // Last link of post processing pipeline should render in this.rt, which is fetched from main scene wrapper
      this.post.render({ target: this.rt })

      this.debugGizmoManager.render()

      this.postRender()
    }
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

export default SceneSubBeta
