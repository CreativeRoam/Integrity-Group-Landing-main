import Shader                       from '@/glxp/utils/Shader'
import ShaderManifest               from '@/glxp/shaderManifest'
import Skin                         from '@/glxp/abstract/skin'
import DebugController from '@/glxp/debug/DebugController'

import { vec2, vec3 }               from 'gl-matrix'
import { Program }                  from '@/glxp/ogl/core/Program.js';
import { Geometry }                 from '@/glxp/ogl/core/Geometry.js';
import { Mesh }                     from '@/glxp/ogl/core/Mesh.js';
import { Texture }                  from '@/glxp/ogl/core/Texture.js';
import { Transform }                from '@/glxp/ogl/core/Transform.js';
import { Vec3 }                     from '@/glxp/ogl/math/Vec3.js';

import Easing from '@/glxp/utils/easing'
import Animator from '@/glxp/animations/characterAnimator'

class SkinedMeshEntity {
  constructor (scene, data, shader, texture, rootnodeName, id, parent = false) {
    
    this.gl                     = scene.gl
    this.scene                  = scene
    this.data                   = data
    this.textureId              = texture
    this.meshId                 = id
    this.shaderId               = shader
    this.texture                = new Texture(this.gl);
    this.idTexture              = new Texture(this.gl);
    this.transform              = new Transform()
    this.nodes                  = []
    this.skinData               = null
    this.geomData               = null
    this.rootnodeName           = rootnodeName
    this.renderOrder            = 10000
    this.parent = parent ? parent : scene.root

    this.buildBonesHierarchy()
    this.init() 
    
    this.config = {
      renderOrder: { value: 1733, range: [0, 2500], step: 1 },
    }
    DebugController.addConfig(this.config, `Bee Mesh`)

  }

  buildBonesHierarchy(){
    for (let i = 0; i < this.data.length; i++) {
        const element = this.data[i];
        if (element.type == "triangle" && this.geomData === null) {
            this.geomData = element
        } else if (element.joints && this.skinData === null) {
            this.skinData = element
        }
    }

    for (let i = 0; i < this.data.length; i++) {
        const element = this.data[i];
        if (element.type == "Null") {
            let node = new Transform()
            node.position.set(element.translate[0], element.translate[1], element.translate[2])
            node.rotation.set(element.rotation[0], element.rotation[1], element.rotation[2])
            node.scale.set(element.scale[0], element.scale[1], element.scale[2])
            node.name = element.name
            node.sid = element.sid
            node._parent = element.parent
            this.nodes.push(node)
        }
    }

    this.name = this.geomData.name
    for (let i = 0; i < this.nodes.length; i++) {
        let parentName = this.nodes[i]._parent
        if (parentName) {
            for (let j = 0; j < this.nodes.length; j++) {
                if (this.nodes[j].name == parentName) {
                    this.nodes[j].addChild(this.nodes[i])
                }
            }
        }
    }

    for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].updateMatrixWorld(true)
    }
  }
  
  init(){

    this.skin = new Skin(this, this.skinData, this.rootnodeName)
    this.skin.rootNode.setParent(this.transform)

    for (let j = 0; j < this.skin.bonesNode.length; j++) {
      const el = this.skin.bonesNode[j];
      let tmp = this.scene.animatorBones.filter(b => (b.name !== undefined && b.name == el.name))
      if (tmp.length == 0) {
        this.scene.animatorBones.push(el)
      }
    }
    // this.animator = new Animator(this.scene, this.skin.bonesNode, this.skin.rootNode, this)

    this.shader = new Shader(
        ShaderManifest[this.shaderId], 1,
        {
            "ATTRIB_STACK": this.skinData.attribStackNum,
            "MAX_BONES": this.skinData.joints.length,
        }
    )
    const attribs = {
        position: { size: 3, data: this.geomData.vertices },
        uv: { size: 2, data: this.geomData.uvs },
        normal: { size: 3, data: this.geomData.normal },
        index: { data: this.geomData.indices },
    }
    for (let i = 0; i < this.skinData.attribStackNum; i++) {
        attribs[`aWeights_${i}`] = { size: 4, data: this.skin.attribData[`weight_${i}`] }
        attribs[`aBoneNdx_${i}`] = { size: 4, data: this.skin.attribData[`ndx_${i}`] }
    }
    this.geometry = new Geometry(this.gl, attribs)

    this.program = new Program(this.gl, {
        vertex: this.shader.vert,
        fragment: this.shader.frag,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        uniforms: {
            uTexture: { value: this.texture },
            uIdTexture: { value: this.idTexture },
            uBones: { value: this.skin.boneArray},
            uTime: { value: 0 },
            uAlpha: { value: 1 },
            uBright: { value: 1 },
            uIDPass: { value: 0},
        },
    })

    this.mesh = new Mesh(this.gl, {geometry: this.geometry, program: this.program, frustumCulled: false, renderOrder: this.renderOrder  })
    this.mesh.name = this.name
    this.mesh.setParent(this.parent)

  }

  onLoaded(){

    // if (this.meshId == 0) {
    //     this.animator.animations = this.scene.animations
    //     this.animator.onLoaded()
    //     this.animator.setAnim("catwalk")
    // }

    this.texture = this.scene.textureLoader.getTexture(this.textureId)
    this.texture.needsUpdate = true
    this.program.uniforms["uTexture"].value = this.texture
    this.program.uniforms["uTexture"].needsUpdate = true
  }

  preRender () {

      
    // this.animator.update()
    this.skin.update()    
    this.program.uniforms.uBones.value = this.skin.boneArray
    this.program.uniforms.uTime.value = this.scene.time
    this.program.uniforms.needsUpdate = true

  }

  dispose() {
    this.mesh.setParent(null)
    this.meshTransparent.setParent(null)

    this.geometry.remove()
    this.program.remove()
    this.transparentProgram.remove()
  }
}

export default SkinedMeshEntity
