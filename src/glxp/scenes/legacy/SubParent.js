// Libs
import { gsap } from 'gsap'

// Structural
import SceneAbs from '@/glxp/abstract/scene'
import TextureLoader from '@/glxp/utils/TextureLoaderManager'
import ShaderManifest from '@/glxp/shaderManifest'
import Shader from '@/glxp/utils/Shader'

// Subscenes
import SceneSubAlpha from './sub/SubAlpha'
import SceneSubBeta from './sub/SubBeta'
import SceneSubCharlie from './sub/SubCharlie'
import SceneSubDelta from './sub/SubDelta'

// Utils
import RAF from '@/glxp/utils/RAF'
import Mouse from '@/glxp/utils/Mouse'
import GlobalEmitter from '@/glxp/utils/EventEmitter'

// OGL
import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Triangle } from '@/glxp/ogl/extras/Triangle.js'

class SubParent extends SceneAbs {
  constructor(container, manager = null) {
    super(container, manager)

    this.name = 'Sub Parent'

    this.container = container
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
    this.isTransition = false

    // EXEMPLE
    this.currentSubsceneId = 2

    if (manager && manager.textureLoader) {
      this.textureLoader = manager.textureLoader
    } else {
      this.textureLoader = new TextureLoader(this)
    }

    this.initScenes()
    this.initComposition()

    this.config = {
      Pause: { value: false, type: 'bool' },
      time_scale: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
      debug: { value: 0, params: { min: 0, max: 0.1, step: 0.0001 } },
      scroll_damping: { value: 0.05, params: { min: 0, max: 1, step: 0.01 } },
      scroll_speed: { value: 5, params: { min: 0, max: 10, step: 0.1 } },
    }
  }

  // Inits
  initScenes() {
    // TODO: Refactor subscenes parameters
    this.subsceneAlpha = new SceneSubAlpha(this.container, this.manager, this.textureLoader, true)
    this.subsceneBeta = new SceneSubBeta(this.container, this.manager, this.textureLoader, true)
    this.subsceneCharlie = new SceneSubCharlie(this.container, this.manager, this.textureLoader, true)
    this.subsceneDelta = new SceneSubDelta(this.container, this.manager, this.textureLoader, true)

    this.subscenes = [this.subsceneAlpha, this.subsceneBeta, this.subsceneCharlie, this.subsceneDelta]

    this.activeSubsceneFirst = this.subsceneCharlie
    this.activeSubsceneSecond = this.subsceneDelta

    this.rtFirst = this.activeSubsceneFirst.rt
    this.rtSecond = this.activeSubsceneSecond.rt
  }

