import Shader           from '@/glxp/utils/Shader'
import DebugController  from '@/glxp/debug/DebugController'
import ShaderManifest   from '@/glxp/shaderManifest'

import { Transform } from '@/glxp/ogl/core/Transform.js'
import { Program }    from '@/glxp/ogl/core/Program.js'
import { Geometry }   from '@/glxp/ogl/core/Geometry.js'
import { Mesh }       from '@/glxp/ogl/core/Mesh.js'
import { Texture }    from '@/glxp/ogl/core/Texture.js'
import { Color }      from '@/glxp/ogl/math/Color'

import { vec3, quat } from 'gl-matrix'
const QUAT = quat.create()
const VEC3 = vec3.create()


class MergedMeshEntity {
  constructor (scene, originalGeoms, texture, {
    parent = null,
    id = 0,
    blendFunc = {
      src: scene.gl.SRC_ALPHA, 
      dst: scene.gl.ONE_MINUS_SRC_ALPHA
    },
    shaderId = 'mergedUnlit',
    transparent = false,
    depthTest = true,
    depthWrite = true,
    renderOrder = 0,
    globalConfig = null,
    material = null,
    alpha = 1,
    name = 'Merged Unlit',
    gltf = null,
    offsetPosition = [0, 0, 0]
  } = {}) {
    super(scene.gl, scene)

    this.gl               = scene.gl
    this.scene            = scene
    this.parent           = parent ? parent : scene.root
    this.transparent      = transparent
    this.blendFunc        = blendFunc
    this.depthTest        = depthTest
    this.shaderId         = shaderId
    this.depthWrite       = depthWrite
    this.videoTexture     = null
    this.video            = null
    this.renderOrder      = renderOrder
    this.groupId          = id
    this.originalGeoms    = originalGeoms
    this.transformedGeoms = []
    this.materialInfos    = material
    this.globalConfig     = globalConfig
    this.alpha            = alpha
    this.textureId        = texture
    this.defines          = {}
    this.name             = name
    this.seed             = Math.random()
    this.offsetPosition   = offsetPosition
    this.gltf             = gltf

    this.initConfig()
    this.getDataFromGltf()
    this.mergeGeoms()
    this.init()
    this.cleanConfig()

  }

  

  initConfig(){

    this.config = {
        Tint:               { value: "#ffffff", params: {}},
        TintOpacity:        { value: 0, params: {min: 0, max: 1, step: 0.01} },
        NormalScale:        { value: 1, params: {min: 0, max: 3, step: 0.01} },
        Exposure:           { value: 0, params: {min: -2, max: 3, step: 0.01} },
        Contrast:           { value: 0, params: {min: -1, max: 1, step: 0.01} },
        Saturation:         { value: 1, params: {min: 0, max: 2, step: 0.01} },
        SheenColor:         { value: "#ffffff", params: {} },
        SheenOpacity:       { value: 0, params: {min: 0, max: 1, step: 0.01} },
        SheenDepth:         { value: 2, params: {min: 1, max: 10, step: 0.1} },
    }
    this.gui = DebugController.addBlade(this.config, `${this.name} ${this.materialInfos && this.materialInfos['sheen'] !== undefined ? 'FRESNEL' : 'UNLIT'}`, this.groupId)

  }

  cleanConfig(){
    if (!this.gui) return;

    if (this.defines["HAS_SHEEN"] == undefined) {
        this.gui.params["SheenColor"].hidden = true
        this.gui.params["SheenOpacity"].hidden = true
        this.gui.params["SheenDepth"].hidden = true
        this.gui.params["NormalScale"].hidden = true
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

  getDataFromGltf(){
    this.transformedGeoms = []
    
    for (let j = 0; j < this.originalGeoms.length; j++) {
      const el = this.originalGeoms[j];
      const node = this.originalGeoms[j].node;
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

      this.transformedGeoms.push(geom)
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

  mergeGeoms(){

    const indices = []
    let currentIndicesLength = 0
    const centroids = []
    const seeds = []
    const uvs = []
    const vertices = []
    const normal = []

    for (let i = 0; i < this.transformedGeoms.length; i++) {
        const geom = this.transformedGeoms[i];
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
            quat.rotateY(QUAT, QUAT, geom.transform.rotation[1])
            quat.rotateX(QUAT, QUAT, geom.transform.rotation[0])
            quat.rotateZ(QUAT, QUAT, geom.transform.rotation[2])
            vec3.transformQuat(VEC3, VEC3, QUAT)
            vec3.add(VEC3, VEC3, geom.transform.position)

            centroids.push(geom.transform.position[0])
            centroids.push(geom.transform.position[1])
            centroids.push(geom.transform.position[2])
            vertices.push(VEC3[0])
            vertices.push(VEC3[1])
            vertices.push(VEC3[2])
            // Hack to make the third letter float up instead of down in the shader
            // its' index is 10 for some reason
            seeds.push(i === 10 ? 1.75 : -1.75)
            // seeds.push(seed[0])
            seeds.push(seed[1])
            seeds.push(seed[2])
            if(!geom.normals) continue
            normal.push( geom.normals[j * 3 + 0])
            normal.push( geom.normals[j * 3 + 1])
            normal.push( geom.normals[j * 3 + 2])

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
        uProgress: { value: 0 },
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

    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: this.renderOrder })
    this.mesh.name = this.name
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
