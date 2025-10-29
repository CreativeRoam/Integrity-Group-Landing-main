export default class GLMonitor {
  disjointTimerExtension
  query

  constructor(gl) {
    const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext
    if (!isWebGL2) return new Error('This monitor needs WebGL2 to function')

    this.disjointTimerExtension = gl.getExtension('EXT_disjoint_timer_query_webgl2')
    console.log(this.disjointTimerExtension)

    this.query = gl.createQuery()
  }

  begin(gl) {
    gl.beginQuery(this.disjointTimerExtension.TIME_ELAPSED_EXT, this.query)
  }

  end(gl) {
    gl.endQuery(this.disjointTimerExtension.TIME_ELAPSED_EXT)
  }

  getResult(gl) {
    // ...at some point in the future, after returning control to the browser and being called again:
    // (Note that this code might be called multiple times)
    if (this.query) {
      let available = gl.getQueryParameter(this.query, gl.QUERY_RESULT_AVAILABLE)

      if (!available) {
        console.error('GLMonitor result not available')
        return false
      }

      let disjoint = gl.getParameter(this.disjointTimerExtension.GPU_DISJOINT_EXT)

      if (available && !disjoint) {
        // See how much time the rendering of the object took in nanoseconds
        const nanoseconds = gl.getQueryParameter(this.query, gl.QUERY_RESULT)
        // Convert to milliseconds
        return nanoseconds / 1000000
      }

      if (available || disjoint) {
        console.log('cleaning')
        // Clean up the this.query object
        gl.deleteQuery(this.query)
        // Don't re-enter this polling loop
        this.query = null
        console.error('GLMonitor cleaning up')
        return false
      }
    }
  }
}
