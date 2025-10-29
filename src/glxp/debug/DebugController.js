import Emitter from 'event-emitter'

// Config
import Config from './config'

// Utils
import RAF from '@/glxp/utils/RAF'
import { isSmartphonePortrait } from '@/glxp/utils/device'

// Data
import { GUI_PANEL_GENERAL } from '@/glxp/data/dataGUIPanels'

// Firebase
// uncomment Firebase stuff during dev and QA, it's not needed in production
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, set, onValue } from "firebase/database";

// IMPORTANT : this is 'realtime database', not 'firestore', and
// put database"URL" IN ALL CAPS
// const firebaseConfig = {
//   apiKey: "YcRuVWdnJUgcFNYRyNC5ddKeN4Je7jWz1ZGXawTf",
//   authDomain: "dogstudio-internal.firebaseapp.com",
//   // databaseURL: "https://[CHANGE_ME].firebaseio.com/",
//   databaseURL: "https://dogstudio-internal-default-rtdb.firebaseio.com/",
//   projectId: "dogstudio-internal",
//   // storageBucket: "dogstudio-internal.appspot.com", // What's this
//   messagingSenderId: "515142485634",
//   // appId: "1:515142485634:web:272b73f7b8946e9dc7fecc" // What's this
// }
const firebaseConfig = null

let EssentialsPlugin
let Pane

class DebugController {
  constructor() {
    this.active = this.queryDebug()
    // this.active = true

    this.tweakpaneIsLoaded = false
    this.guiIsReady = this.active ? false : true
    this.bladesQueue = []
    this.config = {}
    this.backupConfig = {} // Stored config after first init, used for reset
    this.networkConfigs = {} // Network configs. Object containing multiple configs.
    this.inputs = {}
    this.folders = {}
    this.webglManager = null

    this._emitter = {}
    Emitter(this._emitter)
    this.on = this._emitter.on.bind(this._emitter)

    if (this.active) {
      this.lazyloadTweakpaneThenInit()
      this.addEventListeners()
    }
  }

  setManager(manager) {
    this.webglManager = manager
  }

  lazyloadTweakpaneThenInit() {
    const promiseTweakpane = import('tweakpane')
    const promiseEssentials = import('@tweakpane/plugin-essentials')

    Promise.all([promiseTweakpane, promiseEssentials]).then((packages) => {
      Pane = packages[0].Pane
      EssentialsPlugin = packages[1]
      this.tweakpaneIsLoaded = true

      this.init()

      // Panel positions
      this.responsivePanePosition()
      window.addEventListener('resize', this.responsivePanePosition.bind(this), { passive: false })

      // create the blades stored in the bladesQueue
      for (let i = 0; i < this.bladesQueue.length; i++) {
        const params = this.bladesQueue[i]
        this.addBladeConfigActive(params.config, params.id, params.tabId)
      }
      this.bladesQueue = []
      this._emitter.emit('gui-lazyloaded')
      this.guiIsReady = true
    })
  }

