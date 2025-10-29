import Shader                       from '@/glxp/utils/Shader'
import ShaderManifest               from '@/glxp/shaderManifest'
import DebugController              from '@/glxp/debug/DebugController'

import { vec3, mat4 }               from 'gl-matrix'
import { Program }                  from '@/glxp/ogl/core/Program.js';
import { Geometry }                 from '@/glxp/ogl/core/Geometry.js';
import { Mesh }                     from '@/glxp/ogl/core/Mesh.js';
import { Texture }                  from '@/glxp/ogl/core/Texture.js';
import { Transform }                from '@/glxp/ogl/core/Transform.js';
import { Color }                    from '@/glxp/ogl/math/Color'

import Manifest from '@/glxp/manifest'
import GUIMaterialManifest from '@/glxp/guiMaterialManifest'
const VEC3 = vec3.create()

class MergedMeshEntity {
  constructor (scene, data, texture, {
      parent = null,
        id = 0,
        blendFunc = {
            src: scene.gl.SRC_ALPHA, 
            dst: scene.gl.ONE_MINUS_SRC_ALPHA
        },
        gltf = null,
        node = null,
        name = '',
        materialName = '',
        transparent = false,
        depthTest = true,
        shaderId = 'mergedStandard',
        depthWrite = true,
        offsetPosition = [0, 0, 0],
        separatedEmissive = false,
        renderOrder = 0,
        globalConfig = null,
        fog = true,
        progress = 0,
        alpha = 1
  } = {}) {
    super(scene.gl, scene)

    this.gl               = scene.gl
    this.scene            = scene
    this.gltf             = gltf
    this.data             = data
    this.node             = node
    this.name             = name
    this.parent           = parent ? parent : scene.root
    this.transparent      = transparent
    this.blendFunc        = blendFunc
    this.depthTest        = depthTest
    this.depthWrite       = depthWrite
    this.separatedEmissive = separatedEmissive
    this.videoTexture     = null
    this.video            = null
    this.fog              = fog
    this.renderOrder      = renderOrder
    this.progress         = progress
    this.groupId          = id
    this.shaderId         = shaderId
    this.geom             = {}
    this.materialName     = materialName
    this.globalConfig     = globalConfig
    this.alpha            = alpha
    this.offsetPosition   = offsetPosition
    this.textureId        = texture
    this.defines          = {}
    this.seed             = Math.random()
    this.transform        = new Transform()
    this.geomData         = data
    this.lastEnv          = null
    this.lastEnvDiffuse   = null

    this.localState = { uniforms: {} }
    this.normalMatrix = mat4.create()
    this.MVPMatrix = mat4.create()

    this.maxTextureIndex = 0
    this.defines = {}
    this.defines['USE_IBL'] = 1
    this.defines['MANUAL_SRGB'] = 1
    this.defines['HAS_NORMALS'] = 1
    this.defines['HAS_UV'] = 1

    this.getDataFromGltf()
    this.mergeGeoms()
    this.initConfig()
    this.initMaterial()
    this.cleanConfig()
    this.createUniforms()
    this.init() 

  }

