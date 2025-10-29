import Text3D from '@/glxp/utils/Text3D'
import { Transform } from '@/glxp/ogl/core/Transform'
import { Program } from '@/glxp/ogl/core/Program'
import { Plane } from '@/glxp/ogl/extras/Plane'
import { Mesh } from '@/glxp/ogl/core/Mesh'
import { Raycast } from '@/glxp/ogl/extras/Raycast'
import { Vec2 } from '@/glxp/ogl/math/Vec2'
import { gsap } from 'gsap'

import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'
import WishlistButtonGL from '@/glxp/entities/ui/WishlistButtonGL'
import Mouse from '@/glxp/utils/Mouse'
import { isMobile } from '@/glxp/utils/device'
import { Vec3 } from '@/glxp/ogl/math/Vec3'
import { vec3 } from 'gl-matrix'
import GlobalEmitter from '@/glxp/utils/EventEmitter'

import DebugController from '@/glxp/debug/DebugController'

import SoundController from '@/glxp/utils/sounds'
import ButtonGL from '../entities/ui/ButtonGL'

const AUDIO_IDS = ['audio_intro', 'audio_1', 'audio_2', 'audio_3', 'audio_4', 'audio_5', 'audio_6', 'audio_7', 'audio_8', 'audio_9', 'audio_10', 'audio_end']

const ANIMATION_TIMELINE = [
  {
    start: 0,
    end: 0.1,
    title: 0,
  },
  {
    start: 8,
    end: 11.5, // product1
  },
  {
    start: 16,
    end: 20, // product2
  },
  {
    start: 25.5,
    end: 27, // product3
  },
  {
    start: 31.1,
    end: 33, // product4
  },
  {
    start: 37,
    end: 40, // product5
  },
  {
    start: 46,
    end: 49, // product6
  },
  {
    start: 57,
    end: 60, // product7
  },
  {
    start: 68,
    end: 71, // product8
  },
  {
    start: 78,
    end: 81, // product9
  },
  {
    start: 87,
    end: 90, // product10nd: 0.72
  },
  {
    start: 98.5,
    end: 110,
    title: 1,
  },
]

const AUDIO_TIMELINE = [
  {
    start: -1,
    end: 8, // intro
  },
  {
    start: 8,
    end: 15, // product1
  },
  {
    start: 15,
    end: 24, // product2
  },
  {
    start: 24,
    end: 30, // product3
  },
  {
    start: 30,
    end: 35, // product4
  },
  {
    start: 35,
    end: 44, // product5
  },
  {
    start: 44,
    end: 52, // product6
  },
  {
    start: 52,
    end: 62, // product7
  },
  {
    start: 62,
    end: 74, // product8
  },
  {
    start: 74,
    end: 84, // product9
  },
  {
    start: 84,
    end: 93.5, // product10
  },
  {
    start: 93.5,
    end: 101, // outro
  },
]

