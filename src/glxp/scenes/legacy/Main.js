// Structural
import SceneAbs from '@/glxp/abstract/scene'
import Manifest from '@/glxp/manifest'

// Entities
import PlaneEntity from '@/glxp/entities/Plane'
import MeshPBR from '@/glxp/entities/MeshPBR'
import MeshUnlit from '@/glxp/entities/MeshUnlit'
import SkinedMeshPBR from '@/glxp/entities/gltf/SkinedMeshPBR'

// Post
import Bloom from '@/glxp/postProcess/BloomPass'
import Post from '@/glxp/postProcess/Post'

// Utils
import RAF from '@/glxp/utils/RAF'
import DebugController from '@/glxp/debug/DebugController'
import PBRConfigs from '@/glxp/debug/pbrConfigs'
import GLTFUtils from '@/glxp/utils/GLTFUtils'
import GlobalEmitter from '@/glxp/utils/EventEmitter'

// Loaders
import FontLoader from '@/glxp/loaders/FontLoader'
import GLBLoader from '@/glxp/loaders/GLBLoader'
import MeshLoader from '@/glxp/loaders/BinaryLoader'
import AnimLoader from '@/glxp/loaders/AnimationLoader'

// Animator
import Animator from '@/glxp/entities/gltf/CharacterAnimation'

// OGL
import { Transform } from '@/glxp/ogl/core/Transform.js'
import { Camera } from '@/glxp/ogl/core/Camera.js'
import { Shadow } from '@/glxp/ogl/extras/Shadow.js'

// Managers
import CameraManager from '@/glxp/managers/CameraManager'
import DebugGizmoManager from '@/glxp/managers/DebugGizmoManager'
import TextManager from '@/glxp/managers/TextManager'

// Data
import { GUI_PANEL_PBR, GUI_PANEL_UNLIT } from '@/glxp/data/dataGUIPanels'

let ANIMATION_LENGTH = 165
const ANIMATION_FPS = 60