  getDataFromGltf(){

    this.geoms = []
    for (let j = 0; j < this.data.length; j++) {
      const el = this.data[j];
      const node = this.data[j].node;
      const transform = new Transform()

      const geom = { options: {} }
      const primitives = el.meshData.primitives;
      
      if(node.rotation) {
          transform.quaternion.x = node.rotation[0]
          transform.quaternion.y = node.rotation[1]
          transform.quaternion.z = node.rotation[2]
          transform.quaternion.w = node.rotation[3]
      }
  
      if(node.scale) {
          vec3.copy(transform.scale, node.scale)
      }
  
      if(node.translation) {
          vec3.copy(transform.position, node.translation)
      }
      transform.position.x += this.offsetPosition[0]
      transform.position.y += this.offsetPosition[1]
      transform.position.z += this.offsetPosition[2]
      geom.transform = transform
  
      // todo:  multiple primitives doesn't work.
      for (let i = 0; i < primitives.length; i++) {
          var primitive = primitives[Object.keys(primitives)[i]];
  
          for (let attribute in primitive.attributes) {
              switch (attribute) {
                  case "NORMAL":
                      this.defines.HAS_NORMALS = 1;
                      break;
                  case "TANGENT":
                      this.defines.HAS_TANGENTS = 1;
                      break;
                  case "TEXCOORD_0":
                      this.defines.HAS_UV = 1;
                      break;
              }
          }
  
          // Attributes
          for (let attribute in primitive.attributes) {
              this.getAccessorData(geom, primitive.attributes[attribute], attribute);
          }
          // Indices
          this.getAccessorData(geom, primitive.indices, 'INDEX');
      }

      this.geoms.push(geom)
    }


  }

  getAccessorData(geom, accessorName, attribute) {
    if (this.gltf.isDracoCompressed) {
        const data = accessorName.value;
        switch (attribute) {
            case "POSITION": geom.vertices = data;
                geom.options.vertices = {byteStride: 0, byteOffset: 0}
                break;
            case "NORMAL": geom.normals = data;
                geom.options.normals = {byteStride: 0, byteOffset: 12}
                break;
            case "TANGENT": geom.tangents = data;
                geom.options.tangents = {byteStride: 0, byteOffset: null}
                break;
            case "TEXCOORD_0": geom.uvs = data;
                geom.options.uvs = {byteStride: 0, byteOffset: 24}
                break;
            case "INDEX": geom.indices = data;
                geom.options.indices = {byteStride: 0, byteOffset: null}
                break;
            default:
                console.warn('Unknown attribute semantic: ' + attribute);
        }
        return;
    }

    const accessor = this.gltf.accessors[accessorName]
    const bufferView = this.gltf.bufferViews[accessor.bufferView]
    const arrayBuffer = this.gltf.bin

    let byteStride = null;
    if (bufferView && bufferView.byteStride) byteStride = bufferView.byteStride;

    let byteOffset = defined(bufferView.byteOffset) ? bufferView.byteOffset : 0;
    
    const start = byteOffset
    const end = start + bufferView.byteLength
    const slicedBuffer = arrayBuffer.slice(start, end)

    let data
    if (accessor.componentType === 5126) {
        data = new Float32Array(slicedBuffer);
    }
    else if (accessor.componentType === 5123) {
        data = new Uint16Array(slicedBuffer);
    }
    else if (accessor.componentType === 5125) {
        data = new Uint32Array(slicedBuffer);
    } else {
        console.warn('no type defined for this componentType:', accessor.componentType)
    }

    if (!data) {
        console.warn('no data', accessorName, attribute, data);
    }

    switch (attribute) {
        case "POSITION": this.geom.vertices = data;
            this.geom.verticesAccessor = accessor;
            this.geom.options.vertices = {byteStride, byteOffset: 0}
            break;
        case "NORMAL": this.geom.normals = data;
            this.geom.normalsAccessor = accessor;
            this.geom.options.normals = {byteStride, byteOffset: 12}
            break;
        case "TANGENT": this.geom.tangents = data;
            this.geom.tangentsAccessor = accessor;
            this.geom.options.tangents = {byteStride, byteOffset: null}
            break;
        case "TEXCOORD_0": this.geom.uvs = data;
            this.geom.uvsAccessor = accessor;
            this.geom.options.uvs = {byteStride, byteOffset: 24}
            break;
        case "INDEX": this.geom.indices = data;
            this.geom.indicesAccessor = accessor;
            this.geom.options.indices = {byteStride, byteOffset: bufferView.byteOffset ? bufferView.byteOffset : null}
            break;
        default:
            console.warn('Unknown attribute semantic: ' + attribute);
    }
  }