export default class UIManager {
  constructor(scene) {
    this.CONFIG = {
      titles: [
        {
          firstWord: window.__i18n.t('h1__firstWord'),
          midWord: window.__i18n.t('h1__midWord'),
          lastWord: window.__i18n.t('h1__lastWord'),
        },
        {
          firstWord: window.__i18n.t('end__firstWord'),
          midWord: window.__i18n.t('end__midWord'),
          lastWord: window.__i18n.t('end__lastWord'),
          UI: {
            button: window.__i18n.t('end__button'),
            buttonHref: window.__i18n.t('end__button__href'),
            wishList: window.__i18n.t('wishlist__button'),
            wishListHref: window.__i18n.t('wishlist__button__href'),
          },
        },
      ],
      products: [
        {
          index: 0,
          firstLine: window.__i18n.t('product1__sentence__line1'),
          secondLine: window.__i18n.t('product1__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(-200, 154, -100),
            textScale: 0.594,
            button: new Vec3(4.09, -156.36, -144.48),
            buttonScale: 0.9,
          },
        },
        {
          index: 1,
          firstLine: window.__i18n.t('product2__sentence__line1'),
          secondLine: window.__i18n.t('product2__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(100, -126, -245),
            textScale: 0.981,
            button: new Vec3(-400, 4.09, -186.07),
            buttonScale: 1.4,
          },
        },
        {
          index: 2,
          firstLine: window.__i18n.t('product3__sentence__line1'),
          secondLine: window.__i18n.t('product3__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(100, -150, -174),
            textScale: 0.8,
            button: new Vec3(-25.63, -138.53, 206.13),
            buttonScale: 0.8,
            textRenderOrder: 10028,
          },
        },
        {
          index: 3,
          firstLine: window.__i18n.t('product4__sentence__line1'),
          secondLine: window.__i18n.t('product4__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(150, -100, -190),
            textScale: 0.669,
            button: new Vec3(178.4, 71.43, -18),
            buttonScale: 1.2,
            textRenderOrder: 2400,
          },
        },
        {
          index: 4,
          firstLine: window.__i18n.t('product5__sentence__line1'),
          secondLine: window.__i18n.t('product5__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(-300, 30, 0),
            textScale: 0.67,
            button: new Vec3(39, -89, -47.4),
            buttonScale: 0.8,
            textRenderOrder: 9805,
          },
        },
        {
          index: 5,
          firstLine: window.__i18n.t('product6__sentence__line1'),
          secondLine: window.__i18n.t('product6__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(-20, -80, 0),
            textScale: 0.7,
            button: new Vec3(17.95, -5.8, 0),
            buttonScale: 1.1,
            textRenderOrder: 2500,
          },
        },
        {
          index: 6,
          firstLine: window.__i18n.t('product7__sentence__line1'),
          secondLine: window.__i18n.t('product7__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(-400, -40, -400),
            textScale: 0.832,
            button: new Vec3(-43.45, -31.57, -400),
            buttonScale: 1.4,
            textRenderOrder: isMobile ? 4000 : 976,
          },
        },
        {
          index: 7,
          firstLine: window.__i18n.t('product8__sentence__line1'),
          secondLine: window.__i18n.t('product8__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(-150, 70, 0),
            textScale: 0.72,
            button: new Vec3(87, 87, -61),
            buttonScale: 1.01,
            textRenderOrder: isMobile ? 5000 : false,
          },
        },
        {
          index: 8,
          firstLine: window.__i18n.t('product9__sentence__line1'),
          secondLine: window.__i18n.t('product9__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(420, 400, -100),
            textScale: 0.8,
            button: new Vec3(-96.9, 33.8, -114.76),
            buttonScale: 1.4,
            textRenderOrder: 2500,
          },
        },
        {
          index: 9,
          firstLine: window.__i18n.t('product10__sentence__line1'),
          secondLine: window.__i18n.t('product10__sentence__line2'),
          unlock: false,
          isAddToWishlist: false,
          guiConfig: {
            text: new Vec3(-180, 40, 0),
            textScale: 0.906,
            button: new Vec3(265.5, -25.63, -91),
            buttonScale: 1.3,
          },
        },
      ],
    }

    if (isMobile) {
      this.CONFIG.products[2].guiConfig.text.x -= 400
      this.CONFIG.products[2].guiConfig.text.y -= 100

      this.CONFIG.products[3].guiConfig.text.x -= 400
      this.CONFIG.products[3].guiConfig.text.z -= 100

      this.CONFIG.products[4].guiConfig.text.x += 300
      this.CONFIG.products[4].guiConfig.button.y += 50

      this.CONFIG.products[7].guiConfig.button.y -= 100

      this.CONFIG.products[9].guiConfig.button.y += 100
      this.CONFIG.products[9].guiConfig.button.x -= 100
    }

    this.scene = scene
    this.gl = scene.gl

    this.renderer = scene.renderer

    this.titles = []
    this.products = []
    this.time = 0

    this.mouse = new Vec2()
    this.raycast = new Raycast(this.gl)

    this.experienceProgress = 0
    this.activeProduct = 0
    this.currentAudio = 0
    this.soundReady = false

    this.raycastMeshes = []

    this.active = false

    this.initEvents()
    window.__UIManager = this
    this.initAudio()
  }

  async initAudio() {
    await SoundController.ready.promise
    this.soundReady = true
  }

