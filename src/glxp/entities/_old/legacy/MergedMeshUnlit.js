import Shader           from '@/glxp/utils/Shader'
import DebugController  from '@/glxp/debug/DebugController'
import ShaderManifest   from '@/glxp/shaderManifest'

import { Program }    from '@/glxp/ogl/core/Program.js'
import { Geometry }   from '@/glxp/ogl/core/Geometry.js'
import { Mesh }       from '@/glxp/ogl/core/Mesh.js'
import { Texture }    from '@/glxp/ogl/core/Texture.js'
import { Color }      from '@/glxp/ogl/math/Color'

import { vec3, quat } from 'gl-matrix'

// Manifest
import GUIMaterialManifest from '@/glxp/guiMaterialManifest'

// Data
import { GUI_PANEL_UNLIT } from '@/glxp/data/dataGUIPanels'

const QUAT = quat.create()
const VEC3 = vec3.create()

class MergedMeshEntity {
  constructor (scene, geoms, texture, {
    parent = null,
    id = GUI_PANEL_UNLIT,
    blendFunc = {
      src: scene.gl.SRC_ALPHA, 
      dst: scene.gl.ONE_MINUS_SRC_ALPHA
    },
    shader = 'unlit',
    transparent = false,
    depthTest = true,
    depthWrite = true,
    renderOrder = 0,
    globalConfig = null,
    material = null,
    alpha = 1
  } = {}) {
    this.gl               = scene.gl
    this.scene            = scene
    this.parent           = parent ? parent : scene.root
    this.transparent      = transparent
    this.blendFunc        = blendFunc
    this.depthTest        = depthTest
    this.shaderId         = shader
    this.depthWrite       = depthWrite
    this.videoTexture     = null
    this.video            = null
    this.renderOrder      = renderOrder
    this.groupId          = id
    this.geoms            = geoms
    this.materialInfos    = material
    this.globalConfig     = globalConfig
    this.alpha            = alpha
    this.textureId        = texture
    this.defines          = {}
    this.name             = geoms[0].name + "_Merged"
    this.seed             = Math.random()
    
    this.initConfig()
    this.init()
    this.cleanConfig()
  }

  initConfig() {
    this.guiName = `${this.scene.name || 'undefined'} - ${this.materialName || 'undefined'}`
    this.config = GUIMaterialManifest.createUnlitMaterial(this.guiName)

    if (DebugController.guiIsReady) {
      this.initGUI()
    } else {
      DebugController.on('gui-lazyloaded', this.initGUI.bind(this))
    }
  }

  initGUI() {
    GUIMaterialManifest.addUnlitMaterialToGUI(this.guiName, this.groupId)
    this.gui = GUIMaterialManifest.getGui(this.guiName)

    // TODO: Refactor texture update to avoid duplicate for each Mesh
    // DebugController.addTextureUpload(this, { maps: ['texture'] })

    this.cleanConfig()
  }

  cleanConfig() {
    if (!this.gui || this.gui === {}) return

    if (this.defines["HAS_SHEEN"] == undefined) {
      this.gui.params["SheenColor"].hidden = true
      this.gui.params["SheenOpacity"].hidden = true
      this.gui.params["SheenDepth"].hidden = true
    }
  }

  initVideoTexture(url){
    if (this.videoTexture !== null) return

    this.videoTexture = new Texture(this.gl, {
        generateMipmaps: false,
        width: 1024,
        height: 512,
    });
    let video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = url
    video.loop = true
    video.muted = true
    this.video = video
  }