  init() {
    // PANELS - Configs
    this.pane = new Pane({
      title: 'Debug UI',
      expanded: !isSmartphonePortrait,
    })
    this.pane.hidden = !this.active || this.queryDebug('demo')
    this.addPositionBlade(this.pane, 'top right')
    this.updatePanesPosition(this.pane)
    this.pane.element.classList.add('debug-pane', 'debug-pane--config')

    // PANELS - Scenes
    this.scenePane = new Pane({
      title: 'Scene Controller',
      expanded: !isSmartphonePortrait,
    })
    this.scenePane.hidden = !this.active
    this.addPositionBlade(this.scenePane, 'top left')
    this.updatePanesPosition(this.scenePane)
    this.scenePane.element.classList.add('debug-pane', 'debug-pane--scene')

    const urlParams = new URLSearchParams(window.location.search)
    let sceneSelector = this.scenePane.addBlade({
      view: 'list',
      label: 'Scene to load',
      options: [
        { text: 'main', value: 'main' },
        { text: 'carpaint', value: 'carpaint' },
        { text: 'pbr', value: 'pbr' },
        { text: 'subParent', value: 'subParent' },
        { text: 'minimal', value: 'minimal' },
        { text: 'refraction', value: 'refraction' },
        { text: 'celshading', value: 'celshading' },
        { text: 'gltfAnimation', value: 'gltfAnimation' },
        { text: 'flares', value: 'flares' },
        { text: 'particles', value: 'particles' },
        { text: 'rays', value: 'rays' },
        { text: 'gltfHierarchy', value: 'gltfHierarchy' }
      ],
      value: urlParams.has('scene') ? urlParams.get('scene') : 'main',
    })
    sceneSelector.on('change', (ev) => {
      urlParams.set('scene', ev.value)
      window.location.href = '/?' + urlParams.toString()
    })

    // PANELS - Firebase
    if (firebaseConfig) { this.initNetwork() }

    this.pane.registerPlugin(EssentialsPlugin)
    this.fpsGraph = this.pane.addBlade({
      view: 'fpsgraph',
      label: 'FPS',
      lineCount: 2,
    })
    RAF.onBefore = this.fpsGraph.begin.bind(this.fpsGraph)
    RAF.onAfter = this.fpsGraph.end.bind(this.fpsGraph)

    this.tab = this.pane.addTab({
      pages: [
        { title: 'General' },
        { title: 'Mat - Custom' }
      ],
    })

    document.head.insertAdjacentHTML(
      'beforeend',
      `<style>
      :root {
        --tp-base-background-color: hsla(0, 0%, 10%, 0.975);
        --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
        --tp-button-background-color: hsla(0, 0%, 80%, 1);
        --tp-button-background-color-active: hsla(0, 0%, 100%, 1);
        --tp-button-background-color-focus: hsla(0, 0%, 95%, 1);
        --tp-button-background-color-hover: hsla(0, 0%, 85%, 1);
        --tp-button-foreground-color: hsla(0, 0%, 0%, 0.8);
        --tp-container-background-color: hsla(0, 0%, 0%, 0.3);
        --tp-container-background-color-active: hsla(0, 0%, 0%, 0.6);
        --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.5);
        --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.4);
        --tp-container-foreground-color: hsla(0, 0%, 100%, 0.5);
        --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.2);
        --tp-input-background-color: hsla(0, 0%, 0%, 0.3);
        --tp-input-background-color-active: hsla(0, 0%, 0%, 0.6);
        --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5);
        --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4);
        --tp-input-foreground-color: hsla(0, 0%, 100%, 0.5);
        --tp-label-foreground-color: hsla(0, 0%, 100%, 0.5);
        --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
        --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3);
      }
      .tp-dfwv {
        position: fixed;
        width: 350px !important;
        max-width: 95%;
        z-index: 10001;
        max-height: calc(100vh - 8px);
        overflow-y: auto;
        overflox-x: hidden;
      }
      .tp-dfwv:has(.debug-pane--config) {
        width: 550px !important;
      }
      </style>`
    )

    this.pane.containerElem_.addEventListener('mouseenter', () => {
      this._emitter.emit('drag-prevent')
    })
    this.pane.containerElem_.addEventListener('mouseleave', () => {
      this._emitter.emit('drag-unprevent')
    })
    this.scenePane.containerElem_.addEventListener('mouseenter', () => {
      this._emitter.emit('drag-prevent')
    })
    this.scenePane.containerElem_.addEventListener('mouseleave', () => {
      this._emitter.emit('drag-unprevent')
    })
  }

  loopChildren = (children, collection) => {
    children.forEach((transform) => {
      if (!transform.name) transform.name = "Unnamed"

      let folder = null
      
      if (transform.parent) {
        // Add to parent
        folder = collection.get(transform.parent.id).addFolder({
          title: `${transform.name} - ID:${transform.id}`,
          expanded: false,
        })
      } else {
        // Add to root
        folder = collection.get(root.id).addFolder({
          title: `${transform.name} - ID:${transform.id}`,
          expanded: true,
        })
      }

      folder.addBinding(transform, 'visible')
      folder.addBinding(transform, 'position')
      folder.addBinding(transform, 'rotation')
      folder.addBinding(transform, 'scale')
      collection.set(transform.id, folder)

      if (transform.children.length) {
        this.loopChildren(transform.children, collection);
      }
    })
  }
  addHierarchyPane = (root) => {
    console.log({ root });

    this.hierarchyPane = new Pane({
      title: 'Hierarchy',
    })
    this.hierarchyPane.hidden = !this.active
    this.addPositionBlade(this.hierarchyPane, this.networkPane ? 'bottom right' : 'bottom left')
    this.updatePanesPosition(this.hierarchyPane)
    this.hierarchyPane.element.classList.add('debug-pane', 'debug-pane--hierarchy')

    root.name = "Root"

    const transformFoldersCollection = new Map()

    const rootFolder = this.hierarchyPane.addFolder({
      title: root.name,
      expanded: true,
    })
    transformFoldersCollection.set(root.id, rootFolder)

    this.loopChildren(root.children, transformFoldersCollection)
  }