  initComposition() {
    const geometry = new Triangle(this.gl)

    this.compositionShader = new Shader(ShaderManifest['subscenes'])

    this.compositionProgram = new Program(this.gl, {
      vertex: this.compositionShader.vert,
      fragment: this.compositionShader.frag,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: Mouse.cursor },
        uSceneFirst: { value: this.rtFirst.textures[0] },
        uSceneSecond: { value: this.rtSecond.textures[0] },
        uTransitionFactor: { value: 0 },
        // CUSTOM
        uTransitionSkew: { value: 0.2 },
      },
    })

    this.compositionMesh = new Mesh(this.gl, { geometry, program: this.compositionProgram })
  }

  initEvents() {
    console.log('EXEMPLE : Press Space to transition to next scene.')
    document.body.addEventListener('keyup', this.mockNextScene.bind(this))
  }

  destroyEvents() {
    document.body.removeEventListener('keyup', this.mockNextScene.bind(this))
  }

  // Lifecycle
  activate() {
    return new Promise((resolve) => {
      this.active = true
      this.activationResolve = resolve
      this.postFirstDraw()

      this.initEvents()
    })
  }

  disable() {
    this.active = false

    this.destroyEvents()
  }

  async load() {
    const loadableTextures = []

    // Create global loadables array from subscenes loadable textures
    this.subscenes.forEach((subscene) => {
      const subsceneLoadableTextures = subscene.fetchLoadableTextures()

      const compareLoadables = (l1, l2) => l1.groupKey === l2.groupKey && l1.key === l2.key

      if (subsceneLoadableTextures) {
        subsceneLoadableTextures.forEach((subLoadable) => {
          if (loadableTextures.findIndex((loadable) => compareLoadables(loadable, subLoadable)) < 0) {
            loadableTextures.push(subLoadable)
          }
        })
      }
    })

    // Load all loadable textures and wait for promises
    const loadablePromises = loadableTextures.map((loadable) => this.textureLoader.load(loadable.element, loadable.key, loadable.options))

    // Add model load promises
    this.subscenes.forEach((subscene) => {
      const subsceneModelsPromises = subscene.loadModels()

      if (subsceneModelsPromises) {
        loadablePromises.push(...subsceneModelsPromises)
      }
    })

    Promise.all(loadablePromises).then(() => {
      this.onLoaded()
    })

    // Handle loading progress
    let percent = 0
    for (let i = 0; i < loadablePromises.length; i++) {
      loadablePromises[i].then(() => {
        percent++
        const formatedVal = Math.round((percent / loadablePromises.length) * 100)
        this._emitter.emit('progress', formatedVal)
        GlobalEmitter.emit('loading_progress', { progress: formatedVal })
      })
    }
  }

  // Scenes switch
  setSubscenes(subsceneFirst = this.activeSubsceneFirst, subsceneSecond = this.activeSubsceneFirst) {
    this.activeSubsceneFirst = subsceneFirst
    this.activeSubsceneSecond = subsceneSecond

    this.rtFirst = this.activeSubsceneFirst.rt
    this.rtSecond = this.activeSubsceneSecond.rt

    this.compositionProgram.uniforms.uSceneFirst.value = this.rtFirst.textures[0]
    this.compositionProgram.uniforms.uSceneSecond.value = this.rtSecond.textures[0]
  }

  transitionToSecond() {
    if (this.isTransition) return

    this.isTransition = true

    this.activeSubsceneSecond.activate()

    const tl = gsap.timeline()

    return new Promise((resolve, reject) => {
      tl.to(this.compositionProgram.uniforms.uTransitionFactor, { value: 1, duration: 1.5, ease: 'power3.inOut' }, 0.0)

      tl.fromTo(this.compositionProgram.uniforms.uTransitionSkew, { value: 0.0 }, { value: 0.35, duration: 0.75, ease: 'power3.in' }, 0)
      tl.fromTo(this.compositionProgram.uniforms.uTransitionSkew, { value: 0.35 }, { value: 0.0, duration: 0.75, ease: 'power3.out' }, 0.75)

      tl.call(() => {
        this.setSubscenes(this.activeSubsceneSecond, this.activeSubsceneFirst)
        this.compositionProgram.uniforms.uTransitionFactor.value = 0
        this.activeSubsceneSecond.disable()

        this.isTransition = false

        resolve()
      })
    })
  }

  async transitionToSubscene(subscene) {
    if (this.isTransition) return

    this.setSubscenes(this.activeSubsceneFirst, subscene)
    await this.transitionToSecond()
  }

  mockNextScene(e) {
    if (this.isTransition || e.code !== 'Space') return

    this.currentSubsceneId = (this.currentSubsceneId + 1) % this.subscenes.length
    this.transitionToSubscene(this.subscenes[this.currentSubsceneId])
  }

  // Utils
  setProgress(p) {
    this.progressTarget = p
  }

  applyDefaultState() {
    let gl = this.gl
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.enable(gl.DEPTH_TEST)
    gl.depthMask(true)
  }

  // Events
  onLoaded() {
    this.active = true
    this._emitter.emit('loaded')

    // Subscenes onLoaded & First Draw
    const firstDrawPromises = []
    this.subscenes.forEach((subscene) => {
      subscene.onLoaded()

      if (subscene.shouldFirstDraw && subscene.firstDrawAllPromise) {
        firstDrawPromises.push(subscene.firstDrawAllPromise)
      }
    })

    // Will go through this Promise even if no scene has their first draw enabled
    Promise.all(firstDrawPromises).then(() => {
      console.log('subParent.js:273', 'Subscenes finished first draw. Activate Parent scene.')

      GlobalEmitter.emit('webgl_loaded')
    })

    // Activate
    this.activeSubsceneFirst.activate()

    // EXEMPLE
    // setTimeout(() => {
    //   this.transitionToSubscene(this.subsceneDelta).then(() => {
    //     setTimeout(() => {
    //       this.transitionToSubscene(this.subsceneAlpha).then(() => {
    //         setTimeout(() => {
    //           this.transitionToSubscene(this.subsceneCharlie)
    //         }, 1000)
    //       })
    //     }, 1000)
    //   })
    // }, 1000)
  }

  postFirstDraw() {}

  resize() {}

  // Rendering
  preRender() {
    // TODO: Check if we need global scene parent progress
    let tmp
    tmp = this.progressTarget - this.progress
    this.progressDelta = tmp
    tmp *= this.config.scroll_damping.value

    this.timescale = this.config.time_scale.value

    this.progress += tmp
  }

  render() {
    if (!this.active) {
      return
    }
    let gl = this.gl

    this.time += RAF.dt / 1000
    this.dt = RAF.dt

    this.preRender()

    // Subscenes
    // TODO: filter might be too obscure at this point
    // Test is also done in subscene, this is just to prevent useless calls.

    this.subscenes
      .filter((subscene) => subscene.active || (subscene.shouldFirstDraw && !subscene.didFirstDraw))
      .forEach((subscene, i) => {
        // Clear color between each subscene renders
        if (i >= 1) {
          gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3])
          // TODO: Those clears worked at some point (and still do on other projects), but not here anymore
          // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
          // gl.colorMask(true, true, true, true)
        }

        subscene.render()
      })

    // Compositing
    gl.viewport(0, 0, this.width, this.height)
    this.renderer.setViewport(this.width, this.height)

    // Render Time
    this.renderer.render({ scene: this.compositionMesh })

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

  dispose() {
    this.subscenes.forEach(subscene => {
      subscene.dispose()
    });
  }
}

export default SubParent
