import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '../shaderManifest'
import DebugController from '@/glxp/debug/DebugController'

import Mouse from '@/glxp/utils/Mouse'
import { Camera } from '@/glxp/ogl/core/Camera.js'

import { Plane } from '@/glxp/ogl/extras/Plane.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { Mesh } from '@/glxp/ogl/core/Mesh.js'
import { Geometry } from '@/glxp/ogl/core/Geometry.js'
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { Color } from '@/glxp/ogl/math/Color'
import { mat4 } from 'gl-matrix'

const VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
const INDICES = [0, 1, 2, 0, 2, 3]
const UVS = [0, 1, 0, 0, 1, 0, 1, 1]

let _MAT4_1 = mat4.create()

class Background {
    constructor(scene, {
        parent = null,
        blendFunc = {},
        transparent = true,
        depthTest = false,
        depthWrite = false,
        alpha = 1,
        name = "Background"
    } = {}) {


        this.gl = scene.gl
        this.scene = scene

        this.transparent = transparent
        this.blendFunc = blendFunc
        this.depthTest = depthTest
        this.depthWrite = depthWrite
        this.name = name
        this.parent = parent ? parent : scene.root
        this.viewDirProjInverse = mat4.create()

        this.shader = new Shader(ShaderManifest['background'])
        this.texture = new Texture(this.gl)
        this.alpha = alpha
        this.time = 0
        this.speed = 0
        this.pageOffset = 0

        this.config = {
            // Color1: { value: '#dfd7cd', params: {} },
            // Color2: { value: '#948765', params: {} },
            // Color3: { value: '#dcb1a1', params: {} },
            // Color4: { value: '#46232c', params: {} },
            // ColorBackground: { value: '#dcb1a1', params: {} },

            Color1: { value: '#948765', params: {} },
            Color2: { value: '#00253c', params: {} },
            Color3: { value: '#46232c', params: {} },
            Color4: { value: '#ec683a', params: {} },
            ColorBackground: { value: '#dcb1a1', params: {} },
            
            // Color1: { value: '#625135', params: {} }, Foundation
            // Color2: { value: '#3f3737', params: {} }, Foundation
            // Color3: { value: '#50667c', params: {} }, Foundation
            // Color4: { value: '#2f1e0b', params: {} }, Foundation
            Opacity: { value: .5, params: { min: 0, max: 1, step: 0.01 } },
        }

        this.init()
    }

    init() {
        this.geometry = new Plane(this.gl)

        const attribs = {
            position: { size: 3, data: new Float32Array(VERTICES) },
            uv: { size: 2, data: new Float32Array(UVS) },
            index: { data: new Uint16Array(INDICES) }
        }
        this.geometry = new Geometry(this.gl, attribs)
        this.program = new Program(this.gl, {
            vertex: this.shader.vert,
            fragment: this.shader.frag,
            depthTest: this.depthTest,
            depthWrite: this.depthWrite,
            transparent: this.transparent,
            uniforms: {
                uTextureNoise: { value: this.texture },
                uTime: { value: this.scene.time },
                uViewDirProjInverse: { value: this.viewDirProjInverse },
                uRez: { value: [this.scene.width, this.scene.height] },
                uMouse: { value: Mouse.cursor },
                uColorBackground: { value: new Color(this.config.ColorBackground.value) },
                uColor1: { value: [0, 0, 0] },
                uColor2: { value: [0, 0, 0] },
                uColor3: { value: [0, 0, 0] },
                uColor4: { value: [0, 0, 0] },
                uProgress: { value: 0 },
                uAlpha: this.config.Opacity
            }
        })

        this.program.cullFace = false
        this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: -1 })
        this.mesh.name = this.name
        this.mesh.setParent(this.parent)

    }

    initGui() {
        DebugController.addBlade(this.config, `${this.scene.name} - ${this.name}`, 1)
    }

    onLoaded() {
        // this.texture = this.scene.textureLoader.getTexture('noise_blue')
        // this.texture.needsUpdate = true
        // this.program.uniforms['uTextureNoise'].value = this.texture

        this.initGui()
    }

    preRender() {

        // this.speed += ((window.pageYOffset - this.pageOffset) * .2 - this.speed) * .05
        this.pageOffset += (window.pageYOffset - this.pageOffset) * .1
        this.time += (this.scene.dt / 1000) * 2.

        let progress = this.pageOffset / (this.scene.height/this.scene.dpr)
        let backgroundAlpha = Math.max(1 - (progress * 2), 0)
        
        this.program.uniforms['uTime'].value = this.time
        this.program.uniforms['uRez'].value = [this.scene.width, this.scene.height]
        this.program.uniforms['uMouse'].value = Mouse.cursor
        this.program.uniforms['uProgress'].value = backgroundAlpha
        // this.program.uniforms['uAlpha'].value = this.config.Opacity.value

        this.program.uniforms['uColorBackground'].value = new Color(this.config.ColorBackground.value)
        this.program.uniforms['uColor1'].value = new Color(this.config.Color1.value)
        this.program.uniforms['uColor2'].value = new Color(this.config.Color2.value)
        this.program.uniforms['uColor3'].value = new Color(this.config.Color3.value)
        this.program.uniforms['uColor4'].value = new Color(this.config.Color4.value)

    }

    dispose() {
        this.mesh.setParent(null)
        this.geometry.remove()
        this.program.remove()
    }
}

export default Background
