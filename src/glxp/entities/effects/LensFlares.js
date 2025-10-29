import Flare from './LensFlare';
import DebugController from '@/glxp/debug/DebugController'
import Shader from '@/glxp/utils/Shader';
import shaderManifest from '@/glxp/shaderManifest';

// utils
import { toScreenSpace } from '@/glxp/utils/toScreenSpace'
import { getVectorAngle, lerp } from '@/glxp/utils/math'
import { GUI_PANEL_CUSTOM } from '@/glxp/data/dataGUIPanels'
import { vec2 } from 'gl-matrix';

// OGL
import { Transform } from '@/glxp/ogl/core/Transform';
import { Mesh } from '@/glxp/ogl/core/Mesh';
import { Plane } from '@/glxp/ogl/extras/Plane';
import { Program } from '@/glxp/ogl/core/Program';
import { Raycast } from '@/glxp/ogl/extras/Raycast';


let lightSourceScreenSpaceVector = vec2.create()
let lightSourceDistance = 0

let tempFlarePosition = vec2.create()

class LensFlares {
    scene
    lightSource
    getFlares
    occluder
    boundingBoxMesh
    boundingBoxScale
    raycaster
    occlusionDirtMultiplier

    flares = []
    center = vec2.create()
    direction = vec2.create()
    globalBrightness = 1

    config = {
        Spacing: { value: 1, params: { min: 0, max: 3, step: 0.01 } },
        CenterFadePower: { value: 1, params: { min: -3, max: 3 } },
        GlobalOpacity: { value: 1, params: { min: 0, max: 10, } }
    }

    /**
     * Additively blend a series of quads along a stepped direction vector going from the light source screen space position to the center of the screen and reduce brightness as distance to center increases
     * 
     * @param {SceneAbs} scene  - scene to add the flares to
     * @param {{ lightSource, getFlares, spacing, occluder, opacity, boundingBoxScale, raycaster, fadePower, occlusionDirtMultiplier }} options
     * @param {Transform} options.lightSource - transform to use as the light source
     * @param {Function} options.getFlares - function that returns an array of flares
     * @param {number} options.spacing - how far apart to space the flares
     * @param {Mesh} options.occluder - mesh to use for occlusion
     * @param {number} options.opacity - global opacity of the flares
     * @param {number} options.boundingBoxScale - how much to scale the bounding box mesh by
     * @param {Raycast} options.raycaster - raycaster to use for occlusion
     * @param {number} options.fadePower - how much to fade the flares as they get closer to the center
     * @param {number} options.occlusionDirtMultiplier - how much to multiply the occlusion dirt texture by when occluded
     */
    constructor(scene, { lightSource = new Transform(), getFlares, spacing = .09, occluder = null, opacity = 1, boundingBoxScale = 8, raycaster = null, fadePower = 1, occlusionDirtMultiplier = 1.6 }) {
        this.scene = scene
        this.lightSource = lightSource
        this.getFlares = getFlares
        this.occluder = occluder
        this.config.Spacing.value = spacing
        this.config.GlobalOpacity.value = opacity
        this.config.CenterFadePower.value = fadePower
        this.boundingBoxScale = boundingBoxScale
        this.raycaster = raycaster
        this.occlusionDirtMultiplier = occlusionDirtMultiplier

        this.initFlares()
        this.initBoundingBoxMesh()
    }

    // Bounding box plane for raycasting
    initBoundingBoxMesh() {
        const { vert, frag } = new Shader(shaderManifest.debugUv)
        this.boundingBoxMesh = new Mesh(this.scene.gl, {
            geometry: new Plane(this.scene.gl),
            program: new Program(this.scene.gl, {
                vertex: vert,
                fragment: frag
            }),
        })
        this.boundingBoxMesh.scale.set(this.boundingBoxScale)
        this.boundingBoxMesh.visible = false
        this.boundingBoxMesh.setParent(this.scene.root)
    }

    initGui() {
        this.gui = DebugController.addBlade(this.config, `${this.scene.name} - Lens Flares`, GUI_PANEL_CUSTOM)
        
        this.gui && this.gui.params.Spacing.on("change", (e) => {
            for (const flare of this.flares) {
                flare.step = e.value
            }
        })

        for (const flare of this.flares) {
            flare.initGui()
        }
    }