  initEvents() {
    this.wWidth = window.innerWidth
    this.wHeight = window.innerHeight

    if (isMobile) {
      document.body.addEventListener('touchstart', (event) => {
        this.mouse.set((event.touches[0].clientX / this.wWidth - 0.5) * 2, (event.touches[0].clientY / this.wHeight - 0.5) * -2)
        this.updateRaycastProduct()
      })
      document.body.addEventListener(
        'touchmove',
        (event) => {
          this.mouse.set((event.touches[0].clientX / this.wWidth - 0.5) * 2, (event.touches[0].clientY / this.wHeight - 0.5) * -2)
          this.updateRaycastProduct()
        },
        { passive: true }
      )
    } else {
      document.body.addEventListener('mousemove', this.updateRaycastProduct.bind(this))
    }

    window.addEventListener('resize', this.resize.bind(this))

    GlobalEmitter.on('wishlist_add', (index) => {
      this.CONFIG.products[index].isAddToWishlist = true
      // console.log('add to wishlist', index)
    })

    GlobalEmitter.on('wishlist_remove', (index) => {
      this.CONFIG.products[index].isAddToWishlist = false
      // console.log('remove from wishlist', index)
    })
  }

  async addTitle(index, { position = new Vec3(), scale = 1, offset = new Vec3(), renderOrder = 0 }) {
    const config = this.CONFIG.titles[index]

    await Text3D.ready.promise

    let container = new Transform()
    vec3.add(container.position, position, offset)
    container.scale = new Vec3(scale, scale, scale)
    container.setParent(this.scene.root)

    let firstWord = Text3D.createText({
      color: '#ffffff',
      textContent: config.firstWord,
      size: 50,
      letterSpacing: -0.04,
      font: 'Ophian',
      customProgram: 'title',
      renderOrder: renderOrder,
      depthTest: false,
    })
    firstWord.mesh.setParent(container)

    let midWord
    if (index === 0 && window.__locale && (window.__locale === 'de' || window.__locale === 'at')) {
      midWord = Text3D.createText({
        color: '#ffffff',
        textContent: config.midWord,
        size: 50,
        letterSpacing: -0.04,
        font: 'Ophian',
        customProgram: 'title',
        renderOrder: renderOrder,
        depthTest: false,
      })
    } else {
      midWord = Text3D.createText({
        color: '#ffffff',
        textContent: config.midWord.toUpperCase(),
        size: 8,
        letterSpacing: 0.4,
        font: 'Proxima',
        customProgram: 'title',
        renderOrder: renderOrder,
        depthTest: false,
      })
    }

    midWord.mesh.setParent(container)

    const shader = new Shader(ShaderManifest['underline'])
    let program = new Program(this.gl, {
      vertex: shader.vert,
      fragment: shader.frag,
      transparent: true,
      uniforms: {
        uTransition: { value: 0 },
        uAlpha: { value: 1 },
      },
      depthTest: false,
    })
    let geometry = new Plane(this.gl)
    let underline = new Mesh(this.gl, {
      geometry,
      program,
      renderOrder: renderOrder,
    })
    underline.scale.set(midWord.text.width, 1.5, 1)
    underline.setParent(container)

    if (index === 0 && window.__locale && (window.__locale === 'de' || window.__locale === 'at')) {
      underline.visible = false
    }

    let lastWord = Text3D.createText({
      color: '#ffffff',
      textContent: config.lastWord,
      size: 50,
      letterSpacing: -0.04,
      font: 'Ophian',
      customProgram: 'title',
      renderOrder: renderOrder,
      depthTest: false,
    })
    lastWord.mesh.setParent(container)

    container.__firstWord = firstWord
    container.__midWord = midWord
    container.__lastWord = lastWord
    container.__underline = underline

    let levelTexture = this.scene.textureLoader.getTexture('colors_levels')
    levelTexture.needsUpdate = true

    firstWord.mesh.program.uniforms.uLevelsMap.value = levelTexture
    midWord.mesh.program.uniforms.uLevelsMap.value = levelTexture
    lastWord.mesh.program.uniforms.uLevelsMap.value = levelTexture

    container.__isAnimated = false

    if (window.innerWidth < 940) {
      container.__firstWord.mesh.position.x = 0
      container.__firstWord.mesh.position.y = 50

      container.__midWord.mesh.position.y = -30
      container.__midWord.mesh.position.x = 1

      container.__underline.position.y = -44
      container.__underline.scale.y = 1.2

      container.__lastWord.mesh.position.x = 0
      container.__lastWord.mesh.position.y = -50

      if (index === 1) {
        container.__firstWord.mesh.position.y -= 8
      }

      if (index === 0 && window.__locale && (window.__locale === 'de' || window.__locale === 'at')) {
        container.__firstWord.mesh.position.y += 8
        container.__lastWord.mesh.position.y -= 8
        container.__midWord.mesh.position.y = 0
      }
    } else {
      container.__firstWord.mesh.position.x = -container.__firstWord.text.width * 0.5
      container.__firstWord.mesh.position.x -= 25 // margin
      container.__firstWord.mesh.position.y = 0

      container.__midWord.mesh.position.y = -26
      container.__midWord.mesh.position.x = 1

      container.__underline.position.y = -41
      container.__underline.position.x = 0
      container.__underline.scale.y = 1.5

      container.__lastWord.mesh.position.x = container.__lastWord.text.width * 0.5
      container.__lastWord.mesh.position.x += 25 // margin
      container.__lastWord.mesh.position.y = 0

      if (index === 0 && window.__locale && (window.__locale === 'de' || window.__locale === 'at')) {
        container.__midWord.mesh.position.y = 0

        container.__firstWord.mesh.position.x += -122
        container.__lastWord.mesh.position.x += 122
      }

      if (index === 1) {
        if (window.__locale && (window.__locale === 'fr' || window.__locale === 'be_fr')) {
          container.__firstWord.mesh.position.x += 83
          container.__midWord.mesh.position.x += 83
          container.__lastWord.mesh.position.x += 83
          container.__underline.position.x += 83
        } else if (window.__locale && (window.__locale === 'de' || window.__locale === 'at')) {
          container.__firstWord.mesh.position.x += -72
          container.__midWord.mesh.position.x += -72
          container.__lastWord.mesh.position.x += -72
          container.__underline.position.x += -72

          container.__firstWord.mesh.position.x += -10
          container.__lastWord.mesh.position.x += 10
        } else {
          container.__firstWord.mesh.position.x += 29
          container.__midWord.mesh.position.x += 29
          container.__lastWord.mesh.position.x += 29
          container.__underline.position.x += 29
        }
      }
    }

    if (config.UI) {
      let button = new ButtonGL(this.gl, {
        parent: container,
        renderer: this.renderer,
        text: config.UI.button,
        href: config.UI.buttonHref,
        textureLoader: this.scene.textureLoader,
      })
      container.__button = button

      button.mesh.program.depthTest = false
      button.text.mesh.program.depthTest = false
      button.mesh.renderOrder = renderOrder
      button.text.mesh.renderOrder = renderOrder

      button.scale.set(15, 15, 15)

      let link = new ButtonGL(this.gl, {
        parent: container,
        renderer: this.renderer,
        text: config.UI.wishList,
        href: config.UI.wishListHref,
        textureLoader: this.scene.textureLoader,
        isLink: true,
      })
      container.__link = link

      link.mesh.program.depthTest = false
      link.text.mesh.program.depthTest = false
      link.icon.program.depthTest = false
      link.mesh.renderOrder = renderOrder
      link.text.mesh.renderOrder = renderOrder
      link.icon.renderOrder = renderOrder

      link.scale.set(15, 15, 15)

      if (this.wWidth < 940) {
        link.position.y = -180
        button.position.y = -140
      } else {
        link.position.y = -145
        button.position.y = -105
      }
    }

    let guiConfig = {
      x: { value: 0, range: [-400, 400], step: 0.01 },
      y: { value: 0, range: [-400, 400], step: 0.01 },
      z: { value: 0, range: [-400, 400], step: 0.01 },
      scale: { value: container.scale.x, range: [0, 2], step: 0.001 },
    }
    let GUI = DebugController.addConfig(guiConfig, `Title_${index}`, 'UI')
    GUI.__controllers.forEach((controller) => {
      controller.onChange(() => {
        container.position.set(position)
        container.position.add(offset)

        container.position.x += guiConfig.x.value
        container.position.y += guiConfig.y.value
        container.position.z += guiConfig.z.value
        container.scale.set(guiConfig.scale.value)
      })
    })

    this.titles[index] = container
    this.titles[index].__tracked = false

    return container
  }

