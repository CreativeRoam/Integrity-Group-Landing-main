import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'
import Manifest from '@/glxp/manifest'

import { Program } from '@/glxp/ogl/core/Program.js'
import { Geometry } from '@/glxp/ogl/core/Geometry.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Color } from '@/glxp/ogl/math/Color.js'

import { Vec3 } from '@/glxp/ogl/math/Vec3'

import DebugController from '@/glxp/debug/DebugController'
import { GUI_PANEL_CUSTOM } from '@/glxp/data/dataGUIPanels'

class FairyDust {
  constructor (scene, {
    name = 'Particles',
    parent = false,
    position = new Vec3(0,0,0),
    fog = false,
    globalConfig = null,
  }={}) {
    this.gl = scene.gl
    this.scene = scene
    
    // options
    this.name         = name
    this.position     = position
    this.parent       = parent ? parent : scene.root
    this.fog          = fog
    this.globalConfig = globalConfig

    this.transparent = true
    this.depthTest = true
    this.depthWrite = false
    this.pixelRatio = this.scene.dpr
    this.time = 0
    this.defines = {}
    if (this.fog) this.defines['HAS_FOG'] = 1
    this.shader = new Shader(ShaderManifest['fairyDust'], 1, this.defines)

    this.initConfig()
    this.createParticles()
    this.init()
    
  }

  initConfig(){
    this.config = {
      visible:                    { value: true, params: {}},
      volumeCorner:               { value: { x: 0, y: 0, z: 0 }, params: {x: {step: 0.1}, y:{step: 0.1}, z:{step: 0.1} } },
      volumeSize:                 { value: { x: 1, y: 2, z: 1 }, params: {x: {step: 0.1}, y:{step: 0.1}, z:{step: 0.1} } },
      count:                      { value: 1000, params: {min: 1, max: 10000, step: 1}},
      color:                      { value: '#fcfcfc', params: {}},
      color1:                     { value: '#0000ff', params: {}},
      wind_X:                     { value: 0, params: {min: -30, max: 30, step: 0.1} },
      wind_Y:                     { value: 0, params: {min: -30, max: 30, step: 0.1} },
      wind_Z:                     { value: 0, params: {min: -30, max: 30, step: 0.1} },
      TimeScale:                  { value: 1, params: {min: 0, max: 2, step: 0.001} },
      Gravity:                    { value: 0.1, params: {min: -100, max: 100, step: 0.01} },
      LimitsFadeDistance:         { value: 0.1, params: {min: 0, max: 2, step: 0.0001} },
      LimitsFadeIntensity:        { value: 2, params: {min: 0, max: 5, step: 0.1} },
      NoiseIntensity:             { value: 0.03, params: {min: 0, max: 20, step: .0001} },
      NoiseFrenquency:            { value: 20, params: {min: 0, max: 20, step: 0.0001} },
      ParticleOpacity:            { value: 1, params: {min: 0, max: 1, step: 0.01} },
      ParticleScale:              { value: 100, params: {min: 0, max: 1000, step: 0.000001} },
      Alpha:                      { value: 1, params: {min: 0, max: 1, step: 0.01} },

      BorderSize:                 { value: 0.0025, params: { min: 0, max: 0.1, step: .001 } },
      DiscRadius:                 { value: 0.025, params: { min: 0, max: 0.1, step: .001 } },
      BorderSize1:                { value: 0.15, params: { min: 0, max: 1, step: .001 } },
      DiscRadius1:                { value: 0.025, params: { min: 0, max: 1, step: .001 } },
    }

    // override config values with the ones from the manifest if they exist
    const manifestMaterial = Manifest.materials[this.name]
    if (manifestMaterial) {
      for (const key in manifestMaterial) {
        const attribute = manifestMaterial[key]
        if (this.config[key]) {
          if (key === 'volumeCorner' || key === 'volumeSize') {
            this.config[key].value.x = attribute[0]
            this.config[key].value.y = attribute[1]
            this.config[key].value.z = attribute[2]
          } else {  
            this.config[key].value = attribute
          }
        }
      }
    }

    this.alpha = this.config.Alpha.value
    this.count = this.config.count.value
    this.wind = [this.config.wind_X.value, this.config.wind_Y.value, this.config.wind_Z.value]
    this.timeScale = this.config.TimeScale.value
    this.gravity = this.config.Gravity.value
    this.limitsFadeDistance = this.config.LimitsFadeDistance.value
    this.limitsFadeIntensity = this.config.LimitsFadeIntensity.value
    this.noiseIntensity = this.config.NoiseIntensity.value
    this.noiseFrenquency = this.config.NoiseFrenquency.value
    this.offset = [0, 0, 0]
  }

