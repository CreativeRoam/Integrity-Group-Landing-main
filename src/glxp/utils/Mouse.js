import { vec2, vec3 } from 'gl-matrix'
import Emitter from 'event-emitter'

// Utils
import RAF from '@/glxp/utils/RAF'
import { mod, clamp } from '@/glxp/utils/math'
import { isMobile } from '@/glxp/utils/device'

// Debug
import DebugController from '@/glxp/debug/DebugController'

const _VEC2 = vec2.create()

class Mouse {
  constructor(target) {
    this.cursor           = vec2.fromValues(0, 0)
    this.downCursor       = vec2.fromValues(0, 0)
    this.drag             = vec2.fromValues(0, 0)
    this.dragStartCursor  = vec2.fromValues(0, 0)
    this.lastCursor       = vec2.fromValues(0, 0)
    this.velocity         = vec2.fromValues(0, 0)
    this.dampedCursor     = vec2.fromValues(0.5, 0.5)

    this.target         = target || window
    this.wheelVelocity  = vec2.fromValues(0, 0)
    this.wheel          = vec2.fromValues(0, 0)
    this.lastWheel      = vec2.fromValues(0, 0)
    this.screenWidth    = window.innerWidth
    this.screenHeight   = window.innerHeight
    this.isDown         = false
    this.isDragging     = false
    this.wheelDir       = null

    this.isPinching = false
    this.pinchDistanceStart = 0
    this.pinchDistance = 0

    this.wheelConfigBy = 0.07
    this.wheelSpeed = 0.35
    this.isWheelLock = false
    this.normalizeWheel = 0
    this.current = 0
    this.maxWheel = 3750
    this.minDistanceToTriggerDrag = 0.01

    this.emitter = {}

    this.preventDamping = false
    this.preventIOSGestures = true

    Emitter(this.emitter)
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)

    RAF.subscribe('mouse', () => {
      this.update()
    })

    this.config = {
      damping: { value: 0.175, params: { min: 0, max: 0.5, step: 0.001 } },
    }

    // DebugController.addBlade(this.config, 'Mouse')

    this.initEvents()

    window.__debugMouse = this
  }

  initEvents() {
    if (isMobile) {
      this.target.addEventListener('touchstart', (event) => {
        this.onTouchStart(event)
      })
      this.target.addEventListener('touchend', (event) => {
        this.onTouchEnd(event)
      })
      this.target.addEventListener('touchmove', (event) => {
        this.onTouchMove(event)
      })

      if (this.preventIOSGestures) {
        document.addEventListener('gesturestart', (event) => {
          event.preventDefault()
          document.body.style.zoom = 0.99
        })
        document.addEventListener('gesturechange', function (event) {
          event.preventDefault()
          document.body.style.zoom = 0.99
        })
        document.addEventListener('gestureend', function () {
          document.body.style.zoom = 1
        })
      }
    } else {
      this.target.addEventListener('mousedown', (event) => {
        this.onDown(event)
      })
      this.target.addEventListener('mousemove', (event) => {
        this.onMouve(event)
      })
      this.target.addEventListener('mouseup', (event) => {
        this.onUp(event)
      })
      this.target.addEventListener(
        'wheel',
        (event) => {
          this.onWheel(event)
        },
        { passive: false }
      )
    }

    this.target.addEventListener('click', () => {
      this.emitter.emit('click')
    })
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth
      this.screenHeight = window.innerHeight
    })
  }

  onTouchStart(event) {
    if (event && event.touches.length === 2) {
      this.isPinching = true
      this.pinchDistanceStart = Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY)
      this.emitter.emit('pinch-start', this)
    } else {
      const e = event.touches[0] ? event.touches[0] : event
      this.onDown(e)
    }
  }

  onTouchEnd(event) {
    if (this.isPinching && event.touches.length < 3) {
      this.isPinching = false
      this.pinchDistanceStart = 0
      this.pinchDistance = 0
    }
    const e = event.touches[0] ? event.touches[0] : event
    this.onUp(e)
  }

  onTouchMove(event) {
    if (this.isPinching) {
      this.pinchDistance = this.pinchDistanceStart - Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY)
      this.emitter.emit('pinch', this)
    } else {
      const e = event.touches[0] ? event.touches[0] : event
      this.onMouve(e)
    }
  }

  onDown(event) {
    this.cursor[0] = (event.clientX / this.screenWidth - 0.5) * 2
    this.cursor[1] = (event.clientY / this.screenHeight - 0.5) * 2
    this.lastCursor[0] = this.cursor[0]
    this.lastCursor[1] = this.cursor[1]
    this.downCursor[0] = this.cursor[0]
    this.downCursor[1] = this.cursor[1]
    this.dragStartCursor[0] = this.cursor[0]
    this.dragStartCursor[1] = this.cursor[1]
    this.isDown = true
    this.emitter.emit('down', this)
  }

  onUp(event) {
    this.isDown = false
    this.isDragging = false
    this.emitter.emit('up', this)
  }

  onWheel(event) {
    // event.preventDefault()
    if (!this.isWheelLock) {
      this.lastWheel[0] = this.wheel[0]
      this.lastWheel[1] = this.wheel[1]
      this.wheel[0] = event.deltaX
      this.wheel[1] = event.deltaY
      this.wheelDir = event.deltaY < 0 ? 'up' : 'down'

      this.current += event.deltaY * this.wheelConfigBy * this.wheelSpeed
      this.current = clamp(this.current, 0, this.maxWheel)
      this.normalizeWheel = this.current / this.maxWheel

      this.emitter.emit('wheel', this)
    }
  }

  onMouve(event) {
    this.cursor[0] = (event.clientX / this.screenWidth - 0.5) * 2
    this.cursor[1] = (event.clientY / this.screenHeight - 0.5) * 2
    this.emitter.emit('mouve', this)

    if (this.isDown) {
      // use this.drag when working on a drag/release element
      this.drag[0] = this.cursor[0] - this.downCursor[0]
      this.drag[1] = this.cursor[1] - this.downCursor[1]
      this.downCursor[0] = this.cursor[0]
      this.downCursor[1] = this.cursor[1]

      // avoid triggering drag if the cursor hasn't moved more than 0.01
      if (vec2.dist(this.dragStartCursor, this.cursor) > this.minDistanceToTriggerDrag) {
        this.isDragging = true
        this.emitter.emit('drag', this)
      }
    }

    if (!this.isWheelLock && isMobile) {
      let y = (this.cursor[1] - this.lastCursor[1]) * -0.01
      this.normalizeWheel = clamp(y + this.normalizeWheel, 0, 1)
    }
  }

  update() {
    this.velocity[0] = this.cursor[0] - this.lastCursor[0]
    this.velocity[1] = this.cursor[1] - this.lastCursor[1]
    this.wheelVelocity[0] = this.wheel[0] - this.lastWheel[0]
    this.wheelVelocity[1] = this.wheel[1] - this.lastWheel[1]
    this.lastCursor[0] = this.cursor[0]
    this.lastCursor[1] = this.cursor[1]

    if (!this.preventDamping) {
      vec2.sub(_VEC2, this.cursor, this.dampedCursor)
      vec2.scale(_VEC2, _VEC2, this.config.damping.value)
      vec2.add(this.dampedCursor, this.dampedCursor, _VEC2)
    }
  }
}

const out = new Mouse()
export default out
