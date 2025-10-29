import Alea from 'alea'

let prng = null
const random = {
  genSeed(seed) {
    _seed = seed || Math.random()
    // console.log("[Random] seed :", _seed)
    prng = new Alea(_seed)
  },

  getSeed() {
    return _seed
  },

  getNext(min = 0, max = 1) {
    return prng() * (max - min) + min
  },
}

// let seed = "dorian"
let seed = window.fxhash.slice(0, 0) + window.fxhash.slice(10, window.fxhash.length)

random.genSeed(seed)
// Random.genSeed()

export { random }
