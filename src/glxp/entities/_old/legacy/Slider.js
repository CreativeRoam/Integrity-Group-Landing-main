import { vec2 } from 'gl-matrix';
import DebugController from '@/glxp/debug/DebugController'
import Slide from '@/glxp/entities/Slide'
import { GUI_PANEL_CUSTOM } from '@/glxp/data/dataGUIPanels'
import { Raycast } from '../ogl/extras/Raycast';
import { Transform } from '../ogl/core/Transform';
import { getProxyState } from '@/glxp/utils/getProxyState';

class Slider {
  scene
  raycaster

  root = new Transform()
  slides = []
  center = vec2.create()
  config = {
    Spacing: { value: 1.5, params: { min: 0, max: 3, step: 0.01 } },
    GlobalOpacity: { value: 1, params: { min: 0, max: 1, } },
  }
  state = getProxyState({ initialIndex: 2, activeIndex: 2 }) // warning: always set the same value for both at init

  /**
   * A group of planes that behaves as an infinite slider
   * 
   * @param {SceneAbs} scene - parent scene
   * @param {{ opacity, raycaster }} options
   * @param {Raycast} options.raycaster - raycaster to use for interaction
   * @param {Transform} options.parent - root parent
   */
  constructor(scene, { raycaster = null, parent = null }) {
    this.scene = scene
    this.raycaster = raycaster

    this.initSlides()
    this.addEvents()

    for (let index = 0; index < this.slides.length; index++) {
      const slide = this.slides[index];
      // Set first active slide
      if (index === this.state.initialIndex) {
        slide.state.active = true
      }
    }

    this.root.setParent(parent ? parent : scene.root)
  }

  initSlides() {
    this.slides = new Array(5).fill({}).map((_, i) => new Slide(this.scene, 'slide', {
      scale: 1,
      name: `Slide ${i}`,
      textureId: `Slide_0${i}`,
      parent: this.root,
      transparent: true,
    }))
    
    for (let index = 0; index < this.slides.length; index++) {
      const slide = this.slides[index];
      // Set the slides position
      slide.mesh.position.x = index * this.config.Spacing.value
    }
  }

  initGui() {
    this.gui = DebugController.addBlade(this.config, `${this.scene.name} - Slider`, GUI_PANEL_CUSTOM)

    // Spacing parameter
    this.gui && this.gui.params.Spacing.on("change", (e) => {
      for (let index = 0; index < this.slides.length; index++) {
        const slide = this.slides[index];
        slide.mesh.position.x = index * this.config.Spacing.value
      }
    })

    // Global opacity parameter
    this.gui && this.gui.params.GlobalOpacity.on("change", (e) => {
      for (let index = 0; index < this.slides.length; index++) {
        const slide = this.slides[index];
        slide.alpha = this.config.GlobalOpacity.value
      }
    })
  }

  setActiveSlide = (nextIndex) => {
    this.slides.forEach((slide, slideIndex) => {
      if (slideIndex === nextIndex) {
        slide.state.active = true
      } else {
        slide.state.active = false
      }
    })
  }

  onActiveIndexChange = (nextIndex) => {
    //this.goTo(nextIndex)
    this.setActiveSlide(nextIndex)
  }

  addEvents = () => {
    this.state.onChange("activeIndex", this.onActiveIndexChange)

    for (const slide of this.slides) {
      slide.addEvents()
    }
  }

  onLoaded() {
    this.initGui()

    for (const slide of this.slides) {
      slide.initGui(this.gui)
      slide.onLoaded()
    }
  }

  preRender() {
    for (const slide of this.slides) {
      slide.preRender()
    }
  }
}

export default Slider
