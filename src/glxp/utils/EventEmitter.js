import Emitter from 'event-emitter'

class EventEmitter {
  constructor() {
    this._emitter = {}
    Emitter(this._emitter)
    this.on = this._emitter.on.bind(this._emitter)
    this.off = this._emitter.off.bind(this._emitter)
    this.emit = this._emitter.emit.bind(this._emitter)
    this.once = this._emitter.once.bind(this._emitter)
  }
}

export default new EventEmitter()
