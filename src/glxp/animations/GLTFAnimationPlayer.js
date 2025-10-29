import { Vec3 } from '../ogl/math/Vec3.js';
import { Quat } from '../ogl/math/Quat.js';

const TEMP_VEC3_1 = new Vec3();
const TEMP_VEC3_2 = new Vec3();
const TEMP_VEC3_3 = new Vec3();
const TEMP_VEC3_4 = new Vec3();

const TEMP_QUATERNION_1 = new Quat();
const TEMP_QUATERNION_2 = new Quat();
const TEMP_QUATERNION_3 = new Quat();
const TEMP_QUATERNION_4 = new Quat();

// When exporting your GLTF, make sure all animation tracks have the same number of keyframes
export default class GLTFAnimationPlayer {
    constructor(name, data, { loop = false, weight = 1, positionMultiplier = 1, scaleMultiplier = 1, timeScale = 1 }) {
        this.name = name;
        this.data = data;
        this.elapsedTime = 0;
        this.weight = weight;
        this.scaleMultiplier = scaleMultiplier;
        this.positionMultiplier = positionMultiplier;
        this.timeScale = timeScale;
        // Set to false to not apply modulo to elapsed against duration
        this.loop = loop;
        // Find starting time as exports from blender (perhaps others too) don't always start from 0
        this.startTime = data.reduce((a, { times }) => Math.min(a, times[0]), Infinity);
        // Get largest final time in all channels to calculate duration
        this.endTime = data.reduce((a, { times }) => Math.max(a, times[times.length - 1]), 0);
        this.duration = this.endTime - this.startTime;
    }

    setProgress = (progress) => {
        this.elapsedTime = this.duration * progress;
    };

    /**
     * Can either update using normalized progress or time
     * @param {Transform} targetTransform 
     * @param {{progress: number, time: number, weight: number}} options
     */
    update = (targetTransform, { progress = null, time = null, weight = 1 }) => {
        if (progress !== null) this.setProgress(progress)
        else if (time !== null) this.elapsedTime += time * this.timeScale;

        // const weight = isSet ? 1 : this.weight / weight; // Don't understand this
        this.weight = weight;
        const elapsed = !this.duration
            ? 0
            : (this.loop ? this.elapsedTime % this.duration : Math.min(this.elapsedTime, this.duration - 0.001)) + this.startTime;

        this.data.forEach(({ node, path, interpolation, times, values }) => {
            // console.log('path', path);
            // console.log('values', values);
            // console.log('times', times);
            // console.log('elapsed', elapsed);
            // console.log('weight', weight);
            // console.log('interpolation', interpolation);

            if (!this.duration) {
                let val = TEMP_VEC3_1;
                let size = 3;
                if (path === 'rotation') {
                    val = TEMP_QUATERNION_1;
                    size = 4;
                }
                val.fromArray(values, 0);

                switch (path) {
                    case "translation":
                        val[0] *= this.positionMultiplier;
                        val[1] *= this.positionMultiplier;
                        val[2] *= this.positionMultiplier;
                        targetTransform.position.lerp(val, this.weight);
                        break;

                    case "scale":
                        val[0] *= this.scaleMultiplier;
                        val[1] *= this.scaleMultiplier;
                        val[2] *= this.scaleMultiplier;
                        targetTransform.scale.lerp(val, this.weight);
                        break;

                    case "rotation":
                        targetTransform.quaternion.slerp(val, this.weight);
                        break;

                    default:
                        break;
                }

                return;
            }

            // Get index of two time values elapsed is between
            const prevIndex =
                Math.max(
                    1,
                    times.findIndex((t) => t > elapsed)
                ) - 1;
            const nextIndex = prevIndex + 1;

            // Get linear blend/alpha between the two
            let alpha = (elapsed - times[prevIndex]) / (times[nextIndex] - times[prevIndex]);
            if (interpolation === 'STEP') alpha = 0;

            let prevVal = TEMP_VEC3_1;
            let prevTan = TEMP_VEC3_2;
            let nextTan = TEMP_VEC3_3;
            let nextVal = TEMP_VEC3_4;
            let size = 3;

            if (path === 'rotation') {
                prevVal = TEMP_QUATERNION_1;
                prevTan = TEMP_QUATERNION_2;
                nextTan = TEMP_QUATERNION_3;
                nextVal = TEMP_QUATERNION_4;
                size = 4;
            }

            if (interpolation === 'CUBICSPLINE') {
                // Get the prev and next values from the indices
                prevVal.fromArray(values, prevIndex * size * 3 + size * 1);
                prevTan.fromArray(values, prevIndex * size * 3 + size * 2);
                nextTan.fromArray(values, nextIndex * size * 3 + size * 0);
                nextVal.fromArray(values, nextIndex * size * 3 + size * 1);

                // interpolate for final value
                prevVal = this.cubicSplineInterpolate(alpha, prevVal, prevTan, nextTan, nextVal);
                if (size === 4) prevVal.normalize();
            } else {
                // Get the prev and next values from the indices
                prevVal.fromArray(values, prevIndex * size);
                nextVal.fromArray(values, nextIndex * size);

                // interpolate for final value
                if (size === 4) prevVal.slerp(nextVal, alpha);
                else prevVal.lerp(nextVal, alpha);
            }

            // interpolate between multiple possible animations
            switch (path) {
                case "translation":
                    prevVal[0] *= this.positionMultiplier;
                    prevVal[1] *= this.positionMultiplier;
                    prevVal[2] *= this.positionMultiplier;
                    targetTransform.position.lerp(prevVal, this.weight);
                    break;

                case "scale":
                    prevVal[0] *= this.scaleMultiplier;
                    prevVal[1] *= this.scaleMultiplier;
                    prevVal[2] *= this.scaleMultiplier;
                    targetTransform.scale.lerp(prevVal, this.weight);
                    break;

                case "rotation":
                    targetTransform.quaternion.slerp(prevVal, this.weight);
                    break;

                default:
                    break;
            }

            // if (size === 4) targetTransform.slerp(prevVal, weight);
            // else targetTransform.lerp(prevVal, weight);
        });
    }

    cubicSplineInterpolate(t, prevVal, prevTan, nextTan, nextVal) {
        const t2 = t * t;
        const t3 = t2 * t;

        const s2 = 3 * t2 - 2 * t3;
        const s3 = t3 - t2;
        const s0 = 1 - s2;
        const s1 = s3 - t2 + t;

        for (let i = 0; i < prevVal.length; i++) {
            prevVal[i] = s0 * prevVal[i] + s1 * (1 - t) * prevTan[i] + s2 * nextVal[i] + s3 * t * nextTan[i];
        }

        return prevVal;
    }
}
