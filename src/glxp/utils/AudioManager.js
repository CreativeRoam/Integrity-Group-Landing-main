import when from 'when'
import Sound from './sounds'
import BreathDetect from './breathingDetecttion'

class AudioManager {
  constructor(manager) {
    this.active = false
    this.ctx = null
    this.sound = Sound
    this.breathing = null

    this.micro = { ctx: null, pcmGain: 0, dampPcmGain: 0, sampling: null, stream: null, source: null, processor: null, analyser: null, data: null }
  }

  getMediaPermission(media) {
    let defer = when.defer()
    let getPermissions = () => {
      let permissionsDefer = when.defer()
      navigator.permissions.query({ name: media }).then((result) => {
        result.onchange = () => {
          getPermissions()
        }
        permissionsDefer.resolve(result.state)
      })
      return permissionsDefer.promise
    }
    if (navigator.permissions) {
      getPermissions().then((result) => {
        defer.resolve(result)
      })
    } else {
      defer.resolve('undefined')
    }
    return defer.promise
  }

  init() {
    let defer = when.defer()
    const AudioContext = window.AudioContext || window.webkitAudioContext || false
    if (!this.active) {
      if (AudioContext) {
        this.ctx = new AudioContext()
        defer.resolve(true)
      } else {
        defer.resolve(false)
      }
    } else {
      defer.resolve(true)
    }
    return defer.promise
  }

  initMicroInput(sampling = 1024) {
    let defer = when.defer()
    const AudioContext = window.AudioContext || window.webkitAudioContext || false
    if (navigator.mediaDevices.getUserMedia && AudioContext) {
      this.micro.ctx = new AudioContext()
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          this.micro.stream = stream
          this.micro.source = this.micro.ctx.createMediaStreamSource(stream)
          this.micro.analyser = this.micro.ctx.createAnalyser()
          this.micro.sampling = sampling
          this.micro.analyser.fftSize = sampling * 2
          this.micro.analyser.smoothingTimeConstant = 0.3
          this.micro.processor = this.micro.ctx.createScriptProcessor(sampling, 1, 1)

          this.micro.source.connect(this.micro.analyser)
          this.micro.analyser.connect(this.micro.processor)
          this.micro.processor.connect(this.micro.ctx.destination)

          this.micro.processor.onaudioprocess = (e) => {
            this.onMicroUpdate(e)
          }

          this.breathing = new BreathDetect(this)

          defer.resolve(true)
        })
        .catch((error) => {
          console.warn(error)
          defer.resolve(false)
        })
    } else {
      defer.resolve(false)
    }
    return defer.promise
  }

  onMicroUpdate(event) {
    this.breathing.onAudioProcess(event)
  }

  updateDamping() {
    let tmp
    tmp = this.micro.pcmGain - this.micro.dampPcmGain
    tmp *= 0.03
    this.micro.pcmGain += tmp
  }
}

export default AudioManager