  /**
   * Position pane in top right corner, etc
   * @param {Pane} pane
   */
  addPositionBlade = (pane, value) => {
    pane.position = value

    pane
      .addBlade({
        view: 'list',
        label: 'position',
        options: [
          { text: 'top right', value: 'top right' },
          { text: 'top left', value: 'top left' },
          { text: 'bottom right', value: 'bottom right' },
          { text: 'bottom left', value: 'bottom left' },
        ],
        value,
      })
      .on('change', (e) => {
        this.updatePanesPosition(pane, e.value)
      })
  }

  updatePanesPosition(pane, newPosition = null) {
    if (newPosition) pane.position = newPosition

    switch (pane.position) {
      case 'top right':
        pane.element.parentNode.style.top = '8px'
        pane.element.parentNode.style.right = '8px'
        pane.element.parentNode.style.bottom = 'auto'
        pane.element.parentNode.style.left = 'auto'
        break
      case 'top left':
        pane.element.parentNode.style.top = '8px'
        pane.element.parentNode.style.right = 'auto'
        pane.element.parentNode.style.bottom = 'auto'
        pane.element.parentNode.style.left = '8px'
        break
      case 'bottom right':
        pane.element.parentNode.style.top = 'auto'
        pane.element.parentNode.style.right = '8px'
        pane.element.parentNode.style.bottom = '8px'
        pane.element.parentNode.style.left = 'auto'
        break
      case 'bottom left':
        pane.element.parentNode.style.top = 'auto'
        pane.element.parentNode.style.right = 'auto'
        pane.element.parentNode.style.bottom = '8px'
        pane.element.parentNode.style.left = '8px'
        break
    }
  }

  responsivePanePosition() {
    // on mobile, move to bottom
    if (isSmartphonePortrait) {
      this.scenePane.containerElem_.style.top = 'auto'
      this.scenePane.containerElem_.style.bottom = '8px'
    }
  }

  queryDebug(name = 'dev') {
    let url = window.location.href
    name = name.replace(/[[]]/g, '\\$&')

    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    var results = regex.exec(url)
    if (results) {
      return decodeURIComponent(results[2].replace(/\+/g, ' ')) === 'true'
    }
    return false
  }

  initNetwork() {
    this.networkIsOnline = false
    this.networkInputs = {}
    this.networkParams = {
      status: '🔴 offline',
      name: localStorage.getItem('firebase-gui-name') || '',
      'config-list': [],
    }

    this.networkPane = new Pane({
      title: 'Network',
      expanded: !isSmartphonePortrait,
    })
    this.networkPane.hidden = !this.active || this.queryDebug('demo')
    this.addPositionBlade(this.networkPane, 'bottom left')
    this.updatePanesPosition(this.networkPane)

    this.networkPane.addBinding(this.networkParams, 'status', {
      multiline: false,
      lineCount: 1,
    })

    this.networkPane.addBlade({ view: 'separator' })

    this.networkInputs['list'] = this.networkPane.addBlade({
      view: 'list',
      label: 'presets',
      options: this.networkParams['config-list'],
      value: 'none',
    })
    this.networkPane.addBlade({ view: 'separator' })
    this.networkInputs['sync'] = this.networkPane.addButton({ title: 'Sync' })
    this.networkInputs['dump'] = this.networkPane.addButton({ title: 'Dump' })
    this.networkPane.addBlade({ view: 'separator' })
    this.networkInputs['name'] = this.networkPane.addBinding(this.networkParams, 'name')
    this.networkInputs['save'] = this.networkPane.addButton({ title: 'Save' })

    // Initialize Firebase

    this.firebase = initializeApp(firebaseConfig)
    this.initNetworkEvents()
    this.updateNetworkStatus()
  }

