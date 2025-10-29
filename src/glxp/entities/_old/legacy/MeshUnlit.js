import Shader from '@/glxp/utils/Shader'
import DebugController from '@/glxp/debug/DebugController'
import ShaderManifest from '@/glxp/shaderManifest'
import GLTFUtils from '@/glxp/utils/GLTFUtils'
import MeshEntityUtils from '@/glxp/entities/MeshEntityUtils'

import { Program } from '@/glxp/ogl/core/Program.js'
import { Transform } from '@/glxp/ogl/core/Transform.js'
import { Geometry } from '@/glxp/ogl/core/Geometry.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { Color } from '@/glxp/ogl/math/Color'


// Manifest
import Manifest from '@/glxp/manifest'
import GUIMaterialManifest from '@/glxp/guiMaterialManifest'

// Data
import { GUI_PANEL_UNLIT } from '@/glxp/data/dataGUIPanels'

// WARNING: Normals are commented out as they're usually not needed
class MeshEntity {
  constructor(
    scene,
    data,
    textureId = null,
    {
      parent = null,
      id = GUI_PANEL_UNLIT,
      blendFunc = {
        src: scene.gl.SRC_ALPHA,
        dst: scene.gl.ONE_MINUS_SRC_ALPHA,
      },
      gltf = null,
      node = null,
      name = '',
      material = null,
      materialName = '',
      transparent = false,
      depthTest = true,
      depthWrite = true,
      shaderId = 'unlit',
      renderOrder = 0,
      globalConfig = null,
      fog = false,
      alpha = 1,
      uid = null,
      overwriteMaterial = false,
    } = {}
  ) {
    this.gl                = scene.gl
    this.scene             = scene
    this.gltf              = gltf
    this.data              = data
    this.node              = node
    this.name              = name
    this.parent            = parent ? parent : scene.root
    this.transparent       = transparent
    this.blendFunc         = blendFunc
    this.depthTest         = depthTest
    this.depthWrite        = depthWrite
    this.shaderId          = shaderId
    this.videoTexture      = null
    this.video             = null
    this.fog               = fog
    this.renderOrder       = renderOrder
    this.groupId           = id
    this.geom              = {}
    this.material          = material
    this.materialName      = materialName
    this.globalConfig      = globalConfig
    this.alpha             = alpha
    this.textureId         = textureId
    this.defines           = {}
    this.seed              = Math.random()
    this.transform         = new Transform()
    this.uid               = uid
    this.animationPlayers  = []
    this.overwriteMaterial = overwriteMaterial

    this.meshUtils = new MeshEntityUtils(this)

    if (node) {
      this.meshUtils.setTransformFromNode(node)
    }

    this.geom = this.gltf ? GLTFUtils.getGeometryDataFromGltf(this.data, this.defines, this.gltf) : this.data

    this.initConfig()
    this.init()
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
  }

  cleanConfig() {
    if (!this.gui || Object.keys(this.gui).length === 0) return

    if (this.defines["HAS_SHEEN"] == undefined) {
      this.gui.params["SheenColor"].hidden = true
      this.gui.params["SheenOpacity"].hidden = true
      this.gui.params["SheenDepth"].hidden = true
    }
  }

  initVideoTexture(url) {
    this.videoTexture = new Texture(this.gl, {
      generateMipmaps: false,
      width: 1024,
      height: 512,
    })
    let video = document.createElement('video')
    video.src = url
    video.loop = true
    video.muted = true
    this.video = video
  }