  mergeGeoms(){

    const indices = []
    let currentIndicesLength = 0
    const centroids = []
    const seeds = []
    const uvs = []
    const vertices = []
    const normal = []

    for (let i = 0; i < this.geoms.length; i++) {
        const geom = this.geoms[i];
        let maxIndex = 0
        for (let j = 0; j < geom.indices.length; j++) {
            const i = geom.indices[j]
            if (i > maxIndex) {
                maxIndex = i
            }
            indices.push(i + currentIndicesLength)
        }
        currentIndicesLength += maxIndex + 1
        let seed = [Math.random(), Math.random(), Math.random()]
        for (let j = 0; j < geom.vertices.length/3; j++) {
            vec3.set(VEC3, 
                geom.vertices[j * 3 + 0],
                geom.vertices[j * 3 + 1],
                geom.vertices[j * 3 + 2],
            )
            quat.identity(QUAT)
            quat.rotateY(QUAT, QUAT, geom.rotation[1])
            quat.rotateX(QUAT, QUAT, geom.rotation[0])
            quat.rotateZ(QUAT, QUAT, geom.rotation[2])
            vec3.transformQuat(VEC3, VEC3, QUAT)
            vec3.add(VEC3, VEC3, geom.translate)

            centroids.push(geom.translate[0])
            centroids.push(geom.translate[1])
            centroids.push(geom.translate[2])
            vertices.push(VEC3[0])
            vertices.push(VEC3[1])
            vertices.push(VEC3[2])
            seeds.push(seed[0])
            seeds.push(seed[1])
            seeds.push(seed[2])
            normal.push( geom.normal[j * 3 + 0])
            normal.push( geom.normal[j * 3 + 1])
            normal.push( geom.normal[j * 3 + 2])

        }
        for (let j = 0; j < geom.uvs.length/2; j++) {
            uvs.push( geom.uvs[j * 2 + 0])
            uvs.push( geom.uvs[j * 2 + 1])
        }
    }

    this.geom = { 
        vertices: new Float32Array(vertices),
        uvs: new Float32Array(uvs),
        normal: new Float32Array(normal),
        centroids: new Float32Array(centroids),
        seeds: new Float32Array(seeds),
        indices: new Uint16Array(indices),
    }

  }

