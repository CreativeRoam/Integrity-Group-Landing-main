// Structural
import SceneAbs from '@/glxp/abstract/scene'
import Manifest from '@/glxp/manifest'

// Entities
import PlaneEntity from '@/glxp/entities/Plane'
import MeshPBRCelshading from '@/glxp/entities/MeshPBRCelshading'
import SobelOutlines from '@/glxp/entities/addons/SobelOutlines'

// Post
import Bloom from '@/glxp/postProcess/BloomPass'
import PostSobel from '@/glxp/postProcess/PostSobel'

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

// Data
import { GUI_PANEL_PBR } from '@/glxp/data/dataGUIPanels'

class Scene extends SceneAbs {
  constructor(container, manager = null) {
    super(container, manager)

    this.name = 'Celshading'

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
    this.pbrConfig = PBRConfigs['CONFIG_CELSHADING']
    this.debugGizmoManager = new DebugGizmoManager(this)

    this.config = {
      Pause: { value: false, type: 'bool' },
      time_scale: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
      debug: { value: 0, params: { min: 0, max: 0.1, step: 0.0001 } },
      scroll_damping: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      scroll_speed: { value: 5, params: { min: 0, max: 10, step: 0.1 } },
    }

    DebugController.addBlade(this.config, `Global Settings - ${this.name || 'Unknown'}`)

    // Inits
    this.initCameras()
    this.initSobel()
    this.initGround()
  }

  // Inits
  initCameras() {
    this.cameraManager = new CameraManager(this.gl, {
      width: this.width,
      height: this.height,
      scene: this,
      debug: true,
      fov: 35,
    })

    this.camera = this.cameraManager.camera
  }

  initSobel() {
    this.sobel = new SobelOutlines(this, {
      camera: this.camera,
      width: 1024
    })
  }

  initGround() {
    let plane = new PlaneEntity(this, 'grid', {
      scale: 50,
      name: 'DummyPlane',
    })

    plane.mesh.rotation.x = Math.PI / 2
    this.meshes.push(plane)

    this.sobel.add({
      mesh: plane.mesh,
      cast: false,
      occlude: true,
    })
  }

  // Load
  async load() {
    this.post = new PostSobel(this)

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
    addTextureToLoadables('dracoPbr')

    return loadables
  }

