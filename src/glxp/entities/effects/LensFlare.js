import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'
import DebugController from '@/glxp/debug/DebugController'

import { GUI_PANEL_CUSTOM } from '@/glxp/data/dataGUIPanels'
import { Color } from '@/glxp/ogl/math/Color'
import { Mesh } from '@/glxp/ogl/core/Mesh'
import { Program } from '@/glxp/ogl/core/Program'
import { Texture } from '@/glxp/ogl/core/Texture.js'
import { Plane } from '@/glxp/ogl/extras/Plane'

export default class Flare extends Mesh {
    texture

    step = 0
    baseScale = { x: 1, y: 1 }
    textureId = ""
    textureRatio = 1
    direction = 0
    directionOffset = 0
    name = "Flare"
    // forceRenderOrder = true
    // renderOrder = 100
    globalOpacity = 1
    lookAtCenter = true
    hasColorCorrection = true
    program = null

    config = {
        Opacity: { value: 1, params: { min: 0, max: 30, label: "Opacity" } },
        Scale: { value: { x: 1.8, y: 1.8 }, params: { min: 0, max: 2, label: "Scale" } },
        Offset: { value: { x: 0, y: 0 }, params: { x: { min: -10, max: 10 }, y: { min: -10, max: 10 }, label: "Offset" } },
    }

    /**
     * Lens flare element
     * 
     * @param {SceneAbs} scene 
     * @param {{ step, offset, scale, textureId, opacity, lookAtCenter, hasColorCorrection, rotationOffset, overrideMaterial }} options 
     * @param {number} options.step - Step of the flare (0 = center, 1 = first ring, 2 = second ring, etc.)
     * @param {{ x, y }} options.offset - Offset added to the step flare step
     * @param {{ x, y }} options.scale - Scale of the flare plane
     * @param {string} options.textureId - Texture ID of the flare to be fetched
     * @param {number} options.opacity - Opacity of the flare
     * @param {boolean} options.lookAtCenter - If true, the flare will look at the center of the screen
     * @param {boolean} options.hasColorCorrection - If true, the flare will have color correction defines, config and uniforms
     * @param {number} options.rotationOffset - Rotation offset of the flare
     * @param {DrawableMaterial} options.overrideMaterial - Override the default material
     */
    constructor(scene, {
        step = 1,
        offset = { x: 0, y: 0 },
        scale = { x: 1, y: 1 },
        textureId = "Hexa_00",
        opacity = 1,
        lookAtCenter = true,
        hasColorCorrection = true,
        rotationOffset = 0,
        tint = "#ffffff",
        geometry = new Plane(scene.gl, {
            width: 1,
            height: 1,
        }),
        overrideProgram = null,
        shaderId = "flarePlane",
    }) {
        const defines = {}
        if (hasColorCorrection) { defines["HAS_COLOR_CORRECTION"] = 1 }
        const { vert, frag } = new Shader(ShaderManifest[shaderId], 1, defines)

        let program
        if (overrideProgram) program = overrideProgram
        else program = new Program(scene.gl, {
            vertex: vert,
            fragment: frag,
            uniforms: {
                uTexture: { value: new Texture(scene.gl, {}) },
                uOpacity: { value: 1 },
                uDirection: { value: 0 },
                uTint: { value: new Color() },
                uTintOpacity: { value: 0 },
                uExposure: { value: 0 },
                uSaturation: { value: 0 },
            },
            transparent: true,
            depthTest: false,
        })

        super(scene.gl, {
            geometry,
            program
        })

        // Premultiplied alpha blend:
        // this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_COLOR)

        this.geometry = geometry
        this.program = program
        this.scene = scene
        this.textureId = textureId

        this.texture = new Texture(scene.gl);
        this.step = step
        this.textureId = textureId
        this.lookAtCenter = lookAtCenter
        this.hasColorCorrection = hasColorCorrection
        this.directionOffset = rotationOffset

        // Color Correction
        this.config = Object.assign(this.config, {
            Tint: { value: tint, params: { label: "Tint" } },
            TintOpacity: { value: 1, params: { min: 0, max: 1, step: 0.01, label: "TintOpacity" } },
            Exposure: { value: 0, params: { min: -2, max: 3, step: 0.01, label: "Exposure" } },
            Saturation: { value: 1, params: { min: 0, max: 2, step: 0.01, label: "Saturation" } },
        })
        this.config.Offset.value = offset
        this.config.Scale.value.x = scale.x
        this.config.Scale.value.y = scale.y
        this.config.Opacity.value = opacity

        if (this.lookAtCenter) {
            // Add rotation offset if looking at center
            this.config["RotationOffset"] = { value: 0, params: { min: -Math.PI, max: Math.PI, label: "Rotation Offset" } }
        } else {
            // Add rotation config if not looking at center
            this.config["Rotation"] = { value: 0, params: { min: -Math.PI, max: Math.PI, label: "Rotation" } }
        }

        this.name = `${scene.name} - Flare - ${textureId}`

        this.onBeforeRender(this.preDraw)
    }

    onLoaded() {
        if (this.textureId) {
            this.texture = this.scene.textureLoader.getTexture(this.textureId)
            if (!this.texture) {
                console.error(`Texture ${this.textureId} not found`)
                return
            }
            this.texture.needsUpdate = true
            this.program.uniforms['uTexture'].value = this.texture
        }
    }


    initGui = (parentFolder) => {
        this.gui = DebugController.addBlade(this.config, this.name, GUI_PANEL_CUSTOM, parentFolder, false)
    }

    setColorCorrectionUniforms = () => {
        const tint = new Color(this.config.Tint.value)
        this.program.uniforms['uTint'].value[0] = tint.r
        this.program.uniforms['uTint'].value[1] = tint.g
        this.program.uniforms['uTint'].value[2] = tint.b

        this.program.uniforms['uTintOpacity'].value = this.config.TintOpacity.value
        this.program.uniforms['uExposure'].value = this.config.Exposure.value
        this.program.uniforms['uSaturation'].value = this.config.Saturation.value
    }

    preDraw = () => {
        this.scene.applyDefaultState()

        // Uniforms
        this.program.uniforms['uOpacity'].value = this.globalOpacity * this.config.Opacity.value

        if (this.lookAtCenter) this.program.uniforms['uDirection'].value = this.direction + this.config["RotationOffset"].value
        else this.program.uniforms['uDirection'].value = this.config["Rotation"].value

        if (this.hasColorCorrection) this.setColorCorrectionUniforms()

        // Ratio scale
        this.scale.x = this.baseScale.x * 1 / (this.scene.width / this.scene.height) * this.config.Scale.value.x
        this.scale.y = this.baseScale.y * this.config.Scale.value.y
    }

    dispose() {
        this.setParent(null)
        this.geometry.remove()
        this.program.remove()
      }
}