  async addProductUI(index, { titlePosition = new Vec3(), buttonPosition = new Vec3(), scale = 1, offset = new Vec3(), buttonOffset = new Vec3(), buttonScale = 1, titleRenderOrder, buttonRenderOrder }) {
    let config = this.CONFIG.products[index]

    await Text3D.ready.promise

    if (config.guiConfig.textRenderOrder) titleRenderOrder = config.guiConfig.textRenderOrder
    if (config.guiConfig.buttonRenderOrder) buttonRenderOrder = config.guiConfig.buttonRenderOrder

    let container = new Transform()
    container.position.copy(titlePosition)
    container.position.add(offset)

    container.__basePosition = new Vec3()
    container.__basePosition.copy(container.position)

    container.scale = new Vec3(config.guiConfig.textScale, config.guiConfig.textScale, config.guiConfig.textScale)
    container.setParent(this.scene.root)

    let firstLine = Text3D.createText({
      color: '#ffffff',
      textContent: config.firstLine,
      size: 30,
      font: 'Ophian',
      align: 'left',
      customProgram: 'paragraph',
    })
    firstLine.mesh.setParent(container)

    let secondLine = Text3D.createText({
      color: '#ffffff',
      textContent: config.secondLine,
      size: 30,
      font: 'Ophian',
      align: 'left',
      customProgram: 'paragraph',
    })
    secondLine.mesh.setParent(container)
    secondLine.mesh.position.y = -38
    secondLine.mesh.position.x = firstLine.text.width * 0.4

    let button = new WishlistButtonGL(this.gl, {
      parent: this.scene.root,
      productIndex: index,
      renderer: this.renderer,
    })
    button.program.uniforms.uTransition.value = 1.0

    let wishlistButtonText = Text3D.createText({
      color: '#ffffff',
      textContent: window.__i18n.t('wishlist__added'),
      size: 0.25,
      font: 'Ophian',
      align: 'left',
      width: 3,
      lineHeight: 1.4,
      customProgram: 'paragraph',
      depthTest: false,
    })
    wishlistButtonText.mesh.program.uniforms.uAnimationIn.value = 1.0
    wishlistButtonText.mesh.program.uniforms.uAlpha.value = 0.0
    wishlistButtonText.mesh.setParent(button)
    wishlistButtonText.mesh.position.x = 1
    wishlistButtonText.mesh.position.y = wishlistButtonText.text.height * 0.5

    button.wishlistText = wishlistButtonText.mesh
    button.position.copy(buttonPosition)
    button.position.add(buttonOffset)
    button.__basePosition = new Vec3()
    button.__basePosition.copy(button.position)
    button.scale.set(50 * config.guiConfig.buttonScale)
    button.updateTexture(this.scene.textureLoader.getTexture('heart'))

    container.__firstLine = firstLine
    container.__secondLine = secondLine
    container.__button = button

    container.__isAnimated = false

    firstLine.mesh.renderOrder = titleRenderOrder
    secondLine.mesh.renderOrder = titleRenderOrder
    button.backgroundHover.renderOrder = buttonRenderOrder
    button.renderOrder = buttonRenderOrder + 1
    wishlistButtonText.mesh.renderOrder = buttonRenderOrder + 2

    firstLine.mesh.program.depthTest = false
    secondLine.mesh.program.depthTest = false
    button.backgroundHover.program.depthTest = false
    button.program.depthTest = false
    wishlistButtonText.mesh.program.depthTest = false

    this.products[index] = container
    this.products[index].__tracked = false

    container.position.add(config.guiConfig.text)
    button.position.add(config.guiConfig.button)

    // let guiConfig = {
    //   textX: { value: config.guiConfig.text.x, range: [-400, 400], step: 0.01 },
    //   textY: { value: config.guiConfig.text.y, range: [-400, 400], step: 0.01 },
    //   textZ: { value: config.guiConfig.text.z, range: [-400, 400], step: 0.01 },
    //   textScale: { value: container.scale.x, range: [0, 2], step: 0.001 },

    //   buttonX: { value: config.guiConfig.button[0], range: [-400, 400], step: 0.01 },
    //   buttonY: { value: config.guiConfig.button[1], range: [-400, 400], step: 0.01 },
    //   buttonZ: { value: config.guiConfig.button[2], range: [-400, 400], step: 0.01 },
    //   buttonScale: { value: container.scale.x, range: [0, 2], step: 0.001 },
    //   textRenderOrder: { value: titleRenderOrder, range: [0, 30000], step: 1 },
    //   buttonRenderOrder: { value: buttonRenderOrder, range: [0, 30000], step: 1 },
    // }

    // let GUI = DebugController.addConfig(guiConfig, `ProductUI_${index}`, 'UI')
    // GUI.__controllers.forEach((controller) => {
    //   controller.onChange(() => {
    //     container.position.set(titlePosition)
    //     container.position.add(offset)
    //     container.position.x += guiConfig.textX.value
    //     container.position.y += guiConfig.textY.value
    //     container.position.z += guiConfig.textZ.value
    //     container.scale.set(guiConfig.textScale.value)

    //     button.position.copy(buttonPosition)
    //     button.position.add(buttonOffset)
    //     button.position.x += guiConfig.buttonX.value
    //     button.position.y += guiConfig.buttonY.value
    //     button.position.z += guiConfig.buttonZ.value
    //     button.scale.set(50 * guiConfig.buttonScale.value)

    //     firstLine.mesh.renderOrder = guiConfig.textRenderOrder.value
    //     secondLine.mesh.renderOrder = guiConfig.textRenderOrder.value
    //     button.backgroundHover.renderOrder = guiConfig.buttonRenderOrder.value
    //     button.renderOrder = guiConfig.buttonRenderOrder.value + 1
    //     wishlistButtonText.mesh.renderOrder = guiConfig.buttonRenderOrder.value + 2
    //   })
    // })

    return container
  }

