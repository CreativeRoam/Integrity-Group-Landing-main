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
import { mat4, vec2 } from 'gl-matrix'

const VERTICES = [-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
const INDICES = [0, 1, 2, 0, 2, 3]
const UVS = [0, 1, 0, 0, 1, 0, 1, 1]

let _MAT4_1 = mat4.create()

class Flare {
    constructor(scene, {
        parent = null,
        blendFunc = {},
        transparent = true,
        depthTest = false,
        depthWrite = false,
        alpha = 1,
        name = "Flare"
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

        this.shader = new Shader(ShaderManifest['flare'])
        this.texture = new Texture(this.gl)
        this.alpha = alpha
        this.speed = 0
        this.speedTarget = 0
        this.pageOffset = 0
        this.lightPos = vec2.create()        
        this.time = Math.random() * 100

        this.config = {
            // ColorHalo: { value: '#ec682a', params: {} },
            // StrengthHalo: { value: 1.15, params: { min: 0, max: 3, step: 0.01 } },
            // OpacityHalo: { value: .75, params: { min: 0, max: 1, step: 0.01 } },
            // ColorGradient1: { value: '#efce59', params: {} },
            // ColorGradient2: { value: '#00253c', params: {} },
            // StrengthGradient: { value: 1, params: { min: 0, max: 3, step: 0.01 } },
            // OpacityGradient: { value: .6, params: { min: 0, max: 1, step: 0.01 } },
            // OpacityGeneral: { value: .6, params: { min: 0, max: 1, step: 0.01 } },
            // Grain: { value: .8, params: { min: 0, max: 3, step: 0.01 } },
            // Speed: { value: .8, params: { min: 0, max: 5, step: 0.01 } },


            ColorHalo: { value: '#e70c25', params: {} },
            StrengthHalo: { value: 2.25, params: { min: 0, max: 3, step: 0.01 } },
            OpacityHalo: { value: .85, params: { min: 0, max: 1, step: 0.01 } },
            ColorGradient1: { value: '#005f77', params: {} },
            ColorGradient2: { value: '#dfd7cd', params: {} },
            StrengthGradient: { value: 1.7, params: { min: 0, max: 3, step: 0.01 } },
            OpacityGradient: { value: .6, params: { min: 0, max: 1, step: 0.01 } },
            OpacityGeneral: { value: .35, params: { min: 0, max: 1, step: 0.01 } },
            Grain: { value: .8, params: { min: 0, max: 3, step: 0.01 } },
            Speed: { value: .6, params: { min: 0, max: 5, step: 0.01 } },

            // ColorHalo: { value: '#a89a17', params: {} }, // Foundation
            // StrengthHalo: { value: 1.3, params: { min: 0, max: 3, step: 0.01 } },
            // OpacityHalo: { value: .75, params: { min: 0, max: 1, step: 0.01 } },
            // ColorGradient1: { value: '#391426', params: {} },
            // ColorGradient2: { value: '#287089', params: {} },
            // StrengthGradient: { value: 1, params: { min: 0, max: 3, step: 0.01 } },
            // OpacityGradient: { value: .6, params: { min: 0, max: 1, step: 0.01 } },
            // OpacityGeneral: { value: 1, params: { min: 0, max: 1, step: 0.01 } },
            // Grain: { value: 1, params: { min: 0, max: 3, step: 0.01 } },
            // Speed: { value: 1, params: { min: 0, max: 5, step: 0.01 } },
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
                uColorHalo: { value: [0, 0, 0] },
                uLightPos: { value: [0, 0] },
                uStrengthHalo: this.config.StrengthHalo,
                uOpacityHalo: this.config.OpacityHalo,
                uColorGradient1: { value: [0, 0, 0] },
                uColorGradient2: { value: [0, 0, 0] },
                uStrengthGradient: this.config.StrengthGradient,
                uOpacityGradient: this.config.OpacityGradient,
                uAlpha: { value: 0 },
                uGrain: this.config.Grain,
            }
        })

        this.program.cullFace = false
        this.program.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE)

        this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program, renderOrder: 100 })
        this.mesh.name = this.name
        this.mesh.setParent(this.parent)

    }

    initGui() {
        DebugController.addBlade(this.config, `${this.scene.name} - ${this.name}`, 1)
    }

    onLoaded() {
        this.initGui()
    }

    preRender() {

        this.speedTarget += ((window.pageYOffset - this.pageOffset) * .5 - this.speedTarget) * .25
        this.pageOffset = window.pageYOffset

        // this.speed += (this.speedTarget - this.speed) * .015
        this.time += ((this.scene.dt * this.config.Speed.value) / 1000) * (1 + this.speed) * .5

        this.lightPos[0] = Math.sin(this.time) * .5
        this.lightPos[1] = Math.sin(this.time * .913) * .5

        this.lightPos[0] += Mouse.dampedCursor[0] * 1
        this.lightPos[1] += -Mouse.dampedCursor[1] * 1        

        let progress = this.pageOffset / (this.scene.height / this.scene.dpr)
        let backgroundAlpha = Math.max(1 - (progress * 2), 0)

        this.program.uniforms['uTime'].value = this.time
        this.program.uniforms['uRez'].value = [this.scene.width, this.scene.height]
        this.program.uniforms['uMouse'].value = Mouse.cursor
        this.program.uniforms['uLightPos'].value = this.lightPos

        this.program.uniforms['uAlpha'].value = backgroundAlpha * this.config.OpacityGeneral.value

        this.program.uniforms['uColorHalo'].value = new Color(this.config.ColorHalo.value)
        this.program.uniforms['uColorGradient1'].value = new Color(this.config.ColorGradient1.value)
        this.program.uniforms['uColorGradient2'].value = new Color(this.config.ColorGradient2.value)

    }

    dispose() {
        this.mesh.setParent(null)
        this.geometry.remove()
        this.program.remove()
    }
}

export default Flare
