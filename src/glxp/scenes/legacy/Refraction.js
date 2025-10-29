// Structural
import SceneAbs from '@/glxp/abstract/scene'
import Manifest from '@/glxp/manifest'

// Entities
import PlaneEntity from '@/glxp/entities/Plane'
import MeshRefractionPBR from '@/glxp/entities/MeshRefractionPBR'

// Post
import Bloom from '@/glxp/postProcess/BloomPass'
import Post from '@/glxp/postProcess/Post'

// Loaders
import GLBLoader from '@/glxp/loaders/GLBLoader'

// Utils
import RAF from '@/glxp/utils/RAF'
import DebugController from '@/glxp/debug/DebugController'
import PBRConfigs from '@/glxp/debug/pbrConfigs'
import GlobalEmitter from '@/glxp/utils/EventEmitter'
import GLTFUtils from '@/glxp/utils/GLTFUtils'

// OGL
import { Transform } from '@/glxp/ogl/core/Transform.js'

// Managers
import CameraManager from '@/glxp/managers/CameraManager'
import DebugGizmoManager from '@/glxp/managers/DebugGizmoManager'

class Scene extends SceneAbs {
  constructor(container, manager = null) {
    super(container, manager)

    this.name = 'Refraction'

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

    this.root = new Transform()

    this.debugGizmoManager = new DebugGizmoManager(this)
    this.initCameras()

    this.clearColor = this.manager.clearColor
    this.loaded = false
    this.active = false

    this.textureLoader = this.manager.textureLoader

    this.meshes = []

    this.root.scale.set(1, 1, 1)

    this.config = {
      Pause: { value: false, type: 'bool' },
      time_scale: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
      debug: { value: 0, params: { min: 0, max: 0.1, step: 0.0001 } },
      scroll_damping: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      scroll_speed: { value: 5, params: { min: 0, max: 10, step: 0.1 } },
    }

    DebugController.addBlade(this.config, `Global Settings - ${this.name || 'Unknown'}`)

    this.PBRConfigs = PBRConfigs['CONFIG_0']
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
  }

  initDummy() {
    let plane 
    plane = new PlaneEntity(this, 'grid', {
      scale: 50,
      name: 'DummyPlane',
      cullFace: false
    })
    plane.mesh.rotation.x = Math.PI / 2
    this.meshes.push(plane)

    plane = new PlaneEntity(this, 'unlit', {
      textureId: 'testPng',
      scale: 16,
      name: 'DummyPlane2',
      cullFace: false
    })
    plane.mesh.position.z = -8
    plane.mesh.position.y = 5
    plane.mesh.rotation.y = 0
    this.meshes.push(plane)

    plane = new PlaneEntity(this, 'unlit', {
      textureId: 'testPng',
      scale: 16,
      name: 'DummyPlane2',
      cullFace: false
    })
    // plane.mesh.position.x = -8
    plane.mesh.position.y = 0.01
    plane.mesh.rotation.x = Math.PI/2
    this.meshes.push(plane)
  }

  setProgress(p) {
    this.progressTarget = p
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

    let url

    /**
     * GLTF - Mesh PBR and Mesh Unlit examples
     */
    url = `${'/'}glxp/models/Dog-draco`
    loadables.push(
      new GLBLoader(url + '.glb', true).then((glb) => {
        // console.log(glb);

        // Root for PBR model
        let modelRoot = new Transform()
        modelRoot.scale.set(.025, .025, .025)
        // modelRoot.scale.set(1, 1, 1)
        modelRoot.position.set(0, 0.01, 0)
        modelRoot.setParent(this.root)
        this.crystal = modelRoot

        // Build node Tree
        let modelTree = GLTFUtils.buildNodeTree(glb, modelRoot)

        // Mesh List
        let meshList = GLTFUtils.buildMeshList(glb, modelTree)

        // PBR Mesh Instanciation
        let entity
        for (const mesh of meshList) {
          entity = new MeshRefractionPBR(this, {
            id: 1,
            parent: mesh.parent || modelRoot,
            gltf: glb,
            data: mesh.meshData,
            name: mesh.meshName,
            node: mesh.node,
            fog: false,
            transparent: true,
            materialName: mesh.materialName,
            material: mesh.material,
            globalConfig: this.PBRConfigs,
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

  resize() {
    this.cameraManager.resize(this.width, this.height)
  }

  // Pre-render
  preRender() {
    let tmp
    tmp = this.progressTarget - this.progress
    this.progressDelta = tmp
    tmp *= this.config.scroll_damping.value

    this.timescale = this.config.time_scale.value

    this.progress += tmp

    // this.crystal.rotation.y -= this.dt/2000

    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].preRender()
    }
    this.cameraManager.preRender()
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
        sort: false,
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