  resize() {
    this.wWidth = window.innerWidth
    this.wHeight = window.innerHeight

    this.titles.forEach((title, index) => {
      if (window.innerWidth < 940) {
        title.__firstWord.mesh.position.x = 0
        title.__firstWord.mesh.position.y = 50

        title.__midWord.mesh.position.y = -30
        title.__midWord.mesh.position.x = 1

        title.__underline.position.x = 0
        title.__underline.position.y = -44
        title.__underline.scale.y = 1.2

        title.__lastWord.mesh.position.x = 0
        title.__lastWord.mesh.position.y = -50

        if (index === 1) {
          title.__link.position.y = -180
          title.__button.position.y = -140
        }

        if (index === 0 && window.__locale && (window.__locale === 'de' || window.__locale === 'at')) {
          title.__firstWord.mesh.position.y += 8
          title.__lastWord.mesh.position.y -= 8
          title.__midWord.mesh.position.y = 0
        }
      } else {
        title.__firstWord.mesh.position.x = -title.__firstWord.text.width * 0.5
        title.__firstWord.mesh.position.x -= 25 // margin
        title.__firstWord.mesh.position.y = 0

        title.__midWord.mesh.position.y = -26
        title.__midWord.mesh.position.x = 1

        title.__underline.position.y = -41
        title.__underline.position.x = 0
        title.__underline.scale.y = 1.5

        title.__lastWord.mesh.position.x = title.__lastWord.text.width * 0.5
        title.__lastWord.mesh.position.x += 25 // margin
        title.__lastWord.mesh.position.y = 0

        if (index === 0 && window.__locale && (window.__locale === 'de' || window.__locale === 'at')) {
          title.__midWord.mesh.position.y = 0

          title.__firstWord.mesh.position.x += -122
          title.__lastWord.mesh.position.x += 122
        }

        if (index === 1) {
          if (window.__locale && (window.__locale === 'fr' || window.__locale === 'be_fr')) {
            title.__firstWord.mesh.position.x += 83
            title.__midWord.mesh.position.x += 83
            title.__lastWord.mesh.position.x += 83
            title.__underline.position.x += 83
          } else if (window.__locale && (window.__locale === 'de' || window.__locale === 'at')) {
            title.__firstWord.mesh.position.x += -72
            title.__midWord.mesh.position.x += -72
            title.__lastWord.mesh.position.x += -72
            title.__underline.position.x += -72

            title.__firstWord.mesh.position.x += -10
            title.__lastWord.mesh.position.x += 10
          } else {
            title.__firstWord.mesh.position.x += 29
            title.__midWord.mesh.position.x += 29
            title.__lastWord.mesh.position.x += 29
            title.__underline.position.x += 29
          }
        }
      }
    })
  }

