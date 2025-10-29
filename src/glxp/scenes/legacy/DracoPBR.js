// Structural
import SceneAbs from '@/glxp/abstract/scene'
import Manifest from '@/glxp/manifest'

// Entities
import PlaneEntity from '@/glxp/entities/Plane'
import MeshPBR from '@/glxp/entities/MeshPBR'

// Post
import Bloom from '@/glxp/postProcess/BloomPass'
import Post from '@/glxp/postProcess/Post'

// Utils
import RAF from '@/glxp/utils/RAF'
import DebugController from '@/glxp/debug/DebugController'
import PBRConfigs from '@/glxp/debug/pbrConfigs'
import GLBLoader from '@/glxp/loaders/GLBLoader'
import GLTFUtils from '@/glxp/utils/GLTFUtils'
import GlobalEmitter from '@/glxp/utils/EventEmitter'

// OGL
import { Transform } from '@/glxp/ogl/core/Transform.js'
import { Camera } from '@/glxp/ogl/core/Camera.js'

// Managers
import CameraManager from '@/glxp/managers/CameraManager'
import DebugGizmoManager from '@/glxp/managers/DebugGizmoManager'

let ANIMATION_LENGTH = 165
const ANIMATION_FPS = 60

class Scene extends SceneAbs {
  constructor(container, manager = null) {
    super(container, manager)

    this.name = 'Draco PBR'

    this.manager = manager
    this.renderer = manager.renderer

    this.time = 0
    this.dt = 0
    this.drawcalls = 0
    this.animFrame = 0
    this.animTime = 0
    this.progress = 0
    this.progressDelta = 0
    this.progressTarget = 0.00001
    this.direction = 1
    this.timescale = 1
    this.forceAllDraw = true

    this.root = new Transform()
    this.UIroot = new Transform()

    this.debugGizmoManager = new DebugGizmoManager(this)
    this.initCameras()

    this.clearColor = this.manager.clearColor
    this.loaded = false
    this.active = false

    this.textureLoader = this.manager.textureLoader

    this.meshes = []
    this.splines = {}
    this.domElements = {}

    this.root.scale.set(1, 1, 1)
    this.UIroot.position.x = -(this.width / this.dpr) / 2
    this.UIroot.position.y = this.height / this.dpr / 2 + window.pageYOffset

    this.config = {
      Pause: { value: false, type: 'bool' },
      time_scale: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
      scroll_damping: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      scroll_speed: { value: 5, params: { min: 0, max: 10, step: 0.1 } },
      reflectionHeight: { value: 1.75, params: { min: 0, max: 10, step: 0.01 } },
      reflectionAlphaMin: { value: 100, params: { min: 0, max: 1000, step: 1 } },
      reflectionAlphaLimit: { value: 1000, params: { min: 0, max: 1000, step: 1 } },
    }

    DebugController.addBlade(this.config, `Global Settings - ${this.name || 'Unknown'}`)

    this.initDummy()
  }

  initCameras() {
    this.cameraManager = new CameraManager(this.gl, {
      width: this.width,
      height: this.height,
      scene: this,
      debug: true,
    })
    this.camera = this.cameraManager.camera

    this.uiCamera = new Camera(this.gl, {
      near: 0.1,
      far: 20,
      left: window.innerWidth / -2,
      right: window.innerWidth / 2,
      bottom: window.innerHeight / -2,
      top: window.innerHeight / 2,
    })
    this.uiCamera.position.z = 10
  }

  initDummy() {
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

  setDomElement(el, id, opt) {
    this.domElements[id] = el
    this.domElements[id].options = opt
  }

  removeDomElement(id) {
    this.domElements[id] = null
  }

  postFirstDraw() {}

  activate() {
    return new Promise((resolve) => {
      this.active = true
      this.activationResolve = resolve
      this.postFirstDraw()
    })
  }

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

    this.cameraManager.addSpline(this.debugGizmoManager.splineEditor.splines['camera'].catmull, 'camera')
    this.cameraManager.addSpline(this.debugGizmoManager.splineEditor.splines['lookat'].catmull, 'lookat')
  }

  async load() {
    let loadables = []

    this.post = new Post(this)

    for (const key in Manifest.main) {
      if (Manifest.main.hasOwnProperty(key)) {
        const element = Manifest.main[key].url
        loadables.push(this.textureLoader.load(element, key, Manifest.main[key].options))
      }
    }

    for (const key in Manifest.dracoPbr) {
      if (Manifest.dracoPbr.hasOwnProperty(key)) {
        const element = Manifest.dracoPbr[key].url
        loadables.push(this.textureLoader.load(element, key, Manifest.dracoPbr[key].options))
      }
    }

    this.PBRConfig = PBRConfigs['CONFIG_0']

    /**
     * GLTF Mesh PBR example
     */
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

  applyDefaultState() {
    let gl = this.gl
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
  }

  // Pre-render
  preRender() {
    let tmp
    tmp = this.progressTarget - this.progress
    this.progressDelta = tmp
    tmp *= this.config.scroll_damping.value

    this.timescale = this.config.time_scale.value

    if (!this.config.Pause.value) {
      this.animTime += (this.dt / 1000) * (((1 / ANIMATION_FPS) * 1000) / this.dt) * this.timescale
      this.animTime = this.animTime % (ANIMATION_LENGTH / ANIMATION_FPS)
      this.animFrame = Math.round((this.animTime / (ANIMATION_LENGTH / ANIMATION_FPS)) * ANIMATION_LENGTH)
    }

    this.direction = this.progress + tmp > this.progress ? 0.0 : -1.0
    this.progress += tmp

    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].preRender()
    }
    this.cameraManager.preRender()
    this.UIroot.updateMatrixWorld(true)
  }

  resize() {
    // this.loader.resize()
    let wW = window.innerWidth
    let wH = window.innerHeight
    this.uiCamera.orthographic({
      near: 0.1,
      far: 10,
      left: wW / -2,
      right: wW / 2,
      bottom: wH / -2,
      top: wH / 2,
    })
    this.UIroot.position.x = -(this.width / this.dpr) / 2
    this.UIroot.position.y = this.height / this.dpr / 2 + window.pageYOffset
    this.cameraManager.resize(this.width, this.height)
  }

  // Render
  render() {
    if (!this.active) {
      return
    }
    let gl = this.gl

    this.time += RAF.dt / 1000
    this.dt = RAF.dt

    this.preRender()

    if (this.meshes.length > 0) {
      gl.viewport(0, 0, this.width, this.height)
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

      this.bloomPass && this.bloomPass.render()
      this.post.render()

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
export default Scene
