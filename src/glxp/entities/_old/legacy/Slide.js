import PlaneEntity from "./Plane";
import { GUI_PANEL_UNLIT } from '@/glxp/data/dataGUIPanels'
import DebugController from '@/glxp/debug/DebugController'
import { getProxyState } from '@/glxp/utils/getProxyState';

const BASE_OPACITY = 0.33
export default class Slide extends PlaneEntity {
  config = {
    Opacity: { value: 1, params: { min: 0, max: 1, } }
  }
  state = getProxyState({ active: false, })
  opacity = {
    target: BASE_OPACITY,
    current: BASE_OPACITY,
    damping: 0.02,
    delta: 0
  }

  /**
   * Meant to be used as a Slide in Slider.js
   * */
  constructor(
    scene,
    shader,
    options
  ) {
    super(scene, shader, options)
  }

  initGui = () => {
    this.gui = DebugController.addBlade(this.config, this.name, GUI_PANEL_UNLIT)
  }

  addEvents = () => {
    this.state.onChange("active", (active) => {
      if (active) {
        this.opacity.target = 1
      } else {
        this.opacity.target = BASE_OPACITY
      }
    })
  }

  lerpOpacity = () => {
    this.opacity.delta = this.opacity.target - this.opacity.current
    this.opacity.current += this.opacity.delta * this.opacity.damping
    this.alpha = this.opacity.current * this.config.Opacity.value
    
    // Stop lerping if close enough
    const threshold = 0.0005
    if (this.opacity.delta < threshold) this.alpha = this.opacity.target * this.config.Opacity.value
  }

  preRender = () => {
    super.preRender()
    this.lerpOpacity()
  }
}