  updateRaycastProduct() {
    // TODO: Add debounce function for mouse move
    if (!this.active) return
    if (this.raycastMeshes.length < 1) return

    if (!isMobile) this.mouse.set(Mouse.lastCursor[0], -Mouse.lastCursor[1])

    this.raycast.castMouse(this.scene.cameraManager.camera, this.mouse)
    const hits = this.raycast.intersectBounds(this.raycastMeshes)

    this.raycastMeshes.forEach((mesh) => {
      if (hits[0] === mesh) mesh.hover(true)
      else mesh.hover(false)
    })
  }

  debug() {
    this.time += 0.05

    this.titles.forEach((title) => {
      let sin = Math.sin(this.time) * 0.5 + 0.5
      if (title.__firstWord) title.__firstWord.mesh.program.uniforms.uAnimationIn.value = sin
      if (title.__midWord) title.__midWord.mesh.program.uniforms.uAnimationIn.value = sin
      if (title.__lastWord) title.__lastWord.mesh.program.uniforms.uAnimationIn.value = sin
    })

    this.products.forEach((product) => {
      if (product.__firstLine) product.__firstLine.mesh.program.uniforms.uAnimationIn.value = Math.sin(this.time)
      if (product.__secondLine) product.__secondLine.mesh.program.uniforms.uAnimationIn.value = Math.sin(this.time - 0.1)
    })
  }

