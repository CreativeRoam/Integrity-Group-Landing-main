// Structural
import SubsceneAbs from '@/glxp/abstract/subscene'
import Manifest from '@/glxp/manifest'
import GLBLoader from '@/glxp/loaders/GLBLoader'

// Entities
import MeshPBR from '@/glxp/entities/MeshPBR'
import PlaneEntity from '@/glxp/entities/Plane'

// Post
import Bloom from '@/glxp/postProcess/BloomPass'
import Post from '@/glxp/postProcess/Post'

// Utils
import RAF from '@/glxp/utils/RAF'
import DebugController from '@/glxp/debug/DebugController'
import PBRConfigs from '@/glxp/debug/pbrConfigs'
import GLTFUtils from '@/glxp/utils/GLTFUtils'

// OGL
import { Transform } from '@/glxp/ogl/core/Transform.js'
import { RenderTarget } from '@/glxp/ogl/core/RenderTarget.js'

// Managers
import CameraManager from '@/glxp/managers/CameraManager'
import DebugGizmoManager from '@/glxp/managers/DebugGizmoManager'

class SceneSubCharlie extends SubsceneAbs {
  constructor(container, manager = null, textureLoader, shouldFirstDraw = false) {
    super(container, manager, textureLoader, shouldFirstDraw)

    this.name = 'Sub Charlie'

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
    this.initGround()
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

    // this.camera.position.set(6, 0, 3)
    // this.camera.lookAt(0, 0, 0)
  }

  initGround() {
    let plane = new PlaneEntity(this, 'grid', {
      scale: 50,
      name: 'DummyPlane',
    })
    plane.mesh.rotation.x = Math.PI / 2
    this.meshes.push(plane)
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

    for (const key in Manifest.dracoPbr) {
      if (Manifest.dracoPbr.hasOwnProperty(key)) {
        const element = Manifest.dracoPbr[key].url
        loadables.push({ groupKey: 'dracoPbr', element, key, options: Manifest.dracoPbr[key].options })
      }
    }

    return loadables
  }

  loadModels() {
    const loadables = []

    this.PBRConfig = PBRConfigs['CONFIG_0']

    let url = `${'/'}glxp/models/truck_draco`
    loadables.push(
      new GLBLoader(url + '.glb', true).then((glb) => {
        // console.log(glb);

        // Root for PBR model
        let modelRoot = new Transform()
        modelRoot.scale.set(0.015, 0.015, 0.015)
        modelRoot.setParent(this.root)

        // Build node Tree
        let modelTree = GLTFUtils.buildNodeTree(glb, modelRoot)

        // Mesh List
        let meshList = GLTFUtils.buildMeshList(glb, modelTree)

        // PBR Mesh Instanciation
        let entity
        for (const mesh of meshList) {
          // console.log(mesh);
          entity = new MeshPBR(this, {
            id: 1,
            parent: mesh.parent || modelRoot,
            gltf: glb,
            data: mesh.meshData,
            name: mesh.meshName,
            node: mesh.node,
            fog: true,
            transparent: mesh.meshName.includes('glass'),
            materialName: mesh.materialName,
            material: mesh.material,
            globalConfig: this.PBRConfig,
            uid: mesh.meshUid,
          })
          this.meshes.push(entity)
        }
      })
    )

    return loadables
  }

  // Utils
  applyDefaultState() {
    let gl = this.gl
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
  }

  setShipTransforms() {
    this.ship.position.set(0, -1, 0)
    this.ship.rotation.set(Math.PI * 0.4, 0, 0)
    this.ship.scale.set(0.02, 0.02, 0.02)
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

    // this.ship.rotation.x += 0.01

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

export default SceneSubCharlie