class Scene extends SceneAbs {
  constructor(container, manager = null) {
    super(container, manager)

    this.name = 'Main'

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
    this.fontLoader = new FontLoader(this)
    this.textManager = new TextManager(this)

    this.meshes = []
    this.animationPlayer = []
    this.characterAnimators = {}
    this.splines = {}
    this.domElements = {}
    this.animations = {}
    this.texts = {}

    this.root.scale.set(1, 1, 1)
    this.UIroot.position.x = -(this.width / this.dpr) / 2
    this.UIroot.position.y = this.height / this.dpr / 2 + window.pageYOffset

    this.config = {
      Pause: { value: false, type: 'bool' },
      time_scale: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
      debug: { value: 0, params: { min: 0, max: 0.1, step: 0.0001 } },
      scroll_damping: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      scroll_speed: { value: 5, params: { min: 0, max: 10, step: 0.1 } },
      reflectionHeight: { value: 1.75, params: { min: 0, max: 10, step: 0.01 } },
      reflectionAlphaMin: { value: 100, params: { min: 0, max: 1000, step: 1 } },
      reflectionAlphaLimit: { value: 1000, params: { min: 0, max: 1000, step: 1 } },
    }

    DebugController.addBlade(this.config, `Global Settings - ${this.name || 'Unknown'}`)

    this.PBRConfig = PBRConfigs['CONFIG_0']
    this.UnlitConfig = { ...PBRConfigs['CONFIG_0'] }

    this.initShadows()
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

  initShadows() {
    // Swap between the 'fov' and 'left/right/etc' lines to switch from an orthographic to perspective camera,
    // and hence, directional light to spotlight projection.
    this.light = new Camera(this.gl, { left: -5, right: 5, bottom: -6, top: 6, near: 1, far: 20 })

    // Create shadow instance attached to light camera
    this.shadow = new Shadow(this.gl, {
      light: this.light,
      width: 3000,
    })
  }

  initDummy() {
    let plane = new PlaneEntity(this, 'grid', {
      scale: 50,
      hasShadow: true,
      name: 'DummyPlane',
    })
    plane.mesh.rotation.x = Math.PI / 2
    this.meshes.push(plane)
    if (this.shadow) this.shadow.add({ mesh: plane.mesh })
  }

  setProgress(p) {
    this.progressTarget = p
  }

  setDomElement(el, id, opt) {
    this.domElements[id] = el
    this.domElements[id].options = opt3
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

  initTexts() {
    const commonParams = {
      font: 'SofiaProBlack',
      scale: 0.15,
      shaderId: 'MSDFUnlit',
      align: 'left',
      letterSpacing: -0.08,
      lineHeight: 1.2,
      color: '#909090',
    }

    let textIntro1 = this.textManager.create3DText(Object.assign(commonParams, { textContent: 'GLTF PBR \n (Draco)' }))
    textIntro1.rotation.x = -Math.PI / 2
    textIntro1.position.set(-4.5, 0.01, 1.2)
    this.texts['Label1'] = textIntro1

    let textIntro2 = this.textManager.create3DText(Object.assign(commonParams, { textContent: 'GLTF Unlit \n (Draco)' }))
    textIntro2.rotation.x = -Math.PI / 2
    textIntro2.position.set(-2.5, 0.01, 1.2)
    this.texts['Label2'] = textIntro2

    let textIntro3 = this.textManager.create3DText(Object.assign(commonParams, { textContent: 'GLTF Skined \n (Draco)' }))
    textIntro3.rotation.x = -Math.PI / 2
    textIntro3.position.set(-0.5, 0.01, 1.2)
    this.texts['Label3'] = textIntro3

    let textIntro4 = this.textManager.create3DText(Object.assign(commonParams, { textContent: 'Collada/BIN \n PBR' }))
    textIntro4.rotation.x = -Math.PI / 2
    textIntro4.position.set(1.5, 0.01, 1.2)
    this.texts['Label4'] = textIntro4

    let textIntro5 = this.textManager.create3DText(Object.assign(commonParams, { textContent: 'Collada/BIN \n Unlit' }))
    textIntro5.rotation.x = -Math.PI / 2
    textIntro5.position.set(3.5, 0.01, 1.2)
    this.texts['Label5'] = textIntro5
  }

  onLoaded() {
    this.active = true
    this._emitter.emit('loaded')
    GlobalEmitter.emit('webgl_loaded')

    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].onLoaded()
    }

    for (const key in this.characterAnimators) {
      if (Object.hasOwnProperty.call(this.characterAnimators, key)) {
        this.characterAnimators[key].onLoaded()
        this.characterAnimators[key].setAnim('idle')
      }
    }

    if (this.hasBloom) this.bloomPass = new Bloom(this, this.post)
    this.post.onLoaded()
    DebugController.onLoaded()
    this.debugGizmoManager.onLoaded()

    this.initTexts()

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

    /**
     * GLTF - Skinned Mesh PBR Example
     */
    let url = `${'/'}glxp/models/Shader-Ball-Skined-draco`
    loadables.push(
      new GLBLoader(url + '.glb', true).then((glb) => {
        // console.log(glb);

        // Root for model
        let modelRoot = new Transform()
        modelRoot.scale.set(0.15, 0.15, 0.15)
        modelRoot.setParent(this.root)
        this.modelRoot = modelRoot

        // Build node Tree
        let modelTree = GLTFUtils.buildNodeTree(glb)
        let rootNode = modelTree['Base-Joint'].transform

        // Mesh List
        let meshList = GLTFUtils.buildMeshList(glb, modelTree)

        // Character Animator
        let characterAnimator = new Animator(this, modelTree, rootNode)
        this.characterAnimators['Main'] = characterAnimator

        // Mesh Instanciation
        let entity
        for (const mesh of meshList) {
          entity = new SkinedMeshPBR(this, {
            id: GUI_PANEL_PBR,
            parent: modelRoot,
            data: mesh.meshData,
            gltf: glb,
            name: mesh.meshName,
            skinData: mesh.skin,
            rootNode: rootNode,
            modelTree: modelTree,
            node: mesh.node,
            id: 1,
            materialName: mesh.materialName,
            material: mesh.material,
            globalConfig: this.PBRConfig,
          })
          this.meshes.push(entity)
        }
      })
    )

    /**
     * Animation Loading Example
     */
    url = 'glxp/models/Shader-Ball_anims'
    loadables.push(
      new AnimLoader(url + '.json', url + '.bin').then((objs) => {
        GLTFUtils.buildAnimationsPlayers(this, objs)
        this.animations['idle'] = objs
      })
    )

    /**
     * GLTF - Mesh PBR and Mesh Unlit examples
     */
    url = `${'/'}glxp/models/Shader-Ball-draco`
    loadables.push(
      new GLBLoader(url + '.glb', true).then((glb) => {
        // console.log(glb);

        // Root for PBR model
        let modelRoot = new Transform()
        modelRoot.position.x = -4
        modelRoot.scale.set(0.15, 0.15, 0.15)
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
            id: GUI_PANEL_PBR,
            parent: mesh.parent || modelRoot,
            gltf: glb,
            data: mesh.meshData,
            name: mesh.meshName,
            node: mesh.node,
            fog: false,
            transparent: true,
            materialName: mesh.materialName,
            material: mesh.material,
            globalConfig: this.PBRConfig,
            uid: mesh.meshUid,
          })
          this.meshes.push(entity)
        }

        /**
         * IMPORTANT: need to build separate model tree for instanciating other entities from same .glb
         */
        // Root for Unlit model
        let unlitModelRoot = new Transform()
        unlitModelRoot.position.x = -2
        unlitModelRoot.scale.set(0.15, 0.15, 0.15)
        unlitModelRoot.setParent(this.root)

        // Build node Tree
        let unlitModelTree = GLTFUtils.buildNodeTree(glb, unlitModelRoot)

        // Mesh List
        let unlitMeshList = GLTFUtils.buildMeshList(glb, unlitModelTree)

        // Unlit Mesh Instanciation
        let unlitEntity
        for (const mesh of unlitMeshList) {
          unlitEntity = new MeshUnlit(this, mesh.meshData, null, {
            id: GUI_PANEL_UNLIT,
            gltf: glb,
            name: mesh.meshName,
            node: mesh.node,
            parent: mesh.parent || unlitModelRoot,
            material: Manifest.main[mesh.materialName]?.material,
            materialName: 'SB_Unlit',
            globalConfig: this.UnlitConfig,
            fog: false,
          })
          this.meshes.push(unlitEntity)
        }
      })
    )

    /**
     * Collada - Mesh PBR and Mesh Unlit examples
     */
    url = 'glxp/models/Shader-Ball'
    loadables.push(
      new MeshLoader(url + '.json', url + '.bin').then((data) => {
        const neonsRootPBR = new Transform()
        neonsRootPBR.setParent(this.root)
        const neonsRootUnlit = new Transform()
        neonsRootUnlit.setParent(this.root)

        // Root for models
        let modelRootPBR = new Transform()
        modelRootPBR.position.x = 2
        modelRootPBR.scale.set(0.15, 0.15, 0.15)
        modelRootPBR.setParent(this.root)

        let modelRootUnlit = new Transform()
        modelRootUnlit.position.x = 4
        modelRootUnlit.scale.set(0.15, 0.15, 0.15)
        modelRootUnlit.setParent(this.root)

        for (const obj of data) {
          if (obj.type == 'triangle' && obj.name.includes('Shader_Ball__Bin')) {
            // PBR
            let meshPBR = new MeshPBR(this, {
              data: obj,
              id: GUI_PANEL_PBR,
              name: obj.name,
              globalConfig: this.PBRConfig,
              materialName: 'SB_Collada_PBR',
              parent: modelRootPBR,
              fog: false,
            })
            // Need to apply rotations, translations or scales from
            // "obj" manually, as only its' geometry is used in non-gltf MeshPBR
            meshPBR.mesh.rotation.set(obj.rotation[0], obj.rotation[1], obj.rotation[2])
            meshPBR.mesh.scale.set(1)
            this.meshes.push(meshPBR)

            // Unlit
            let meshUnlit = new MeshUnlit(this, obj, null, {
              id: GUI_PANEL_UNLIT,
              name: obj.name,
              globalConfig: this.UnlitConfig,
              materialName: 'SB_Collada_Unlit',
              parent: modelRootUnlit,
              fog: false,
            })
            // Need to apply rotations, translations or scales from
            // "obj" manually, as only its' geometry is used in non-gltf MeshUnlit
            meshUnlit.mesh.rotation.set(obj.rotation[0], obj.rotation[1], obj.rotation[2])
            meshUnlit.mesh.scale.set(1)
            this.meshes.push(meshUnlit)
          }
        }
      })
    )

    // Font Loading
    loadables.push(this.fontLoader.load('SofiaProBlack'))

    Promise.all(loadables).then(() => {
      this.onLoaded()
    })

    let percent = 0
    for (const loadable of loadables) {
      loadable.then(() => {
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
    // this.loader.resize()
    let wW = window.innerWidth
    let wH = window.innerHeight
    this.uiCamera.orthographic({
      // fov: 30
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

  // Pre-render
  preRender() {
    let tmp
    tmp = this.progressTarget - this.progress
    this.progressDelta = tmp
    tmp *= this.config.scroll_damping.value

    this.timescale = this.config.time_scale.value

    if (this.light) {
      this.light.position.set(this.PBRConfig.lightPosition.value.x, this.PBRConfig.lightPosition.value.y, this.PBRConfig.lightPosition.value.z)
      this.light.lookAt([0, 0, 0])
    }

    if (!this.config.Pause.value) {
      this.animTime += (this.dt / 1000) * (((1 / ANIMATION_FPS) * 1000) / this.dt) * this.timescale
      this.animTime = this.animTime % (ANIMATION_LENGTH / ANIMATION_FPS)
      this.animFrame = Math.round((this.animTime / (ANIMATION_LENGTH / ANIMATION_FPS)) * ANIMATION_LENGTH)
    }

    this.direction = this.progress + tmp > this.progress ? 0.0 : -1.0
    this.progress += tmp

    for (const key in this.characterAnimators) {
      if (Object.hasOwnProperty.call(this.characterAnimators, key)) {
        this.characterAnimators[key].update()
      }
    }
    for (let i = 0; i < this.meshes.length; i++) {
      this.meshes[i].preRender()
    }
    this.cameraManager.preRender()
    this.UIroot.updateMatrixWorld(true)
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

      // Shadow
      if (this.shadow) this.shadow.render({ scene: this.root })

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

    for (let i = 0; i < this.animationPlayer.length; i++) {
      this.animationPlayer[i].invalidate()
    }

    if (this.forceAllDraw && this.drawcalls > 40) {
      this.forceAllDraw = false
      this.activationResolve()
    }
  }
}
export default Scene