  // TODO: For now pretty hacky way to remove gsap objects while avoiding tweakpan dom nodes
  // Needed to remove cyclical objects before json stringify
  removeSpecificKey = (obj, key = '') => {
    if (obj[key] !== undefined) {
      delete obj[key]
    }

    for (let subObj in obj) {
      if (obj[subObj] !== null && typeof obj[subObj] === 'object' && obj[subObj].nodeType !== 1) {
        this.removeSpecificKey(obj[subObj], key)
      }
    }
  }

  dump() {
    this.removeSpecificKey(this.config, '_gsap')

    console.log(this.config)
    console.log(JSON.stringify(this.config))
  }

  initNetworkEvents() {
    this.networkInputs['name'].on('change', (evt) => {
      localStorage.setItem('firebase-gui-name', evt.value)
    })

    this.networkInputs['dump'].on('click', () => {
      this._emitter.emit('beforeSave')
      this.dump()
    })
    this.networkInputs['save'].on('click', () => {
      this._emitter.emit('beforeSave')

      if (this.networkParams.name == '') {
        alert('Please fill a name in Network GUI')
        return
      }

      this.removeSpecificKey(this.config, '_gsap')

      // Sanitize name and append date
      const configName = `${this.networkParams.name.replace(/[.\/#$\[\]]+/g, '_')}___${new Date().toUTCString().replaceAll(',', '').replaceAll(' ', '-')}`
      console.log('saving', configName)
      const db = getDatabase()
      console.log(this.config)
      set(ref(db, 'configs/' + configName), this.config).then(() => {
        this.refreshNetwork()
      })
    })
    this.networkInputs['sync'].on('click', () => {
      this.refreshNetwork()
    })
  }