  raycastActiveProduct(index) {
    // check scene progress
    this.raycastMeshes = []
    this.raycastMeshes.push(this.products[index].__button)
  }

  animateInTitle(index) {
    if (this.titles[index].__isAnimated) return
    this.titles[index].__isAnimated = true

    let programFirstWord = this.titles[index].__firstWord.mesh.program
    let prograMidWord = this.titles[index].__midWord.mesh.program
    let programUnderline = this.titles[index].__underline.program
    let programLastWord = this.titles[index].__lastWord.mesh.program

    gsap.killTweensOf([programFirstWord.uniforms.uAnimationOut, prograMidWord.uniforms.uAnimationOut, programLastWord.uniforms.uAnimationOut])

    programFirstWord.uniforms.uAnimationOut.value = 0.0
    prograMidWord.uniforms.uAnimationOut.value = 0.0
    programLastWord.uniforms.uAnimationOut.value = 0.0
    programFirstWord.uniforms.uAnimationIn.value = 0.0
    prograMidWord.uniforms.uAnimationIn.value = 0.0
    programLastWord.uniforms.uAnimationIn.value = 0.0

    gsap.to(programFirstWord.uniforms.uAnimationIn, {
      value: 1,
      duration: 1.4,
      ease: 'Cubic.easeOut',
    })
    gsap.to(prograMidWord.uniforms.uAnimationIn, {
      value: 1,
      duration: 1.4,
      delay: 0.12,
      ease: 'Cubic.easeOut',
    })
    gsap.to(programUnderline.uniforms.uTransition, {
      value: 1.0,
      duration: 1.2,
      delay: 0.12,
      ease: 'Cubic.easeOut',
    })

    gsap.to(programLastWord.uniforms.uAnimationIn, {
      value: 1,
      duration: 1.4,
      delay: 0.24,
      ease: 'Cubic.easeOut',
    })

    if (index === 1) {
      this.titles[index].__button.animateIn()
      this.titles[index].__link.animateIn()

      GlobalEmitter.emit('experience-end_in')
      this.raycastMeshes = []
      this.raycastMeshes.push(this.titles[index].__button.mesh)
      this.raycastMeshes.push(this.titles[index].__link.mesh)
    }

    if (!this.titles[index].__tracked) {
      this.titles[index].__tracked = true

      if (index === 0) {
        // INTRO
        window.dataLayer.push({
          event: 'virtualPageView',
          page: {
            trackingPath: '/Home/campaign/bewonderverwonder/start',
          },
        })
      } else {
        window.dataLayer.push({
          event: 'virtualPageView',
          page: {
            trackingPath: '/Home/campaign/bewonderverwonder/end',
          },
        })
      }
    }
  }

  animateOutTitle(index) {
    if (!this.titles[index].__isAnimated) return
    this.titles[index].__isAnimated = false

    let programFirstWord = this.titles[index].__firstWord.mesh.program
    let prograMidWord = this.titles[index].__midWord.mesh.program
    let programUnderline = this.titles[index].__underline.program
    let programLastWord = this.titles[index].__lastWord.mesh.program

    gsap.to(programFirstWord.uniforms.uAnimationOut, {
      value: 1,
      duration: 1.6,
      delay: 0.2,
      ease: 'Cubic.easeIn',
    })
    gsap.to(prograMidWord.uniforms.uAnimationOut, {
      value: 1,
      duration: 1.6,
      delay: 0.1,
      ease: 'Cubic.easeIn',
    })
    gsap.to(programUnderline.uniforms.uTransition, {
      value: 0.0,
      duration: 1.6,
      delay: 0.1,
      ease: 'Cubic.easeIn',
    })

    gsap.to(programLastWord.uniforms.uAnimationOut, {
      value: 1,
      duration: 1.6,
      delay: 0.0,
      ease: 'Cubic.easeIn',
    })

    if (index === 1) {
      GlobalEmitter.emit('experience-end_out')
      this.titles[index].__button.animateOut()
      this.titles[index].__link.animateOut()
    }
  }