  init() {
    const attribs = {
      position: { size: 3, data: this.geom.vertices },
      uv: { size: 2, data: this.geom.uvs },
      normal: { size: 3, data: this.geom.normals }, // WARNING: Normals are commented out as they're usually not needed
      index: { data: this.geom.indices },
    }
    this.geometry = new Geometry(this.gl, attribs)

    // base uniforms
    let uniforms = {
      uTime: { value: this.scene.time },
      uAlpha: { value: this.alpha },
      uSeed: { value: this.seed },
      uTint: { value: new Color(this.config.Tint.value) },
      uCamera: { value: this.scene.camera.position },
    }

    // material definition:
    // 1. default material values are taken from the default config defined in initConfig
    let unlitMat = {}

    // 2. if material exists in manifest, take its values
    if (Manifest.materials[this.materialName] && !this.overwriteMaterial) {
      unlitMat = Manifest.materials[this.materialName]
    }

    // 3. if a config is saved in config.js, it will override material values anyway

    if (unlitMat) {
      // specific render options
      if (unlitMat.renderOrder !== undefined) {
        this.renderOrder = unlitMat.renderOrder
      }
      if (unlitMat.depthTest !== undefined) {
        this.depthTest = unlitMat.depthTest
      }
      if (unlitMat.depthWrite !== undefined) {
        this.depthWrite = unlitMat.depthWrite
      }

      if (unlitMat.transparent !== undefined) {
        this.transparent = unlitMat.transparent
      }

      // sheen
      if (unlitMat.SheenColor !== undefined) {
        this.config.SheenColor.value = unlitMat.SheenColor
        if (unlitMat.sheenOpacity !== undefined) {
          this.config.SheenOpacity.value = unlitMat.sheenOpacity
        }
        if (unlitMat.sheenDepth !== undefined) {
          this.config.SheenDepth.value = unlitMat.sheenDepth
        }
        this.defines['HAS_SHEEN'] = 1
        uniforms = Object.assign(uniforms, {
          uSheenOpacity: this.config.SheenOpacity,
          uSheenDepth: this.config.SheenDepth,
          uSheenColor: { value: new Color(this.config.SheenColor.value) },
        })
      }
    }


    // Color Correction
    this.defines['HAS_COLOR_CORRECTION'] = 1
    if (unlitMat) {
      if (unlitMat.Tint  !== undefined) this.config.Tint.value = unlitMat.Tint
      if (unlitMat.TintOpacity !== undefined) this.config.TintOpacity.value = unlitMat.TintOpacity
      if (unlitMat.Exposure !== undefined) this.config.Exposure.value = unlitMat.Exposure
      if (unlitMat.Saturation !== undefined) this.config.Saturation.value = unlitMat.Saturation
    }
    uniforms = Object.assign(uniforms, {
      uTint: { value: new Color(this.config.Tint.value) },
      uTintOpacity: this.config.TintOpacity,
      uExposure: this.config.Exposure,
      uContrast: this.config.Contrast,
      uSaturation: this.config.Saturation,
    })

    // basecolor map
    if (!this.textureId && unlitMat.albedoMap) {
      this.textureId = unlitMat.albedoMap
    }
    if (this.scene.textureLoader.isTextureRegistered(`${this.textureId}`)) {
      this.defines['HAS_BASECOLORMAP'] = 1
      this.texture = new Texture(this.gl)

      uniforms = Object.assign(uniforms, {
        uTexture: { value: this.texture },
      })
    } else {
      if (unlitMat.BaseColor !== undefined) this.config.BaseColor.value = unlitMat.BaseColor
      uniforms = Object.assign(uniforms, {
        uColor: { value: new Color(this.config.BaseColor.value) },
      })
    }

    // alpha map
    this.alphaTextureId = unlitMat.alphaTexture !== undefined ? unlitMat.alphaTexture : null
    if (this.scene.textureLoader.isTextureRegistered(`${this.alphaTextureId}`)) {
      this.defines['HAS_ALPHAMAP'] = 1
      this.alphaTexture = new Texture(this.gl)
      this.transparent = true
      uniforms = Object.assign(uniforms, {
        uAlphaMapSampler: { value: this.alphaTexture },
      })
    }

    // textureScale uniform
    if (this.defines['HAS_BASECOLORMAP'] || this.defines['HAS_ALPHAMAP']) {
      if (unlitMat && unlitMat.TextureScale !== undefined) {
        this.config.TextureScale.value = unlitMat.TextureScale
      }
      uniforms = Object.assign(uniforms, {
        uTextureScale: this.config.TextureScale,
      })
    }

    // alpha value
    if (unlitMat.Alpha !== undefined) this.config.Alpha.value = unlitMat.Alpha
    this.alpha = this.config.Alpha.value

    // fog
    if (unlitMat.fog !== undefined) this.fog = unlitMat.fog
    if (this.globalConfig.FogColor && this.fog) {
      this.defines['HAS_FOG'] = 1
      uniforms = Object.assign(uniforms, {
        uFogColor: { value: new Color(this.globalConfig.FogColor.value) },
        uFogNear: { value: this.globalConfig.FogNear.value },
        uFogFar: { value: this.globalConfig.FogFar.value },
      })
    }

    this.shader = new Shader(ShaderManifest[this.shaderId], 1, this.defines)

    this.program = new Program(this.gl, {
      vertex: this.shader.vert,
      fragment: this.shader.frag,
      depthTest: this.depthTest,
      depthWrite: this.depthWrite,
      transparent: this.transparent,
      uniforms,
    })

    if (unlitMat && unlitMat.cullFace !== undefined) {
      if (unlitMat.cullFace == false) {
        this.program.cullFace = false
      } else {
        this.program.cullFace = this.gl[unlitMat.cullFace]
      }
    }

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
      renderOrder: this.renderOrder,
      transform: this.transform,
    })
    this.mesh.name = this.name

    this.mesh.setParent(this.parent)
    // this.mesh.updateMatrixWorld(true)
    // this.parent.updateMatrixWorld(true)
  }

  onLoaded() {
    if (this.texture) {
      this.texture = this.scene.textureLoader.getTexture(this.textureId)
      this.texture.needsUpdate = true
      this.program.uniforms['uTexture'].value = this.texture
    }

    if (this.alphaTexture) {
      this.alphaTexture = this.scene.textureLoader.getTexture(`${this.alphaTextureId}`)
      this.alphaTexture.needsUpdate = true
      this.program.uniforms['uAlphaMapSampler'].value = this.alphaTexture
    }

    if (this.gui) {
      DebugController.addTextureUpload(this, { maps: ['albedoMapUnlit', 'alphaTexture'] })
      this.cleanConfig()
    }
  }

  // Render
  getFirstDrawPromise() {
    this.didFirstDraw = false
    return new Promise((resolve) => {
      this.firstDrawResolve = resolve
    })
  }

  firstDraw() {
    if (this.didFirstDraw) return

    // this.gl.finish()

    const storedVisibility = this.mesh.visible
    this.mesh.visible = true

    this.scene.renderer.render({
      scene: this.mesh,
      camera: this.scene.camera,
      clear: false,
      frustumCull: true,
      sort: false,
    })

    this.mesh.visible = storedVisibility

    // this.gl.finish()

    if (!this.didFirstDraw) {
      this.didFirstDraw = true
      requestAnimationFrame(() => {
        this.firstDrawResolve(this)
      })
    }
  }

  preRender() {
    this.alpha = this.config.Alpha.value

    this.program.uniforms['uTime'].value = this.scene.time
    this.program.uniforms['uAlpha'].value = this.alpha
    this.program.uniforms['uTint'].value = new Color(this.config.Tint.value)

    if (!this.defines['HAS_BASECOLORMAP']) {
      this.program.uniforms['uColor'].value = new Color(this.config.BaseColor.value)
    }

    if (this.defines['HAS_FOG'] !== undefined) {
      // this.program.uniforms["uFogDensity"].value = this.globalConfig.FogDensity.value
      this.program.uniforms['uFogColor'].value = new Color(this.globalConfig.FogColor.value)
      this.program.uniforms['uFogNear'].value = this.globalConfig.FogNear.value
      this.program.uniforms['uFogFar'].value = this.globalConfig.FogFar.value
    }
    this.program.uniforms['uCamera'].value = this.scene.camera.position

    if (this.video && this.video.currentTime > 0 && this.video.readyState >= this.video.HAVE_ENOUGH_DATA) {
      if (!this.videoTexture.image) this.videoTexture.image = this.video
      this.videoTexture.needsUpdate = true
      this.program.uniforms['uTexture'].value = this.videoTexture
    }

    if (this.defines['HAS_SHEEN'] !== undefined) {
      this.program.uniforms['uSheenColor'].value = new Color(this.config.SheenColor.value)
    }
  }

  dispose() {
    this.mesh.setParent(null)
    this.geometry.remove()
    this.program.remove()
  }
}

export default MeshEntity
