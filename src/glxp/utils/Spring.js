class Spring {
  constructor({ mass = 1, damping = 10, stiffness = 100, timeScale = 1, soft = false } = {}) {
    this.mass = mass
    this.damping = damping
    this.stiffness = stiffness
    this.timeScale = timeScale
    this.soft = soft
  }

  solve(from, velocity, to) {
    const delta = to - from
    if (true === this.soft || 1.0 <= this.damping / (2.0 * Math.sqrt(this.stiffness * this.mass))) {
      const angular_frequency = -Math.sqrt(this.stiffness / this.mass)
      const leftover = -angular_frequency * delta - velocity
      return (t) => to - (delta + t * this.timeScale * leftover) * Math.E ** (t * this.timeScale * angular_frequency)
    } else {
      const damping_frequency = Math.sqrt(4.0 * this.mass * this.stiffness - this.damping ** 2.0)
      const leftover = (this.damping * delta - 2.0 * this.mass * velocity) / damping_frequency
      const dfm = (0.5 * damping_frequency) / this.mass
      const dm = -(0.5 * this.damping) / this.mass
      return (t) => to - (Math.cos(t * this.timeScale * dfm) * delta + Math.sin(t * this.timeScale * dfm) * leftover) * Math.E ** (t * this.timeScale * dm)
    }
  }
}

export default Spring
