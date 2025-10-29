import { load, setLoaderOptions } from '@loaders.gl/core'
import { GLBLoader, GLTFLoader } from '@loaders.gl/gltf'
import { DracoLoader } from '@loaders.gl/draco'

function _appendBuffer(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
  tmp.set(new Uint8Array(buffer1), 0)
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength)
  return tmp.buffer
}

function _supportsWorkerType() {
  let supports = false
  const tester = {
    get type() {
      supports = true
    }, // it's been called, it's supported
  }
  try {
    // We use "blob://" as url to avoid an useless network request.
    // This will either throw in Chrome
    // either fire an error event in Firefox
    // which is perfect since
    // we don't need the worker to actually start,
    // checking for the type of the script is done before trying to load it.
    const worker = new Worker('blob://', tester)
  } finally {
    return supports
  }
}

class Loader {
  constructor(url, hasDracoCompression = true) {
    this.supportsWorker = _supportsWorkerType()
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
    })

    // load draco worker from project vendors, not from a CDN, for CSP reasons
    setLoaderOptions({
      draco: {
        workerUrl: '/glxp/loaders/draco/worker_4.0.0-alpha.10/draco-worker.js',
      },
    })

    if (hasDracoCompression) this.loadDraco(url)
    else this.load(url)

    return this.promise
  }

  // Current versions:
  // draco_wasm_wrapper.js: 1.5.5
  // draco-worker: 3.4.4
  async loadDraco(url) {
    const gltf = await load(url, GLTFLoader, { DracoLoader, CDN: false, worker: this.supportsWorker });
    gltf.isDracoCompressed = true
    this.resolve(gltf)
  }

  async load(url) {
    const gltf = await load(url, GLBLoader)
    gltf.isDracoCompressed = false

    let buff = new ArrayBuffer()
    for (let i = 0; i < gltf.binChunks.length; i++) {
      const chunk = gltf.binChunks[i]
      buff = _appendBuffer(buff, chunk.arrayBuffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength))
    }

    gltf.json.bin = buff
    gltf.json.isDracoCompressed = gltf.isDracoCompressed
    this.resolve(gltf.json)
  }
}

export default Loader
