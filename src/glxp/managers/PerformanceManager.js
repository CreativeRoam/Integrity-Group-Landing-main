import { isMobile } from '@/glxp/utils/device'
import { getProxyState } from '@/glxp/utils/getProxyState'
import { getAverage } from '@/glxp/utils/math'
import RAF from '@/glxp/utils/RAF'

/**
 * Modulates render quality settings according to performance targets, based on average framerates calculated when WebGL is active and window is focused.
 * 
 * State explained:
 * 
 * 'dynamic': with each average FPS calculation performed by the FramerateManager, the WebGLManager sends an event that contains {baseFPS, cappedFPS, delta} and adjusts the quality settings as many times as necessary based on the delta of FPS per frame compared to baseFPS.
 * Advantages: we can upgrade or downgrade the quality at any time, if needed.
 * Disadvantages: it is delicate to calibrate, sometimes it falls into infinite loops where the calculation alternates between quality upgrades and downgrades.
 *
 * 'static': with each average FPS calculation, if it falls below arbitrary thresholds, the quality settings are permanently lowered.
 * Advantages: configuration and operation are very straightforward, and we never fall into infinite loops like in dynamic mode.
 * Disadvantages: less flexible, it is more prone to cases where the quality is downgraded when it doesn't need to be.
 */
const RENDER_QUALITY = {
  NORMAL: 0,
  LOW: 1,
  POTATO: 2
}
export default class PerformanceManager {
  webglManager
  active = true
  thresholds = {
    potato: 0,
    low: 0,
    normal: 0
  }
  state = getProxyState({
    mode: 'static', // 'static' or 'dynamic', see comment above for more info
    renderQuality: RENDER_QUALITY.NORMAL
  })
  windowIsBlurred = false
  perfCheckHistory = []
  onAverageCallback = null
  averageFPS = 60
  fps = 60
  arrayFPS = []
  averageCount = 60  // each n frames, calculate the average fps
  enableLogs = false

  constructor(webglManager, { thresholds }) {
    this.webglManager = webglManager
    this.thresholds = thresholds
    this.setEvents()
  }

  setEvents = () => {
    window.addEventListener('blur', () => {
      this.windowIsBlurred = true
    })

    window.addEventListener('visibilitychange', (e) => {
      if (document.visibilityState === 'visible') {
        this.windowIsBlurred = false
      } else {
        this.windowIsBlurred = true
      }
    })

    window.addEventListener('focus', () => {
      this.windowIsBlurred = false
    })

    this.state.onChange('renderQuality', this.onRenderQualityChange)
  }

  onRenderQualityChange = (renderQuality) => {
    if (this.enableLogs) console.warn(`Set WebGL to ${renderQuality} quality`)

    switch (renderQuality) {
      case RENDER_QUALITY.NORMAL:
        this.webglManager.dpr = Math.min(window.devicePixelRatio, 2)
        break;

      case RENDER_QUALITY.LOW:
        this.webglManager.dpr = 1
        break;

      case RENDER_QUALITY.POTATO:
        this.webglManager.dpr = 1
        this.setActive(false)
        break;

      default:
        break;
    }

    this.webglManager.resize()
    // Kept just in case, but now called directly in .resize()
    // this.webglManager._emitter.emit('resize')
  }

  // When average FPS is calculated
  setOnAverageCallback = (onAverageCallback) => {
    this.onAverageCallback = onAverageCallback
  }

  setDebugEvents = () => {
    if (this.enableLogs) console.log("set debug events");

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') this.active = !this.active

      const shouldDowngrade = e.code === 'ArrowDown'
      const shouldUpgrade = e.code === 'ArrowUp'

      if (shouldDowngrade) {
        this.downgradeQuality()
      } else if (shouldUpgrade) {
        this.upgradeQuality()
      }
    })
  }

  onPerfCheck = (event) => {
    if (this.enableLogs) {
      console.log('perf-check', event);
      // console.log('is perf check active ?', this.active)
    }
    if (!this.active || document.hidden || this.windowIsBlurred) return

    switch (this.state.mode) {
      case 'static':
        {
          if (event.fps > this.thresholds.potato && event.fps <= this.thresholds.low) {
            this.state.renderQuality = 'low'
          } else if (event.fps <= this.thresholds.potato) {
            this.state.renderQuality = 'potato'
          }
        }
        break;

      case 'dynamic':
        {
          // sensitive part, these multipliers and booleans should change on each project
          const toleranceMultiplier = isMobile ? .5 : .3; // more tolerant on mobile

          const shouldDowngrade = event.delta > (event.cappedFPS * toleranceMultiplier)
          const shouldUpgrade = event.delta <= -11

          if (shouldDowngrade) {
            this.downgradeQuality()
          } else if (shouldUpgrade) {
            this.upgradeQuality()
          }

          if (this.enableLogs) {
            console.log("should downgrade: ", shouldDowngrade);
            console.log("should upgrade: ", shouldUpgrade);
          }

          if (shouldDowngrade || shouldUpgrade) {
            this.webglManager.resize()
            this.webglManager._emitter.emit('resize')
          }
        }
        break;

      default:
        break;
    }
  }

  upgradeQuality = () => {
    if (this.state.renderQuality == RENDER_QUALITY.LOW) {
      this.state.renderQuality = RENDER_QUALITY.NORMAL
    } else if (this.state.renderQuality == RENDER_QUALITY.POTATO) {
      this.state.renderQuality = RENDER_QUALITY.LOW
    }
  }

  downgradeQuality = () => {
    if (this.state.renderQuality == RENDER_QUALITY.NORMAL) {
      this.state.renderQuality = RENDER_QUALITY.LOW
    } else if (this.state.renderQuality == RENDER_QUALITY.LOW) {
      this.state.renderQuality = RENDER_QUALITY.POTATO
    }
  }

  setActive = (toggle) => {
    this.active = toggle
  }

  // Do not launch on first frames drawn as it will not be accurate
  activate() {
    if (this.enableLogs) console.log("call activate perf check");

    for (const scene of Object.values(this.webglManager.scenes)) {
      if (!scene.scene) {
        console.error(
          "attempted to launch PerformanceManager when scenes weren't constructed yet"
        )
      } else if (
        this.webglManager.forceAllDraw ||
        this.webglManager.drawcalls < 40
      ) {
        console.error('attempted to launch PerformanceManager on first frames')
      }
    }

    if (this.enableLogs) console.log("activate perf check");
    this.active = true
  }

  // Call this every rendered frame
  update = () => {
    if (!this.active || this.windowIsBlurred) return

    if (this.arrayFPS.length < this.averageCount) {
      this.fps = Math.round(1 / (Math.max(RAF.dt, 1) / 1000)) // RAF.dt is in ms from last frame, i.e: 8 for 120fps. It can sometimes return 0, so we use Math.max to prevent division by 0.
      this.arrayFPS.push(this.fps)
    } else {
      this.averageFPS = getAverage(this.arrayFPS)
      this.arrayFPS = [] // Clear array to prep for next round of averaging
      this.onAverageCallback && this.onAverageCallback(this.averageFPS)
    }
  }
}