    initFlares() {
        this.flares = this.getFlares(this.config.Spacing.value)

        for (const flare of this.flares) {
            flare.setParent(this.scene.root)
        }
    }

    onLoaded() {
        this.initGui()

        for (const flare of this.flares) {
            flare.onLoaded()
        }
    }

    preRender() {
        // Convert light source world position to screen space
        const lightSourceScreenSpace = toScreenSpace(this.lightSource.worldPosition, this.scene.camera)
        if (lightSourceScreenSpace === null || typeof lightSourceScreenSpace[0] !== "number") return
        lightSourceScreenSpaceVector = vec2.fromValues(lightSourceScreenSpace[0], lightSourceScreenSpace[1])

        // Bounding box mesh for raycasting
        this.boundingBoxMesh.position.copy(this.lightSource.worldPosition)
        this.boundingBoxMesh.lookAt(this.scene.camera.position) // "billboard"

        // Update post processing
        if (this.scene.post && this.scene.post.program.uniforms.uFlareOriginPosition) this.scene.post.program.uniforms.uFlareOriginPosition.value = lightSourceScreenSpace

        // Line from light source through center of the screen
        vec2.copy(this.direction, lightSourceScreenSpaceVector)

        if (this.occluder !== null && this.raycaster !== null) {
            // Lerp brightness from occluder hits and light source position
            let targetBrightness = 1
            let alpha = 1

            const boundingBoxMeshScreenSpace = toScreenSpace(this.boundingBoxMesh.worldPosition, this.scene.camera)
            if (boundingBoxMeshScreenSpace !== null && typeof boundingBoxMeshScreenSpace[0] === "number") {
                this.raycaster.castMouse(this.scene.camera, boundingBoxMeshScreenSpace)
                const hits = this.raycaster.intersectBounds(this.occluder.mesh)
                if (hits.length) {
                    targetBrightness = 0

                    alpha = .25
                } else {
                    lightSourceDistance = vec2.distance(lightSourceScreenSpaceVector, this.center)
                    targetBrightness = 1 - Math.pow(lightSourceDistance, this.config.CenterFadePower.value)
                    targetBrightness = Math.max(targetBrightness, 0.)
                    targetBrightness *= this.config.GlobalOpacity.value

                    alpha = .05
                }
            }

            this.globalBrightness = lerp(this.globalBrightness, targetBrightness, alpha)
            if (this.scene.post.program.uniforms.uDirtOpacityFactor) this.scene.post.program.uniforms.uDirtOpacityFactor.value = this.globalBrightness * this.occlusionDirtMultiplier
        } else {
            // Calc brightness from light source position
            lightSourceDistance = vec2.distance(lightSourceScreenSpaceVector, this.center)
            this.globalBrightness = 1 - Math.pow(lightSourceDistance, this.config.CenterFadePower.value)
            this.globalBrightness = Math.max(this.globalBrightness, 0.)
            this.globalBrightness *= this.config.GlobalOpacity.value
        }

        for (let index = 0; index < this.flares.length; index++) {
            const flare = this.flares[index];

            flare.globalOpacity = this.globalBrightness

            // Broken ?
            // if (this.globalBrightness < 0.02) continue

            flare.position.x = lightSourceScreenSpaceVector[0] - (this.direction[0] * flare.step * index) + flare.config.Offset.value.x
            flare.position.y = lightSourceScreenSpaceVector[1] - (this.direction[1] * flare.step * index) + flare.config.Offset.value.y

            // Does not look good
            // flare.scaleScalarFactor = clamp(lightSourceDistance * lightSourceDistance * lightSourceDistance * lightSourceDistance, 0, 1)
            // flare.scale.set(this.globalBrightness)

            // Look at center
            if (!flare.lookAtCenter) continue
            vec2.set(tempFlarePosition, flare.position.x, flare.position.y)
            flare.direction = -getVectorAngle(this.direction, tempFlarePosition)
        }
    }

    dispose() {
        for (const flare of this.flares) {
            flare.dispose()
        }
    }
}