  init() {
    this.mergeGeoms()

    this.geometry = new Geometry(this.gl, {
      position: { size: 3, data: this.geom.vertices },
      centroids: { size: 3, data: this.geom.centroids },
      seeds: { size: 3, data: this.geom.seeds },
      uv: { size: 2, data: this.geom.uvs },
      normal: { size: 3, data: this.geom.normal },
      index: { data: this.geom.indices }
    })
    
    let uniforms = {
        uTime: { value: this.scene.time },        uAlpha: { value: this.alpha },
        uSeed: { value: this.seed },
        uTint: { value: new Color(this.config.Tint.value) },
        uCamera: { value: this.scene.camera.position },
        uProgress: this.scene.config.progress,
    }

    // Color Correction
    this.defines['HAS_COLOR_CORRECTION'] = 1
    uniforms = Object.assign(uniforms,{
      uTint: { value: new Color(this.config.Tint.value) },
      uTintOpacity: this.config.TintOpacity,
      uExposure: this.config.Exposure,
      uContrast: this.config.Contrast,
      uSaturation: this.config.Saturation,
    })

    if (this.scene.textureLoader.isTextureRegistered(`${this.textureId}`)) {
      this.defines['HAS_BASECOLORMAP'] = 1
        this.texture = new Texture(this.gl)
        uniforms = Object.assign(uniforms,{
          uTexture: { value: this.texture },
        })
    } else {
      uniforms = Object.assign(uniforms,{
        uColor: { value: new Color(this.materialInfos.color) },
      })
    }

    if (this.scene.textureLoader.isTextureRegistered(`${this.textureId}_Opacity`)) {
        this.defines['HAS_ALPHAMAP'] = 1
        this.alphaTexture = new Texture(this.gl)
        this.transparent = true
        uniforms = Object.assign(uniforms,{
          uAlphaMapSampler: { value: this.alphaTexture }
        })
    }

    if (this.scene.textureLoader.isTextureRegistered(`${this.textureId}_Normal`)) {
        this.defines['HAS_NORMALMAP'] = 1
        this.normalTexture = new Texture(this.gl)
        uniforms = Object.assign(uniforms,{
            uNormalSampler: { value: this.normalTexture },
            uNormalScale: this.config.NormalScale,
        })
    }

    if (this.materialInfos && this.materialInfos['sheen'] !== undefined) {
        this.defines['HAS_SHEEN'] = 1
        uniforms = Object.assign(uniforms,{
            uSheenOpacity: this.config.SheenOpacity,
            uSheenDepth: this.config.SheenDepth,
            uSheenColor: { value: new Color(this.config.SheenColor.value) },
        })
    }

    uniforms = Object.assign(uniforms,{
        uLightDirection: { value: [0, 0, 0] },
        uLightColor: { value: new Color('#ffffff') },
    })

    // if (this.globalConfig.FogColor) {
    //   this.defines['HAS_FOG'] = 1
    //   uniforms = Object.assign(uniforms,{
    //       uFogColor: { value: new Color(this.globalConfig.FogColor.value) },
    //       uFogDensity: { value: this.globalConfig.FogDensity.value },
    //   })
    // } 

    this.shader = new Shader(ShaderManifest[this.shaderId], 1, this.defines)

    this.program = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.frag,
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      // cullFace: false,
      uniforms
    })
    // if (this.materialInfos && this.materialInfos.cullface !== undefined) {
    //   if (this.materialInfos.cullface == false) {
    //     this.program.cullFace = false
    //   } else {
    //     this.program.cullFace = this.gl[this.materialInfos.cullface]
    //   }
    // }

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry, 
      program: this.program, 
    })
    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: this.renderOrder })
    this.mesh.name = this.name

    let parent = this.scene.getNode(this.geoms[0].parent)
    this.mesh.position.x = parent.position.x
    this.mesh.position.y = parent.position.y
    this.mesh.position.z = parent.position.z

    // vec3.copy(this.mesh.position, this.geom.translate)
    // this.mesh.rotation.x = this.geom.rotation[0]
    // this.mesh.rotation.y = this.geom.rotation[1]
    // this.mesh.rotation.z = this.geom.rotation[2]
    // vec3.copy(this.mesh.scale, this.geom.scale)

    this.mesh.setParent(this.parent)
  }

  onLoaded() {
    if (this.texture) {
      this.texture = this.scene.textureLoader.getTexture(this.textureId)
      this.texture.needsUpdate = true
      this.program.uniforms['uTexture'].value = this.texture
    }
    
    if (this.alphaTexture) {
        this.alphaTexture = this.scene.textureLoader.getTexture(`${this.textureId}_Opacity`)
        this.alphaTexture.needsUpdate = true
        this.program.uniforms['uAlphaMapSampler'].value = this.alphaTexture
    }

    if (this.normalTexture) {
        this.normalTexture = this.scene.textureLoader.getTexture(`${this.textureId}_Normal`)
        this.normalTexture.needsUpdate = true
        this.program.uniforms['uNormalSampler'].value = this.normalTexture
    }

  }

  preRender () {
    this.program.uniforms["uTime"].value = this.scene.time
    this.program.uniforms["uAlpha"].value = this.alpha
    this.program.uniforms["uTint"].value = new Color(this.config.Tint.value)

    const lc = new Color(this.globalConfig.lightColor.value)
    this.program.uniforms['uLightColor'].value = [lc[0] * this.globalConfig.lightPower.value, lc[1] * this.globalConfig.lightPower.value, lc[2] * this.globalConfig.lightPower.value]
    this.program.uniforms['uLightDirection'].value = [ 
        (this.globalConfig.lightPosition.value.x * this.scene.root.scale.x) - this.mesh.worldMatrix[12], 
        (this.globalConfig.lightPosition.value.y * this.scene.root.scale.y) - this.mesh.worldMatrix[13], 
        (this.globalConfig.lightPosition.value.z * this.scene.root.scale.z) - this.mesh.worldMatrix[14]
    ]

    this.defines['HAS_FOG'] ? this.program.uniforms["uFogColor"].value = new Color(this.globalConfig.FogColor.value) : null
    this.defines['HAS_FOG'] ? this.program.uniforms["uFogDensity"].value = this.globalConfig.FogDensity.value : null
    this.program.uniforms["uCamera"].value = this.scene.camera.position

    if (this.video && this.video.currentTime > 0 && this.video.readyState >= this.video.HAVE_ENOUGH_DATA) {
        if (!this.videoTexture.image) this.videoTexture.image = this.video;
        this.videoTexture.needsUpdate = true
        this.program.uniforms['uTexture'].value = this.videoTexture
    }

    if (this.defines["HAS_SHEEN"] !== undefined) {
        this.program.uniforms["uSheenColor"].value = new Color(this.config.SheenColor.value)
    }
  }
}

export default MergedMeshEntity