  loadModels() {
    const loadables = []

    const url = `${'/'}glxp/models/truck_draco`
    // const url = `${'/'}glxp/models/Dog-draco`
    // const url = `${'/'}glxp/models/Shader-Ball-draco`

    loadables.push(
      new GLBLoader(url + '.glb', true).then((glb) => {
        // Root for PBR model
        const modelRoot = new Transform()
        modelRoot.scale.set(.0075, .0075, .0075)
        // modelRoot.scale.set(.03, .03, .03)
        // modelRoot.scale.set(.2, .2, .2)
        modelRoot.position.set(-2, 0.01, 0)
        modelRoot.setParent(this.root)

        // Build node Tree
        const modelTree = GLTFUtils.buildNodeTree(glb, modelRoot)

        // Mesh List
        const meshList = GLTFUtils.buildMeshList(glb, modelTree)

        // PBR Mesh Instanciation
        let entity
        for (const mesh of meshList) {
          entity = new MeshPBRCelshading(this, {
            id: GUI_PANEL_PBR,
            uid: mesh.meshUid,
            parent: mesh.parent || modelRoot,
            gltf: glb,
            data: mesh.meshData,
            name: mesh.meshName,
            node: mesh.node,
            fog: false,
            transparent: true,
            materialName: 'TruckPBRCelshadingBW',
            material: mesh.material,
            globalConfig: this.pbrConfig,
            textureIds: { celshadingSketch: 'noise_crosshatch' }
          })

          entity.config.ShadowColor.value = '#3369ac'
          entity.config.SketchFrequency.value = 0.75
          entity.config.SketchFalloutShadow.value = 0.45
          entity.config.SketchVisibility.value = 0.2

          this.meshes.push(entity)

          this.sobel.add({
            mesh: entity.mesh,
            cast: true,
          })
        }
      })
    )

    const urlSecond = `${'/'}glxp/models/truck_draco`
    // const urlSecond = `${'/'}glxp/models/Dog-draco`
    // const urlSecond = `${'/'}glxp/models/Shader-Ball-draco`

    loadables.push(
      new GLBLoader(urlSecond + '.glb', true).then((glb) => {
        // Root for PBR model
        const modelRoot = new Transform()
        modelRoot.scale.set(.0075, .0075, .0075)
        // modelRoot.scale.set(.025, .025, .025)
        // modelRoot.scale.set(.2, .2, .2)
        modelRoot.position.set(0, 0, 0)
        modelRoot.setParent(this.root)

        // Build node Tree
        const modelTree = GLTFUtils.buildNodeTree(glb, modelRoot)

        // Mesh List
        const meshList = GLTFUtils.buildMeshList(glb, modelTree)

        // PBR Mesh Instanciation
        let entity
        for (const mesh of meshList) {
          entity = new MeshPBRCelshading(this, {
            id: GUI_PANEL_PBR,
            uid: mesh.meshUid,
            parent: mesh.parent || modelRoot,
            gltf: glb,
            data: mesh.meshData,
            name: mesh.meshName,
            node: mesh.node,
            fog: false,
            transparent: true,
            materialName: 'TruckPBRCelshadingDith',
            material: mesh.material,
            globalConfig: this.pbrConfig,
            textureIds: { celshadingSketch: 'blue_1' }
          })

          entity.config.SketchFrequency.value = 0.75
          entity.config.SketchFalloutSheen.value = 0.3
          entity.config.SketchFalloutShadow.value = 0.5
          entity.config.SketchVisibility.value = 0

          this.meshes.push(entity)

          this.sobel.add({
            mesh: entity.mesh,
            cast: true,
          })
        }
      })
    )

    const urlThird = `${'/'}glxp/models/truck_draco`
    // const urlThird = `${'/'}glxp/models/Dog-draco`
    // const urlThird = `${'/'}glxp/models/Shader-Ball-draco`

    loadables.push(
      new GLBLoader(urlThird + '.glb', true).then((glb) => {
        // Root for PBR model
        const modelRoot = new Transform()
        modelRoot.scale.set(.0075, .0075, .0075)
        // modelRoot.scale.set(.025, .025, .025)
        // modelRoot.scale.set(.2, .2, .2)
        modelRoot.position.set(2, 0, 0)
        modelRoot.setParent(this.root)

        // Build node Tree
        const modelTree = GLTFUtils.buildNodeTree(glb, modelRoot)

        // Mesh List
        const meshList = GLTFUtils.buildMeshList(glb, modelTree)

        // PBR Mesh Instanciation
        let entity
        for (const mesh of meshList) {
          entity = new MeshPBRCelshading(this, {
            id: GUI_PANEL_PBR,
            uid: mesh.meshUid,
            parent: mesh.parent || modelRoot,
            gltf: glb,
            data: mesh.meshData,
            name: mesh.meshName,
            node: mesh.node,
            fog: false,
            transparent: true,
            materialName: 'TruckPBRCelshading',
            material: mesh.material,
            globalConfig: this.pbrConfig,
            textureIds: { celshadingSketch: 'black' }
          })

          entity.config.ShadowColor.value = '#03001c'
          entity.config.ShadowOpacity.value = 0.9
          entity.config.ShadowMultiplyBlend.value = 0.85
          entity.config.SketchFalloutSheen.value = 0

          this.meshes.push(entity)

          this.sobel.add({
            mesh: entity.mesh,
            cast: true,
          })
        }
      })
    )

    return loadables
  }

  // Lifcycle
  applyDefaultState() {
    let gl = this.gl
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
  }

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

  // Events
  onLoaded() {
    this.active = true
    this._emitter.emit('loaded')
    GlobalEmitter.emit('webgl_loaded')

    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].onLoaded()
    }

    // if (this.hasBloom) this.bloomPass = new Bloom(this, this.post)

    this.post.onLoaded()
    DebugController.onLoaded()
    this.debugGizmoManager.onLoaded()
  }

  postFirstDraw() {}

  resize() {
    this.cameraManager.resize(this.width, this.height)
  }

  // Render
  preRender() {
    let tmp
    tmp = this.progressTarget - this.progress
    this.progressDelta = tmp
    tmp *= this.config.scroll_damping.value

    this.timescale = this.config.time_scale.value

    this.progress += tmp

    // Config - Demo
    this.pbrConfig.lightPosition.value.x = Math.cos(this.time) * 5
    this.pbrConfig.lightPosition.value.z = Math.sin(this.time) * 5

    // Meshes
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

    if (this.meshes.length > 0) {
      gl.viewport(0, 0, this.width, this.height)
      this.camera.perspective({ aspect: this.width / this.height })
      this.renderer.setViewport(this.width, this.height)

      // Shadow
      this.sobel.render({ scene: this.root })

      // Render Time
      this.renderer.render({
        scene: this.root,
        camera: this.camera,
        clear: true,
        frustumCull: true,
        sort: true,
        post: this.post,
      })

      // this.bloomPass && this.bloomPass.render()
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