  initConfig(){

    this.config = GUIMaterialManifest.addPBRMaterial(this.materialName, this.groupId)
    this.gui = GUIMaterialManifest.getGui(this.materialName)

    this.extraConfig = {
        mappedIntroOffset: { value: -100000000, params: { step: 10 } },
        progress: { value: 0, params: { min:0, max: 1 } }
    }

    this.extraGui = DebugController.addBlade(this.extraConfig, "Intro Rock", 1 )

    if(this.extraGui)
        this.extraGui.progress.on('change', (e)=>{
            this.progress = e.value
        })
  }
  
  cleanConfig(){
    if (!this.gui) return;

    if (this.defines["HAS_NORMALMAP"] == undefined) {
        this.gui.params["NormalScale"].hidden = true
    }
    if (this.defines["HAS_OCCLUSIONMAP"] == undefined && this.defines["HAS_ORM_MAP"] == undefined) {
      this.gui.params["OcclusionFactor"].hidden = true
    }
    if (this.defines["HAS_OCCLUSIONMAP"] == undefined) {
        this.gui.params["OcclusionFactor"].hidden = true
    }
    if (this.defines["HAS_EMISSIVECOLOR"] == undefined) {
        this.gui.params["EmissiveColor"].hidden = true
        this.gui.params["EmissivePower"].hidden = true
    }
    if (this.defines["HAS_SHEEN"] == undefined) {
        this.gui.params["SheenColor"].hidden = true
        this.gui.params["SheenOpacity"].hidden = true
        this.gui.params["SheenDepth"].hidden = true
    }
  }

