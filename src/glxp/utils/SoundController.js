import { Howl, Howler } from 'howler'
import when from 'when'
import Manifest from '@/glxp/manifest'
import GlobalEmitter from '@/glxp/utils/EventEmitter'

class SoundController {
  constructor() {
    this.ready = when.defer()
    this.sounds = {}
    this.muted = false
    this.isInit = false
    this.initEvents()
    // window.__soundController = this
  }

  initEvents() {
    window.addEventListener('blur', () => {
      if (this.isInit) Howler.volume(0)
    })
    window.addEventListener('focus', () => {
      if (this.muted == false && this.isInit) {
        Howler.volume(1.0)
      }
    })
  }

  getLoadables() {
    this.isInit = true
    let promises = []
    let i = 0
    for (const key in Manifest.audio) {
      if (Manifest.audio.hasOwnProperty(key)) {
        let promise = when.defer()
        promises.push(promise)

        setTimeout(() => {
          let audio = new Howl({
            src: [Manifest.audio[key], Manifest.mp3[key]],
            html5: false,
          })
          this.sounds[key] = {
            audio: audio,
            defer: promise,
            loop: true,
            looping: false,
            playing: false,
            playTime: null,
            active: false,
          }

          audio.once('load', () => {
            if (key === 'audio_intro') {
              Howler.volume(1.0)
              this.current = 'audio_intro'
              this.playAndLoop('audio_intro')
            }
            promise.resolve(audio)
          })
        }, 200 * i)

        i++
      }
    }
    when.all(promises).then(() => {
      this.onLoaded()
    })
    return promises
  }

  onLoaded() {
    GlobalEmitter.emit('audio_loaded')
    this.ready.resolve()
  }

  play(id) {
    if (this.sounds[id] && this.sounds[id].audio) {
      this.sounds[id].audio.seek(0)
      this.sounds[id].audio.play()
    }
  }

  stop(id) {
    if (this.sounds[id] && this.sounds[id].audio) {
      this.sounds[id].audio.stop()
      this.sounds[id].playTime = null
    }
  }

  toggleMute() {
    if (!this.muted) {
      Howler.volume(0)
    } else {
      Howler.volume(1.0)
    }
    this.muted = !this.muted
  }

  setVolume(id, vol) {
    if (this.sounds[id] && this.sounds[id].audio) {
      this.sounds[id].audio.volume(vol)
    }
  }

  fadeTo(id, vol, time) {
    if (this.sounds[id] && this.sounds[id].audio) {
      this.sounds[id].audio.fade(0, vol, time)
    }
  }

  playNext(id) {
    if (id === this.current) return

    if (this.sounds[this.current] && this.sounds[this.current].audio) {
      // console.log('FADEOUT', this.sounds[this.current])
      this.fadeOut(this.current)
    }
    if (this.sounds[id] && this.sounds[id].audio) {
      // console.log('FADE IN', this.sounds[id])
      this.fadeIn(id)
    }
  }

  fadeIn(id) {
    if (this.sounds[id] && this.sounds[id].audio) {
      // this.sounds[id].audio.seek(0)
      this.sounds[id].audio.play()
      this.sounds[id].audio.fade(0, 0.5, 800)
      this.sounds[id].playing = true
      this.sounds[id].playTime = Date.now()

      this.current = id
    }
  }

  fadeOut(id) {
    if (this.sounds[id] && this.sounds[id].audio) {
      this.sounds[id].audio.fade(0.5, 0, 2000)
      setTimeout(() => {
        this.sounds[id].audio.stop()
        this.sounds[id].playing = false
        this.sounds[id].playTime = null
      }, 1500)
    }
  }

  playAndLoop(id) {
    if (this.sounds[id] && this.sounds[id].audio && !this.sounds[id].looping) {
      this.sounds[id].audio.loop(true)
      this.sounds[id].audio.play()
      this.sounds.looping = true
      this.sounds.playing = true
    }
  }

  updateProgress(progress) {
    for (let i = 0; i < LOOP_PARAMS.length; i++) {
      const params = LOOP_PARAMS[i]
      if (progress > params.in && progress < params.out) {
        if (params.active == false) {
          params.active = true
          this.setVolume(params.name, 0)
          this.playAndLoop(params.name)
          this.fadeTo(params.name, 1, 1000)
        }
      } else {
        if (params.active == true) {
          params.active = false
          this.fadeOut(params.name)
        }
      }
    }
  }
}

const out = new SoundController()
export default out