  refreshNetwork() {
    const db = getDatabase()
    const starCountRef = ref(db, 'configs/')
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val()
      this.networkConfigs = data
      this.networkParams['config-list'].length = 0
      this.networkParams['config-list'].push({ text: 'current', value: null })
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          this.networkParams['config-list'].push({ text: key, value: key })
        }
      }

      this.networkInputs['list'].dispose()
      this.networkInputs['list'] = this.networkPane.addBlade({
        view: 'list',
        label: 'presets',
        index: 1,
        options: this.networkParams['config-list'],
        value: 'none',
      })
      this.networkInputs['list'].on('change', (evt) => {
        this.applyConfig(evt.value)
      })
      setTimeout(() => {
        this.networkPane.refresh()
      }, 200)
    })
  }

  updateNetworkStatus() {
    const db = getDatabase()
    const connectedRef = ref(db, '.info/connected')
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        this.networkIsOnline = true
        console.log('GUI connected')
        this.refreshNetwork()
        this.networkParams['status'] = '🟢 online'
      } else {
        this.networkIsOnline = false
        console.log('GUI not connected')
      }
      this.networkInputs['sync'].disabled = !this.networkIsOnline
      this.networkInputs['dump'].disabled = !this.networkIsOnline
      this.networkInputs['save'].disabled = !this.networkIsOnline
      this.networkPane.refresh()
    })
  }

  applyConfig(id) {
    for (const key in this.networkConfigs[id]) {
      if (Object.hasOwnProperty.call(this.networkConfigs[id], key)) {
        const folder = this.networkConfigs[id][key]
        if (this.config[key]) {
          const configFolder = this.config[key]
          for (const key in folder) {
            if (Object.hasOwnProperty.call(folder, key)) {
              const param = folder[key]
              if (configFolder[key]) {
                const configParam = configFolder[key]
                configParam.value = param.value
              }
            }
          }
        }
      }
    }

    // if (config["_SplinesEditorData"]) {
    //   this.config["_SplinesEditorData"] = this.networkConfigs[id]["_SplinesEditorData"]
    // }

    this.refreshGUI()
    this._emitter.emit('updateConfig')
  }

  applyConfigFile(config) {
    for (const key in config) {
      if (Object.hasOwnProperty.call(config, key)) {
        const folder = config[key]
        if (this.config[key]) {
          const configFolder = this.config[key]
          for (const key in folder) {
            if (Object.hasOwnProperty.call(folder, key)) {
              const param = folder[key]
              if (configFolder[key]) {
                const configParam = configFolder[key]
                configParam.value = param.value
              }
            }
          }
        }
      }
    }

    if (config['_SplinesEditorData']) {
      this.config['_SplinesEditorData'] = config['_SplinesEditorData']
    }

    this.refreshGUI()
    this._emitter.emit('updateConfig')
  }

  applyConfigSpecificFolder(configToApply, folderKey) {
    const currentFolder = this.config[folderKey]
    const appliedFolder = configToApply[folderKey]

    // Check if target and to be applied folders exist
    if (currentFolder && appliedFolder) {
      // Traverse all params of the current folder
      for (const paramKey in currentFolder) {
        if (Object.hasOwnProperty.call(currentFolder, paramKey)) {
          const currentParam = currentFolder[paramKey]
          const appliedParam = appliedFolder[paramKey]

          // If to be applied folder has a corresponding param, copy value
          if (appliedParam) {
            currentParam.value = appliedParam.value
          }
        }
      }
    }

    this.refreshGUI()
    this._emitter.emit('updateConfig')
  }

  refreshGUI() {
    if (this.pane) {
      for (const folderKey in this.folders) {
        this.folders[folderKey].refresh()
      }
      this.pane.refresh()
    }
  }

  // EVENTS
  addEventListeners() {
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyUp({ key }) {
    // show/hide GUI when pressing 'h' on keyboard
    if (key && (key === 'h' || key === 'H')) {
      if (this.pane) this.pane.hidden = !this.pane.hidden
      if (this.scenePane) this.scenePane.hidden = !this.scenePane.hidden
      if (this.networkPane) this.networkPane.hidden = !this.networkPane.hidden
    }
  }

  onLoaded() {
    this.applyConfigFile(Config)
  }

  addConfig() { }

  addBladeScene(config, id) {
    return this.addBlade(config, id, 'scene')
  }

  addBlade(config, id, tabId = GUI_PANEL_GENERAL) {
    // Search for config params but only generate gui element if dev mode is active
    if (this.active) {
      if (this.tweakpaneIsLoaded) {
        // if tweakpane is loaded, return the blade inputs
        return this.addBladeConfigActive(config, id, tabId)
      } else {
        // otherwise add it to the queue to create it later
        this.bladesQueue.push({ config, id, tabId })
        return null
      }
    } else {
      this.addBladeConfigInactive(config, id, tabId)
      return null
    }
  }

  addBladeConfigActive(config, id, tabId = GUI_PANEL_GENERAL) {
    // Specific folder when using 'addBladeScene' instead of 'addBlade'
    const parentFolder = tabId === 'scene' ? this.scenePane : this.tab.pages[tabId]

    // Create folder
    this.folders[id] = parentFolder.addFolder({
      title: id,
      expanded: false,
    })

    // Add config inputs
    let params = {}
    this.inputs[id] = {}
    for (const key in config) {
      if (Object.hasOwnProperty.call(config, key)) {
        const el = config[key]
        if (el.type == 'bool') {
          this.folders[id].addBinding(el, 'value', { label: key })
        } else if (el.view === 'cubicbezier') {
          this.folders[id].addBlade(el)
        } else {
          this.config[id] = config
          this.backupConfig[id] = structuredClone(config)
          params[key] = this.folders[id].addBinding(el, 'value', Object.assign(el.params, { label: key }))
        }
      }
    }

    // Reset button
    this.folders[id].addBlade({ view: 'separator' })

    const resetButton = this.folders[id].addButton({ title: 'RESET' })
    resetButton.on('click', () => {
      if (this.networkInputs && this.networkInputs['list'] && this.networkInputs['list'].value !== 'none') {
        const currentNetworkConfig = this.networkConfigs[this.networkInputs['list'].value]
        if (currentNetworkConfig) {
          this.applyConfigSpecificFolder(currentNetworkConfig, id)
        }
      } else {
        console.log('DebugController.js:576', 'eeeehello', this.backupConfig)
        this.applyConfigSpecificFolder(this.backupConfig, id)
      }
    })

    const folder = this.folders[`${id}`]
    folder.params = params

    return folder
  }

  addBladeConfigInactive(config, id) {
    for (const key in config) {
      if (Object.hasOwnProperty.call(config, key)) {
        this.config[id] = config
      }
    }
  }

  getGui(id) {
    return this.folders[`${id}`]
  }

  // getPBRGui(id) {
  //   return this.folders[`${id} PBR`]
  // }

  removeItemFromArray(array, value) {
    const arrayIndex = array.indexOf(value)
    if (arrayIndex > -1) array.splice(arrayIndex, 1)
    return array
  }

  addSharedTextureUpload(gui, title = 'env_diffuse', uniformName = 'uSpecularEnvSampler', textureOptions = ['repeat']) {
    // this function is used to create upload-buttons for textures used on multiple meshes, like envmaps and LUT
    const textureInput = this.createFileInput(gui, title)

    textureInput.inputFile.addEventListener('change', () => {
      // on input change, load image and create new texture
      if (this.webglManager) {
        const file = textureInput.inputFile.files[0]
        const image = new Image()

        image.onload = () => {
          // then loop through all scenes and meshes to update the texture in the uniform
          const newTexture = this.webglManager.textureLoader.initTexture(image, textureOptions)
          for (const sceneKey in this.webglManager.scenes) {
            const sceneParent = this.webglManager.scenes[sceneKey]
            const scene = sceneParent && sceneParent.scene ? sceneParent.scene : null
            if (scene && scene.meshes) {
              for (let i = 0, l = scene.meshes.length; i < l; i++) {
                const mesh = scene.meshes[i]
                if (mesh.localState && mesh.localState.uniforms[uniformName]) {
                  mesh.localState.uniforms[uniformName].value = newTexture
                  mesh.localState.uniforms[uniformName].value.needsUpdate = true
                  mesh.maxTextureIndex++
                  mesh.localState.uniforms[uniformName].textIndx = mesh.maxTextureIndex
                }

                // TODO bonus Fred: check if mesh's globalConfig is the same than the one changing.
                // This would be useful only if multiple configs are used in the same scene (which is rare)
              }
            }
            URL.revokeObjectURL(image.src)
          }
        }
        if (file) image.src = URL.createObjectURL(file)
      } else {
        console.warn('missing `this.webglManager`, needed to add shared textures upload in the GUI',)
      }
    })
  }

  addTextureUpload(entity, opts = {}) {
    // this function adds buttons in the GUI to upload entity's current textures
    const baseOptions = {
      maps: ['albedoMap', 'albedoMapUnlit', 'normalTexture', 'ORMTexture', 'metallicRoughnessTexture', 'alphaTexture', 'emissiveTexture', 'occlusionTexture'], // optional
      callback: null, // optional
      textureOptions: ['repeat'], // optional
    }
    const options = { ...baseOptions, ...opts }

    // check if material already has texture-upload inputs
    let materialAlreadyHasTextureInputs = false
    if (entity.gui) {
      if (entity.gui.textureInputs) {
        materialAlreadyHasTextureInputs = true
      } else {
        entity.gui.textureInputs = {}
      }
    }

    if (materialAlreadyHasTextureInputs) {
      // bind already existing texture-inputs to the entity
      for (const title in entity.gui.textureInputs) {
        if (Object.hasOwnProperty.call(entity.gui.textureInputs, title)) {
          const inputFile = entity.gui.textureInputs[title].inputFile
          this.bindUploadInput(inputFile, title, entity, options)
        }
      }
    } else {
      // avoid creating upload-buttons for texture that don't exist in the entity's defines
      const defines = entity.defines

      if (!defines.HAS_NORMALMAP) this.removeItemFromArray(options.maps, 'normalTexture')
      if (!defines.HAS_ORM_MAP) this.removeItemFromArray(options.maps, 'ORMTexture')
      if (!defines.HAS_METALROUGHNESSMAP) this.removeItemFromArray(options.maps, 'metallicRoughnessTexture')
      if (!defines.HAS_EMISSIVEMAP) this.removeItemFromArray(options.maps, 'emissiveTexture')
      if (!defines.HAS_OCCLUSIONMAP) this.removeItemFromArray(options.maps, 'occlusionTexture')
      if (!defines.HAS_ALPHAMAP) this.removeItemFromArray(options.maps, 'alphaTexture')

      if (defines.USE_IBL) {
        // PBR: remove "albedoMapUnlit", and if there's no albedo remove "albedoMap" too
        this.removeItemFromArray(options.maps, 'albedoMapUnlit')
        if (!defines.HAS_BASECOLORMAP) {
          this.removeItemFromArray(options.maps, 'albedoMap')
        }
      } else {
        // UNLIT: remove "albedoMapUnlit" if it doesn't exist
        if (!defines.HAS_BASECOLORMAP) {
          this.removeItemFromArray(options.maps, 'albedoMapUnlit') // unlit
        }
      }

      // create and bind texture inputs
      for (let i = 0; i < options.maps.length; i++) {
        // create an file input for each texture
        const title = options.maps[i]
        const textureInput = this.createFileInput(entity.gui, title)

        // when button is clicked, create image from imported file
        if (textureInput) {
          this.bindUploadInput(
            textureInput.inputFile,
            title,
            entity,
            options,
          )
        } else {
          if (this.active) {
            console.warn('entity.gui is undefined, cannot add texture upload button', options)
          }
        }
      }
    }
  }

  createFileInput(guiFolder, title) {
    // this creates a button in the GUI folder that triggers an <input type="file"> for upload on click
    const inputFile = document.createElement('input')
    inputFile.type = 'file'
    inputFile.classList.add('input-file')

    if (guiFolder) {
      // add the button in the folder
      const debugBtn = guiFolder.addButton({
        title,
        label: 'Upload texture',
        index: 1,
      })
      debugBtn.on('click', () => {
        inputFile.click()
      })
      if (guiFolder.textureInputs == undefined) guiFolder.textureInputs = {}
      guiFolder.textureInputs[title] = {
        debugBtn,
        inputFile
      }
      return guiFolder.textureInputs[title]
    }
    return null
  }

  bindUploadInput(inputFile, title, entity, options) {
    // this updates the entity's texture-uniforms when a texture-upload input is clicked
    inputFile.addEventListener('change', (event) => {
      const file = inputFile.files[0]
      const image = new Image()
      image.onload = () => {
        // turn image into texture with optional params
        let texture
        if (entity.scene.textureLoader) {
          texture = entity.scene.textureLoader.initTexture(image, options.textureOptions)
        } else {
          console.warn('entity.scene.textureLoader is undefined, cannot create texture from image', options)
          return
        }

        // detect uniform associated to texture's key in manifest
        let uniformName = null
        // pbr
        if (title === 'albedoMap') uniformName = 'uBaseColorSampler'
        if (title === 'ORMTexture') uniformName = 'uOcclusionRoughnessMetallicSampler'
        if (title === 'metallicRoughnessTexture') uniformName = 'uMetallicRoughnessSampler'
        if (title === 'normalTexture') uniformName = 'uNormalSampler'
        if (title === 'emissiveTexture') uniformName = 'uEmissiveSampler'
        if (title === 'occlusionTexture') uniformName = 'uOcclusionSampler'
        if (title === 'alphaTexture') uniformName = 'uAlphaMapSampler'

        // unlit
        if (title === 'albedoMapUnlit') uniformName = 'uTexture'

        // replace uniform if it exists
        if (uniformName && entity.program.uniforms[uniformName]) {
          entity.program.uniforms[uniformName].value = texture
          entity.program.uniforms[uniformName].value.needsUpdate = true
        } else {
          console.warn('no uniform matching that title:', title, ' - uniforms:', entity.program.uniforms)
        }

        if (options.callback) {
          options.callback(texture)
        }

        URL.revokeObjectURL(image.src)
      }
      if (file) image.src = URL.createObjectURL(file)
    });
  }
}

const Export = new DebugController()
export default Export