  animateInSentence(chapterIndex) {
    if (this.products[chapterIndex].__isAnimated) return
    this.products[chapterIndex].__isAnimated = true

    if (!this.CONFIG.products[chapterIndex].unlock) {
      this.CONFIG.products[chapterIndex].unlock = true
      GlobalEmitter.emit('product_unlock', chapterIndex)
    }

    this.activeProduct = chapterIndex
    GlobalEmitter.emit('active_product', chapterIndex)
    this.raycastActiveProduct(this.activeProduct)

    let programFirstLine = this.products[chapterIndex].__firstLine.mesh.program
    let prograMidLine = this.products[chapterIndex].__secondLine.mesh.program

    gsap.killTweensOf([programFirstLine.uniforms.uAnimationOut, prograMidLine.uniforms.uAnimationOut])

    programFirstLine.uniforms.uAnimationIn.value = 0.0
    prograMidLine.uniforms.uAnimationIn.value = 0.0
    programFirstLine.uniforms.uAnimationOut.value = 0.0
    prograMidLine.uniforms.uAnimationOut.value = 0.0

    gsap.to(programFirstLine.uniforms.uAnimationIn, {
      value: 1,
      duration: 1.3,
      ease: 'Cubic.easeOut',
    })
    gsap.to(prograMidLine.uniforms.uAnimationIn, {
      value: 1,
      duration: 1.3,
      delay: 0.1,
      ease: 'Cubic.easeOut',
    })

    if (!this.products[chapterIndex].__tracked) {
      this.products[chapterIndex].__tracked = true

      window.dataLayer.push({
        event: 'virtualPageView',
        page: {
          trackingPath: `/Home/campaign/bewonderverwonder/product${chapterIndex + 1}`,
        },
      })
    }
  }
  animateOutSentence(chapterIndex) {
    if (!this.products[chapterIndex].__isAnimated) return
    this.products[chapterIndex].__isAnimated = false

    let programFirstLine = this.products[chapterIndex].__firstLine.mesh.program
    let prograMidLine = this.products[chapterIndex].__secondLine.mesh.program
    // let programButton = this.products[chapterIndex].__button.program

    gsap.to(programFirstLine.uniforms.uAnimationOut, {
      value: 1,
      duration: 1.4,
      delay: 0.2,
      ease: 'Cubic.easeIn',
    })
    gsap.to(prograMidLine.uniforms.uAnimationOut, {
      value: 1,
      duration: 1.4,
      ease: 'Cubic.easeIn',
    })
  }

  playNextAudio(id) {
    if (id === this.currentAudio) return
    this.currentAudio = id
    let name = AUDIO_IDS[id]
    SoundController.playNext(name)
  }

  update(progress) {
    if (!this.active) return

    this.experienceProgress = progress * 100

    if (this.products[this.activeProduct]) {
      this.products[this.activeProduct].__button.update()
    }

    if (this.soundReady) {
      for (let i = 0; i < AUDIO_TIMELINE.length; i++) {
        let inrange = this.experienceProgress > AUDIO_TIMELINE[i].start && this.experienceProgress < AUDIO_TIMELINE[i].end
        if (inrange) {
          this.playNextAudio(i)
          break
        }
      }
    }

    // this.debug()
    for (let i = 0; i < ANIMATION_TIMELINE.length; i++) {
      let productIndex = i - 1

      if (this.experienceProgress > ANIMATION_TIMELINE[i].start && this.experienceProgress < ANIMATION_TIMELINE[i].end) {
        this.products[productIndex] && !this.products[productIndex].__isAnimated && this.animateInSentence(productIndex)

        if (ANIMATION_TIMELINE[i].title > -1 && !this.titles[ANIMATION_TIMELINE[i].title].__isAnimated) {
          // console.log('in title', i)
          this.animateInTitle(ANIMATION_TIMELINE[i].title)
        }
      } else {
        this.products[productIndex] && this.products[productIndex].__isAnimated && this.animateOutSentence(productIndex)

        if (ANIMATION_TIMELINE[i].title > -1 && this.titles[ANIMATION_TIMELINE[i].title].__isAnimated) {
          // console.log('out title', i)
          this.animateOutTitle(ANIMATION_TIMELINE[i].title)
        }
      }
    }
  }
}