    mergeGeoms(){

    //   console.log(this.geoms);
      const indices = []
      let currentIndicesLength = 0
      const centroids = []
      const seeds = []
      const uvs = []
      const vertices = []
      const normals = []

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
              geom.transform.updateMatrix()
              geom.transform.updateMatrixWorld()
              vec3.transformMat4(VEC3, VEC3, geom.transform.matrix)

              centroids.push(geom.transform.position.x)
              centroids.push(geom.transform.position.y)
              centroids.push(geom.transform.position.z)
              vertices.push(VEC3[0])
              vertices.push(VEC3[1])
              vertices.push(VEC3[2])
              seeds.push(seed[0])
              seeds.push(seed[1])
              seeds.push(seed[2])
              normals.push( geom.normals[j * 3 + 0])
              normals.push( geom.normals[j * 3 + 1])
              normals.push( geom.normals[j * 3 + 2])

          }
          for (let j = 0; j < geom.uvs.length/2; j++) {
              uvs.push( geom.uvs[j * 2 + 0])
              uvs.push( geom.uvs[j * 2 + 1])
          }
      }

      this.geom = { 
          vertices: new Float32Array(vertices),
          uvs: new Float32Array(uvs),
          normals: new Float32Array(normals),
          centroids: new Float32Array(centroids),
          seeds: new Float32Array(seeds),
          indices: new Uint16Array(indices),
      }

    }

  init(){

    this.environement = this.globalConfig.Environment.value
    this.diffuseEnvironement = this.globalConfig.EnvironmentDiffuse.value

    this.lightColor = new Color(this.globalConfig.lightColor.value)

    this.shader = new Shader(ShaderManifest[this.shaderId], 1, this.defines)


    const attribs = {
        position: { size: 3, data: this.geom.vertices },
        uv: { size: 2, data: this.geom.uvs },
        normal: { size: 3, data: this.geom.normals },
        centroids: { size: 3, data: this.geom.centroids },
        seeds: { size: 3, data: this.geom.seeds },
        index: { data: this.geom.indices }
    }
    this.geometry = new Geometry(this.gl, attribs)

    this.program = new Program(this.gl, {
        vertex: this.shader.vert,
        fragment: this.shader.frag,
        depthTest: this.depthTest,
        depthWrite: this.depthWrite,
        transparent: this.transparent,
        cullFace: false,
        uniforms: this.localState.uniforms
    })

    this.mesh = new Mesh(this.gl, {geometry: this.geometry, program: this.program, transform: this.transform, frustumCulled: false  })
    this.mesh.name = this.name
    this.mesh.setParent(this.parent)
    this.mesh._entity = this

    if (this.separatedEmissive) {
        this.emissiveShader = new Shader(ShaderManifest['mergedOcculter'], 1, {})
        let emissiveUniforms = {
            uTime: { value: this.scene.time },        
            uProgress: { value: 0 },
            uSeed: { value: this.seed },
            uTint: { value: new Color(this.config.Tint.value) },
            uCamera: { value: this.scene.camera.position },
            uColor: { value: [1, 0, 0] },
            uMappedIntroOffset: { value: this.extraConfig.mappedIntroOffset.value }
        }
        this.emissiveProgram = new Program(this.gl, {
            vertex: this.emissiveShader.vert,
            fragment: this.emissiveShader.frag,
            depthTest: this.depthTest,
            depthWrite: this.depthWrite,
            transparent: this.transparent,
            uniforms: emissiveUniforms
        })
        this.emissiveMesh = new Mesh(this.gl, {geometry: this.geometry, program: this.emissiveProgram, transform: this.transform, frustumCulled: false  })
        this.mesh.name = this.name + '_emissive'
        this.emissiveMesh.setParent(this.parent)
        this.emissiveMesh.visible = false
        this.emissiveMesh._entity = this
    }


  }

  getImageInfo(uri, funcName, uniformName) {
      this.localState.uniforms[uniformName] = { 'type': funcName, 'uri': uri, 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++
  }

  initMaterial() {
      const gl = this.gl 
      const gltf = this.gltf

      let pbrMat = null
      if (Manifest.materials[this.materialName]) {
        pbrMat = Manifest.materials[this.materialName]
      } else {
        console.warn('material undefined:', this.materialName)
      }

      this.config.IBL.value = (pbrMat && pbrMat.IBL) ? pbrMat.IBL : this.config.IBL.value

      // EnvMaps
      this.localState.uniforms['uDiffuseEnvSampler'] = { 'type': 'texture', 'uri': 'env_diffuse', 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++

      this.localState.uniforms['uSpecularEnvSampler'] = { 'type': 'texture', 'uri': 'env_default', 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++

      if (pbrMat && pbrMat.Alpha) {
        this.config.Alpha.value = pbrMat.Alpha
      }

      this.localState.uniforms['uUvScale'] = { 'type': 'float1', 'value': pbrMat && pbrMat.UvScale ? pbrMat.UvScale : 1 }

      // Base Color
      var baseColorFactor = pbrMat && pbrMat.albedoColor ? new Color(pbrMat.albedoColor).getRGBA() : [1.0, 1.0, 1.0, 1.0]
      this.config.albedoColor.value = pbrMat && pbrMat.albedoColor ? pbrMat.albedoColor : new Color(baseColorFactor).getHex()
      this.localState.uniforms['uBaseColorFactor'] = {
          type: 'float4',
          value: baseColorFactor
      }
      if (pbrMat && pbrMat.albedoMap) {
          this.getImageInfo(pbrMat.albedoMap, 'texture', 'uBaseColorSampler');
          this.defines.HAS_BASECOLORMAP = 1
      }
      else if (this.localState.uniforms['uBaseColorSampler']) {
          delete this.localState.uniforms['uBaseColorSampler']
      }

      if (pbrMat && pbrMat.alphaTexture) {
          this.getImageInfo(pbrMat.alphaTexture, 'texture', 'uAlphaMapSampler');
          this.defines.HAS_ALPHAMAP = 1
      }

      // Metallic-Roughness
      this.config.MetalicFactor.value = (pbrMat && typeof(pbrMat.MetalicFactor) === 'number') ? pbrMat.MetalicFactor : this.config.MetalicFactor.value
      this.config.RoughnessFactor.value = (pbrMat && typeof(pbrMat.RoughnessFactor) === 'number') ? pbrMat.RoughnessFactor : this.config.RoughnessFactor.value
      this.localState.uniforms['uMetallicRoughnessValues'] = {
          type: 'float2',
          value: [this.config.MetalicFactor.value, this.config.RoughnessFactor.value]
      };
      if (pbrMat && pbrMat.metallicRoughnessTexture) {
          this.getImageInfo(pbrMat.metallicRoughnessTexture, 'texture', 'uMetallicRoughnessSampler', gl.RGBA) 
          this.defines.HAS_METALROUGHNESSMAP = 1
      }
      else if (this.localState.uniforms['uMetallicRoughnessSampler']) {
          delete this.localState.uniforms['uMetallicRoughnessSampler']
      }

      // ORM (AO - Roughness - Metallic)
      if (pbrMat && pbrMat.ORMTexture) {
          this.getImageInfo(pbrMat.ORMTexture, 'texture', 'uOcclusionRoughnessMetallicSampler', gl.RGBA) 
          this.defines.HAS_ORM_MAP = 1
          this.config.OcclusionFactor.value = pbrMat && typeof(pbrMat.OcclusionFactor) === 'number' ? pbrMat.OcclusionFactor : this.config.OcclusionFactor.value
          this.localState.uniforms['uOcclusionStrength'] = { 'type': 'float1', 'value': this.config.OcclusionFactor.value }
      } else if (this.localState.uniforms['uOcclusionRoughnessMetallicSampler']) {
          delete this.localState.uniforms['uOcclusionRoughnessMetallicSampler']
      }

      // Normals
      if (pbrMat && pbrMat.normalTexture) {
          this.getImageInfo(pbrMat.normalTexture, 'texture', 'uNormalSampler', gl.RGBA)
          this.config.NormalScale.value = pbrMat.NormalScale ? pbrMat.NormalScale : this.config.NormalScale.value
          this.localState.uniforms['uNormalScale'] = { 'type': 'float1', 'value': this.config.NormalScale.value }
          this.defines.HAS_NORMALMAP = 1
      }
      else if (this.localState.uniforms['uNormalSampler']) {
          delete this.localState.uniforms['uNormalSampler']
      }

      // brdfLUT
      this.localState.uniforms['uBrdfLUT'] = { 'type': 'texture', 'uri': 'brdfLUT', 'textIndx': this.maxTextureIndex }
      this.maxTextureIndex++

      // Emissive
      if (pbrMat && pbrMat.emissiveTexture) {
          this.getImageInfo(pbrMat.emissiveTexture, 'texture', 'uEmissiveSampler')
          this.defines.HAS_EMISSIVEMAP = 1
          var emissiveFactor = pbrMat.emissiveFactor ? pbrMat.emissiveFactor : [0.0, 0.0, 0.0]
          this.globalConfig.emissiveColor.value = new Color(emissiveFactor).getHex()
          this.localState.uniforms['uEmissiveColor'] = {
              type: 'float3',
              value: emissiveFactor
          };
      }
      else if (this.localState.uniforms['uEmissiveSampler']) {
          delete this.localState.uniforms['uEmissiveSampler']
      }
      if (pbrMat && pbrMat.emissiveColor) {
          this.defines.HAS_EMISSIVECOLOR = 1
          var emissiveColor = pbrMat.emissiveColor ? new Color(pbrMat.emissiveColor) : [0.0, 0.0, 0.0]
          this.config.EmissivePower.value = typeof(pbrMat.emissivePower) === 'number' ? pbrMat.emissivePower : 1
          this.config.EmissiveColor.value = pbrMat.emissiveColor
          this.localState.uniforms['uEmissiveColor'] = {
              type: 'float3',
              value: emissiveColor
          }
          this.localState.uniforms['uEmissivePower'] = {
              type: 'float1',
              value: this.config.EmissivePower.value
          }
      }

      // AO
      if (pbrMat && pbrMat.occlusionTexture) {
          this.getImageInfo(pbrMat.occlusionTexture, 'texture', 'uOcclusionSampler')
          this.config.OcclusionFactor.value = pbrMat && typeof(pbrMat.OcclusionFactor) === 'number' ? pbrMat.OcclusionFactor : this.config.OcclusionFactor.value
          this.localState.uniforms['uOcclusionStrength'] = { 'type': 'float1', 'value': this.config.OcclusionFactor.value }
          this.defines.HAS_OCCLUSIONMAP = 1
      }
      else if (this.localState.uniforms['uOcclusionSampler']) {
          delete this.localState.uniforms['uOcclusionSampler']
      }

    // Sheen
    if (pbrMat && pbrMat.SheenColor) {
        const sheenOpacity = pbrMat.sheenOpacity ? pbrMat.sheenOpacity : 1
        const sheenDepth = pbrMat.sheenDepth ? pbrMat.sheenDepth : 2
        this.localState.uniforms['uSheenColor'] = {
            type: 'float3',
            value: new Color(pbrMat.SheenColor)
        }
        this.localState.uniforms['uSheenOpacity'] = {
            type: 'float1',
            value: sheenOpacity
        }
        this.localState.uniforms['uSheenDepth'] = {
            type: 'float1',
            value: sheenDepth
        }
        this.config.SheenColor.value = pbrMat.SheenColor
        this.config.SheenOpacity.value = sheenOpacity
        this.config.SheenDepth.value = sheenDepth
        this.defines.HAS_SHEEN = 1
    }

    // Fog
    if (this.globalConfig.FogColor && this.fog) {
        this.defines['HAS_FOG'] = 1
        this.localState.uniforms['uFogColor'] = {
            type: 'float3',
            value: new Color(this.globalConfig.FogColor.value)
        }
        this.localState.uniforms['uFogNear'] = {
            type: 'float1',
            value: this.globalConfig.FogNear.value
        }
        this.localState.uniforms['uFogFar'] = {
            type: 'float1',
            value: this.globalConfig.FogFar.value
        }
    }

  }

  createUniforms () {

        // General
        this.localState.uniforms['uTime']               = { 'type': 'float1', 'value': 0 }
        this.localState.uniforms['uAlpha']              = { 'type': 'float1', 'value': 1 }
        this.localState.uniforms['uProgress']           = { 'type': 'float1', 'value': 1 }

        // Light
        this.localState.uniforms['uLightDirection']     = { 'type': 'float3', value: [0.0, 0.5, 0.5] }
        this.localState.uniforms['uLightColor']         = { 'type': 'float3', value: [1.0, 1.0, 1.0] }

        // get scaling stuff
        this.localState.uniforms['uScaleDiffBaseMR']    = { 'type': 'float4', value: [0.0, 0.0, 0.0, 0.0] }
        this.localState.uniforms['uScaleFGDSpec']       = { 'type': 'float4', value: [0.0, 0.0, 0.0, 0.0] }
        this.localState.uniforms['uScaleIBLAmbient']    = { 'type': 'float4', value: [1.5, 1.5, 0, 0] }
        
        this.localState.uniforms['uCamera']             = { 'type': 'float3', value: [0, 0, 0] }
        
        // Color Correction
        this.defines['HAS_COLOR_CORRECTION'] = 1
        this.localState.uniforms['uTint']               = { 'type': 'float3', value: [1, 1, 1] }
        this.localState.uniforms['uTintOpacity']        = { 'type': 'float1', 'value': 0 }
        this.localState.uniforms['uExposure']           = { 'type': 'float1', 'value': 0 }
        this.localState.uniforms['uContrast']           = { 'type': 'float1', 'value': 0 }
        this.localState.uniforms['uSaturation']         = { 'type': 'float1', 'value': 0 }

        // Custom intro
        this.localState.uniforms['uMappedIntroOffset']         = { 'type': 'float1', 'value': this.extraConfig.mappedIntroOffset.value }

        for (const key in this.localState.uniforms) {
            if (Object.hasOwnProperty.call(this.localState.uniforms, key)) {
                if (this.localState.uniforms[key].type == "texture") {
                    this.localState.uniforms[key].value = new Texture(this.gl)
                }
            }
        }

    }

  onLoaded(){

    for (const key in this.localState.uniforms) {
        if (Object.hasOwnProperty.call(this.localState.uniforms, key)) {
            if (this.localState.uniforms[key].type == "texture") {
                this.localState.uniforms[key].value = this.scene.textureLoader.getTexture(this.localState.uniforms[key].uri)
                this.localState.uniforms[key].value.needsUpdate = true
            }
        }
    }

  }

  preRender () {

    this.program.uniforms.uTime.value = this.scene.time
    this.program.uniforms.needsUpdate = true

    this.program.uniforms['uLightDirection'].value = [ 
        (this.globalConfig.lightPosition.value.x * this.scene.root.scale.x) - this.mesh.worldMatrix[12], 
        (this.globalConfig.lightPosition.value.y * this.scene.root.scale.y) - this.mesh.worldMatrix[13], 
        (this.globalConfig.lightPosition.value.z * this.scene.root.scale.z) - this.mesh.worldMatrix[14]
    ]
    // this.program.uniforms['uLightDirection'].value = [ 
    //     CONFIG.lightPosition.value.x - this.mesh.worldMatrix[12], 
    //     CONFIG.lightPosition.value.y - this.mesh.worldMatrix[13], 
    //     CONFIG.lightPosition.value.z - this.mesh.worldMatrix[14]
    // ]

    this.lightColor.set(this.globalConfig.lightColor.value)
    this.localState.uniforms['uLightColor'].value = [this.lightColor[0] * this.globalConfig.lightPower.value, this.lightColor[1] * this.globalConfig.lightPower.value, this.lightColor[2] * this.globalConfig.lightPower.value]
    this.localState.uniforms['uScaleIBLAmbient'].value = [this.config.IBL.value * this.globalConfig.IBLDiffuseFactor.value, this.config.IBL.value * this.globalConfig.IBLSpecularFactor.value, 0.0, 0.0]

    const debugState = this.globalConfig.Debug.value
    this.localState.uniforms['uScaleDiffBaseMR'].value = [debugState == "mathDiff" ? 1 : 0, debugState == "baseColor" ? 1 : 0, debugState == "metallic" ? 1 : 0, debugState == "roughness" ? 1 : 0];
    this.localState.uniforms['uScaleFGDSpec'].value = [debugState == "specRef" ? 1 : 0, debugState == "geomOcc" ? 1 : 0, debugState == "mcrfctDist" ? 1 : 0, debugState == "spec" ? 1 : 0];

    this.localState.uniforms['uMetallicRoughnessValues'].value = [this.config.MetalicFactor.value, this.config.RoughnessFactor.value]
    if (this.localState.uniforms['uNormalScale'] ) {
        this.localState.uniforms['uNormalScale'].value = this.config.NormalScale.value
    }
    if (this.localState.uniforms['uOcclusionStrength'] ) {
        this.localState.uniforms['uOcclusionStrength'].value = this.config.OcclusionFactor.value
    }

    const bc = new Color(this.config.albedoColor.value)
    this.localState.uniforms['uBaseColorFactor'].value = [bc[0], bc[1], bc[2], this.config.Alpha.value * this.globalConfig.Alpha.value]

    // if (this.localState.uniforms['uEmissiveFactor']) {
    //     const ec = new Color(this.globalConfig.emissiveColor.value)
    //     this.localState.uniforms['uEmissiveFactor'].value = [ec[0], ec[1], ec[2]]
    // }

    if (this.localState.uniforms['uEmissiveColor']) {
        this.localState.uniforms['uEmissiveColor'].value = new Color(this.config.EmissiveColor.value)
    }
    if (this.localState.uniforms['uEmissivePower']) {
        this.localState.uniforms['uEmissivePower'].value = this.config.EmissivePower.value
    }

    if (this.localState.uniforms['uSheenColor'] ) {
        this.localState.uniforms['uSheenOpacity'].value = this.config.SheenOpacity.value
        this.localState.uniforms['uSheenDepth'].value = this.config.SheenDepth.value
        this.localState.uniforms['uSheenColor'].value = new Color(this.config.SheenColor.value)
    }
    
    // Fog
    if (this.globalConfig.FogColor && this.fog) {
        this.localState.uniforms['uFogNear'].value = this.globalConfig.FogNear.value
        this.localState.uniforms['uFogFar'].value = this.globalConfig.FogFar.value
        this.localState.uniforms['uFogColor'].value = new Color(this.globalConfig.FogColor.value)
    }

    this.localState.uniforms['uCamera'].value = this.scene.camera.position

    this.environement = this.globalConfig.Environment.value
    if(this.environement !== this.lastEnv){
        this.lastEnv = this.environement
        this.localState.uniforms["uSpecularEnvSampler"].value = this.scene.textureLoader.getTexture(this.environement)
        this.localState.uniforms["uSpecularEnvSampler"].value.needsUpdate = true
    }
    this.diffuseEnvironement = this.globalConfig.EnvironmentDiffuse.value
    if(this.diffuseEnvironement !== this.lastEnvDiffuse){
        this.lastEnvDiffuse = this.diffuseEnvironement
        this.localState.uniforms["uDiffuseEnvSampler"].value = this.scene.textureLoader.getTexture(this.diffuseEnvironement)
        this.localState.uniforms["uDiffuseEnvSampler"].value.needsUpdate = true
    }

    // Color Correction
    this.localState.uniforms["uTint"].value                 = new Color(this.config.Tint.value)
    this.localState.uniforms["uTintOpacity"].value          = this.config.TintOpacity.value
    this.localState.uniforms["uExposure"].value             = this.config.Exposure.value
    this.localState.uniforms["uContrast"].value             = this.config.Contrast.value
    this.localState.uniforms["uSaturation"].value           = this.config.Saturation.value
    this.localState.uniforms["uProgress"].value             = this.progress

    if (this.separatedEmissive) {
        this.emissiveProgram.uniforms['uColor'].value                   = [0., 0., 0.];
        this.emissiveProgram.uniforms["uProgress"].value                = this.progress
        this.emissiveProgram.uniforms["uMappedIntroOffset"].value       = this.extraConfig.mappedIntroOffset.value
    }

    this.localState.uniforms["uMappedIntroOffset"].value    = this.extraConfig.mappedIntroOffset.value
  }

  dispose() {
    this.mesh.setParent(null)

    if (this.geometry) this.geometry.remove()
    if (this.mesh) delete this.mesh
    if (this.emissiveMesh) delete this.emissiveMesh
    
    // texture/program disposal breaks all the textures 
    // if (this.program) this.program.dispose()

    // for (const key in this.localState.uniforms) {
    //     if (Object.hasOwnProperty.call(this.localState.uniforms, key)) {
    //         if (this.localState.uniforms[key].type == "texture") {
    //             const textureIsInManifestFolder = Manifest[this.manifestId][this.localState.uniforms[key].uri]
    //             if (textureIsInManifestFolder) {
    //                 this.scene.textureLoader.disposeTexture(this.localState.uniforms[key].uri)
    //             }
    //         }
    //     }
    // }
  }
}

export default MergedMeshEntity