export const getJJAbramsFlares = (scene, step) => ([
    new Flare(scene, { step: 0, scale: { x: 1.85, y: 1.08 }, textureId: 'Spikes', opacity: 2, lookAtCenter: false }),
    new Flare(scene, { step: 0, scale: { x: 1, y: 1 }, textureId: 'Orb' }),

    new Flare(scene, { step: 0, offset: { x: 0, y: 0 }, scale: { x: 1.4, y: 1 }, textureId: 'Stripe_02', lookAtCenter: false }),
    new Flare(scene, { step: step * 1.1, offset: { x: -0.32, y: -0.20 }, scale: { x: .4, y: .4 }, textureId: 'Stripe_01', lookAtCenter: false }),
    new Flare(scene, { step: step * 1.1, offset: { x: 0.37, y: -0.24 }, scale: { x: .58, y: .6 }, textureId: 'Stripe_03', lookAtCenter: false }),
    new Flare(scene, { step: step * 1.1, offset: { x: 0.4, y: -0.38 }, scale: { x: 1, y: 1 }, textureId: 'Chromatic_Stripe', lookAtCenter: false }),
])

export const getSimonDhaenensFlares = (scene, step) => ([
    new Flare(scene, { step: 0, scale: { x: .7, y: .7 }, offset: { x: 0, y: 0 }, textureId: 'Simon_Glow', opacity: 1, lookAtCenter: false }),
    new Flare(scene, { step: 0, scale: { x: 2.85, y: 2.08 }, textureId: 'Spikes', opacity: .35, lookAtCenter: false }),
    new Flare(scene, { step: 0, scale: { x: 1, y: 1 }, textureId: 'Orb' }),

    new Flare(scene, { step: 0, offset: { x: 0, y: 0 }, scale: { x: 1.4, y: 1 }, opacity: 1.5, textureId: 'Stripe_02', lookAtCenter: false }),
    new Flare(scene, { step: step * .33, offset: { x: -0.32, y: -0.07 }, scale: { x: .4, y: .4 }, textureId: 'Stripe_01', lookAtCenter: false }),
    new Flare(scene, { step: step * .33, offset: { x: 0.4, y: -0.1 }, scale: { x: 1, y: 1 }, textureId: 'Chromatic_Stripe', lookAtCenter: false }),

    new Flare(scene, { step: step * 3, scale: { x: 1, y: 1 }, textureId: `Simon_Arc_01_Blob`, rotationOffset: -0.28, opacity: .11 }),
    new Flare(scene, { step: step * 3.17, scale: { x: .75, y: .75 }, textureId: `Simon_Arc_00`, rotationOffset: -0.28, opacity: .11 }),
])

export const getCircularFlares = (scene, step) => ([
    new Flare(scene, { step: 0, scale: { x: 2.5 * .1, y: .23 * .1 }, offset: { x: 0, y: 0 }, textureId: 'Glow_00', opacity: 3.2, lookAtCenter: false }),
    new Flare(scene, { step, scale: {x: 1, y: 1}, opacity: 15, textureId: 'Circular_Partial_00' })
])

export const getTestFlares = (scene, step) => ([
    new Flare(scene, { step: 0, scale: { x: 1, y: 1 }, textureId: 'Glow_00', lookAtCenter: false }),
    new Flare(scene, { step: step * 1.60, scale: { x: .03, y: .03 }, textureId: `Hexa_00` }),
    new Flare(scene, { step: step * 1.28, scale: { x: .0315, y: .0315 }, textureId: `Hexa_01` }),
    new Flare(scene, { step: step * 1.41, scale: { x: .03, y: .03 }, textureId: `Hexa_02` }),
    new Flare(scene, { step: step * 1.62, scale: { x: .039, y: .039 }, textureId: `Hexa_00` }),
    new Flare(scene, { step: step * 1.20, scale: { x: .06, y: .06 }, textureId: `Hexa_02` }),
    new Flare(scene, { step: step * 1.40, scale: { x: .075, y: .075 }, textureId: `Hexa_01` }),
    new Flare(scene, { step: step * 1.50, scale: { x: .0925, y: .0925 }, textureId: `Hexa_01` }),
    new Flare(scene, { step: step * 1.43, scale: { x: .092, y: .092 }, textureId: `Hexa_02` }),
    new Flare(scene, { step: step * 1.45, textureId: `Arc_01` }),
])

export default LensFlares
