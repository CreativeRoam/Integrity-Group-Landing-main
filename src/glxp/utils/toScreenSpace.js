import { vec4, vec2 } from 'gl-matrix'
import { Camera } from "../ogl/core/Camera"
import { Vec3 } from "../ogl/math/Vec3";

const SCREEN_POS = vec4.create()

/**
 * World position to screen space
 * Recreates GLSL's matrix transformations that calc clip space coordinates
 * @param {Vec3} worldPosition 
 * @param {Camera} camera 
 * @returns a vec2 in clip space, or null if behind camera
 */
export function toScreenSpace(worldPosition, camera){
    SCREEN_POS[0] = worldPosition[0]
    SCREEN_POS[1] = worldPosition[1]
    SCREEN_POS[2] = worldPosition[2]
    SCREEN_POS[3] = 1

    vec4.transformMat4(SCREEN_POS, SCREEN_POS, camera.viewMatrix)
    vec4.transformMat4(SCREEN_POS, SCREEN_POS, camera.projectionMatrix)

    // Is it behind the camera ?
    if(SCREEN_POS[3] < 0) return null

    // Perspective divide
    return [SCREEN_POS[0] / SCREEN_POS[3], SCREEN_POS[1] / SCREEN_POS[3]]
}