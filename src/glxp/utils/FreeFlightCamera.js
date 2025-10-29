import Camera from './Camera'
import { vec3 } from 'gl-matrix'
import Mouse from '@/glxp/utils/Mouse'
import DebugController from '@/glxp/debug/DebugController'

class FreeFlightCamera extends Camera {
  constructor(scene, fov) {
    super(scene, fov)

    this.cameraPositionTarget = vec3.fromValues(-420, 87, 679)
    this.cameraPosition = vec3.fromValues(0, 0, 0)
    this.cameraDirection = vec3.create()

    this.rotation = vec3.fromValues(0, 3.0753424167633057, 0)

    document.addEventListener('keydown', (e) => {
      this.onKeyDown(e)
    })

    this.config = {
      speed: { value: 30, range: [0, 50] },
    }

    DebugController.addConfig(this.config, 'Free Fligth Camera')
  }

  onKeyDown(e) {
    if (e.key == 'w') {
      this.cameraPositionTarget[2] -= this.config.speed.value * 2
    }
    if (e.key == 's') {
      this.cameraPositionTarget[2] += this.config.speed.value * 2
    }
    if (e.key == 'a') {
      this.cameraPositionTarget[0] -= this.config.speed.value
    }
    if (e.key == 'd') {
      this.cameraPositionTarget[0] += this.config.speed.value
    }
    if (e.key == 'q') {
      this.cameraPositionTarget[1] -= this.config.speed.value
    }
    if (e.key == 'e') {
      this.cameraPositionTarget[1] += this.config.speed.value
    }
  }

  update() {
    if (Mouse.isDown) {
      this.rotation[1] += Mouse.velocity[0] * 0.5
      // this.rotation[0] += Mouse.velocity[1] * .5
    }

    vec3.sub(this.cameraDirection, this.cameraPositionTarget, this.cameraPosition)
    vec3.scale(this.cameraDirection, this.cameraDirection, 0.1)
    vec3.add(this.cameraPosition, this.cameraPosition, this.cameraDirection)

    this.node.position[0] = this.cameraPosition[0]
    this.node.position[1] = this.cameraPosition[1]
    this.node.position[2] = this.cameraPosition[2]

    this.node.rotation[0] = this.rotation[0]
    this.node.rotation[1] = this.rotation[1]
    this.node.rotation[2] = this.rotation[2]

    this.node.needUpdate = true
  }
}
export default FreeFlightCamera