  createParticles() {
    let count = this.count
    let points = []
    let seeds = []

    while (count--) {
      points.push( Math.random() * this.config.volumeSize.value.x - this.config.volumeSize.value.x / 2 )
      points.push( Math.random() * this.config.volumeSize.value.y - this.config.volumeSize.value.y / 2 )
      points.push( Math.random() * this.config.volumeSize.value.z - this.config.volumeSize.value.z / 2 )
      seeds.push( Math.random())
      seeds.push( Math.random())
      seeds.push( Math.random())
      seeds.push( Math.random())
    }

    this.vertices = new Float32Array(points)
    this.seeds = new Float32Array(seeds)
  }

  init () {
    const attribs = {
      position: { size: 3, data: this.vertices },
      seeds: { size: 4, data: this.seeds },
    }
    this.geometry = new Geometry(this.gl, attribs)

    
    let uniforms = {
      uTime: { value: this.scene.time },
      uVolumeCorner: { value: new Vec3(this.config.volumeCorner.value.x, this.config.volumeCorner.value.y, this.config.volumeCorner.value.z) },
      uVolumeSize: { value: new Vec3(this.config.volumeSize.value.x, this.config.volumeSize.value.y, this.config.volumeSize.value.z) },
      uOffset: { value: this.offset },
      uColor: { value: new Color(this.config.color.value)},
      uColor1: { value: new Color(this.config.color1.value)},
      uPixelRatio: { value: this.pixelRatio },
      uAlpha: { value: this.alpha },
      uNoiseIntensity: { value: this.noiseIntensity },
      uNoiseFrequency: { value: this.noiseFrenquency },
      uTimeScale: { value: this.timeScale },
      uParticleOpacity: { value: this.particleOpacity },
      uLimitsFadeDistance: { value: this.limitsFadeDistance },
      uLimitsFadeIntensity: { value: this.limitsFadeIntensity },
      uParticleScale: { value: this.particleScale },

      uDiscRadius: this.config.DiscRadius,
      uDiscRadius1: this.config.DiscRadius1,
      uBorderSize: this.config.BorderSize,
      uBorderSize1: this.config.BorderSize1,
    }

    if (this.defines['HAS_FOG']) {
      uniforms = {
        ...uniforms,
        uFogColor: { value: this.globalConfig ? new Color(this.globalConfig.FogColor.value) : new Color("#fff") },
        uFogNear: { value: this.globalConfig ? this.globalConfig.FogNear.value : 0 },
        uFogFar: { value: this.globalConfig ? this.globalConfig.FogFar.value :  0 },
      }
    }
    this.program = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.frag,
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      uniforms,
    })

    this.program.cullFace = false
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, mode: this.gl.POINTS })
    this.mesh.position.copy(this.position)
    this.mesh.setParent(this.parent)
  }

  onLoaded() {
    this.gui = DebugController.addBlade(this.config, this.name, GUI_PANEL_CUSTOM)
    if (DebugController.active) {
      this.gui.on('change', ()=>{
        this.mesh.visible = false
        this.createParticles()
        this.init()
      })
    }
  }

  preRender () {
    this.mesh.visible = this.config.visible.value
    this.program.uniforms['uColor'].value = new Color(this.config.color.value)
    this.program.uniforms['uColor1'].value = new Color(this.config.color1.value)
    this.wind[0] = this.config.wind_X.value
    this.wind[1] = this.config.wind_Y.value
    this.wind[2] = this.config.wind_Z.value
    this.timeScale = this.config.TimeScale.value
    this.gravity = this.config.Gravity.value
    this.limitsFadeDistance = this.config.LimitsFadeDistance.value
    this.limitsFadeIntensity = this.config.LimitsFadeIntensity.value
    this.noiseIntensity = this.config.NoiseIntensity.value
    this.noiseFrenquency = this.config.NoiseFrenquency.value
    this.alpha = this.config.Alpha.value
    this.count = this.config.count.value
    
    this.time += this.scene.dt / 1000
    this.offset[0] = this.wind[0] * this.time * this.timeScale
    this.offset[1] = (this.wind[1] + this.gravity) * this.time * this.timeScale
    this.offset[2] = this.wind[2] * this.time * this.timeScale
    
    this.program.uniforms['uTime'].value = this.scene.time
    this.program.uniforms['uLimitsFadeDistance'].value = this.limitsFadeDistance
    this.program.uniforms['uLimitsFadeIntensity'].value = this.limitsFadeIntensity
    this.program.uniforms['uNoiseIntensity'].value = this.noiseIntensity
    this.program.uniforms['uNoiseFrequency'].value = this.noiseFrenquency
    this.program.uniforms['uTimeScale'].value = this.timeScale
    this.program.uniforms['uOffset'].value = this.offset
    this.program.uniforms['uParticleOpacity'].value = this.config.ParticleOpacity.value
    this.program.uniforms['uParticleScale'].value = this.config.ParticleScale.value

  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}

export default FairyDust
