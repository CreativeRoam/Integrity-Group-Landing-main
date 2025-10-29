// Structural
import SceneAbs from '@/glxp/abstract/scene'
import Manifest from '@/glxp/manifest'

// Entities
import PlaneEntity from '@/glxp/entities/Plane'
import MeshUnlit from '@/glxp/entities/MeshUnlit'

// Post
import Bloom from '@/glxp/postProcess/BloomPass'
import Post from '@/glxp/postProcess/Post'

// Utils
import RAF from '@/glxp/utils/RAF'
import DebugController from '@/glxp/debug/DebugController'
import PBRConfigs from '@/glxp/debug/pbrConfigs'
import GlobalEmitter from '@/glxp/utils/EventEmitter'
import GLTFUtils from '@/glxp/utils/GLTFUtils'

import GLBLoader from '@/glxp/loaders/GLBLoader'

// OGL
import { Transform } from '@/glxp/ogl/core/Transform.js'

// Managers
import CameraManager from '@/glxp/managers/CameraManager'
import DebugGizmoManager from '@/glxp/managers/DebugGizmoManager'

import { GUI_PANEL_UNLIT } from '@/glxp/data/dataGUIPanels'

class Scene extends SceneAbs {
  constructor(container, manager = null) {
    super(container, manager)

    this.name = 'GLTF Hierarchy'

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

    this.UnlitConfig = { ...PBRConfigs['CONFIG_0'] }

    // Meshes
    this.root = new Transform()
    this.root.scale.set(1, 1, 1)
    this.meshes = []

    // Loaders
    this.textureLoader = this.manager.textureLoader

    // Config & Debug
    this.debugGizmoManager = new DebugGizmoManager(this)

    this.config = {
      Pause: { value: false, type: 'bool' },
      time_scale: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
      debug: { value: 0, params: { min: 0, max: 0.1, step: 0.0001 } },
      scroll_damping: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      scroll_speed: { value: 5, params: { min: 0, max: 10, step: 0.1 } },
    }

    DebugController.addBlade(this.config, `Global Settings - ${this.name || 'Unknown'}`)

    this.PBRConfigs = PBRConfigs['CONFIG_0']

    // Inits
    this.initCameras()
    this.initDummy()
  }

  // Inits
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

    /**
     * GLTF - Mesh PBR and Mesh Unlit examples
     */
    let url = `${'/'}glxp/models/parenting`
    loadables.push(
      new GLBLoader(url + '.glb', true).then((glb) => {
        console.log(glb);

        /**
         * IMPORTANT: need to build separate model tree for instanciating other entities from same .glb
         */
        // Root for Unlit model
        let modelRoot = new Transform()
        modelRoot.setParent(this.root)

        // Build node Tree
        let modelTree = GLTFUtils.buildNodeTree(glb, modelRoot) // THIS ADDS TRANSFORMS TO UNLIT MODEL ROOT

        // Mesh List
        let meshList = GLTFUtils.buildMeshList(glb, modelTree)

        this.gltfEntities = []

        // Unlit Mesh Instanciation
        let entity
        for (const mesh of meshList) {
          entity = new MeshUnlit(this, mesh.meshData, null, {
            id: GUI_PANEL_UNLIT,
            gltf: glb,
            name: mesh.meshName,
            node: mesh.node,
            parent: mesh.parent || modelRoot,
            material: Manifest.main[mesh.materialName]?.material,
            materialName: 'SB_Unlit',
            globalConfig: this.UnlitConfig,
            fog: false,
          })

          this.meshes.push(entity)

          this.gltfEntities.push(entity)
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

    DebugController.addHierarchyPane(this.root)

    console.log({ target: this.gltfEntities[1] });
  }

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

    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].preRender()
    }
    this.cameraManager.preRender()

    this.gltfEntities[1].mesh.position.y = Math.sin(this.time) + 2
    this.gltfEntities[1].mesh.rotation.y += 0.01

    DebugController.hierarchyPane.refresh()
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
