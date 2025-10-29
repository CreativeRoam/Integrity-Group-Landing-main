import { Transform } from './Transform.js';
import { Mat3 } from '../math/Mat3.js';
import { Mat4 } from '../math/Mat4.js';


export class Mesh extends Transform {
    constructor(gl, { geometry, program, mode = gl.TRIANGLES, frustumCulled = true, renderOrder = 0, forceRenderOrder = false, transform = null } = {}) {
        super();
        if (!gl.canvas) console.error('gl not passed as first argument to Mesh');
        this.gl = gl;

        if (transform !== null) {
            this.position.copy(transform.position)
            this.scale.copy(transform.scale)
            this.rotation.copy(transform.rotation)
            if (transform.parent) {
                this.setParent(transform.parent)
            }
        }
        
        this.geometry = geometry;
        this.program = program;
        this.mode = mode;

        // Used to skip frustum culling
        this.frustumCulled = frustumCulled;

        // Override sorting to force an order
        // Caution: renderOrder and forceRenderOrder work only when renderer.render has "sort:true"
        this.renderOrder = renderOrder;
        if (forceRenderOrder) {
            this.forceRenderOrder = true
        } else {
            this.forceRenderOrder = this.renderOrder !== 0 && typeof this.renderOrder === 'number'
        }

        this.modelViewMatrix = new Mat4();
        this.normalMatrix = new Mat3();
        this.isCameraFliped = false;
        this.beforeRenderCallbacks = [];
        this.afterRenderCallbacks = [];
    }

    onBeforeRender(f) {
        this.beforeRenderCallbacks.push(f);
        return this;
    }

    onAfterRender(f) {
        this.afterRenderCallbacks.push(f);
        return this;
    }

    draw({ camera } = {}) {
        this.beforeRenderCallbacks.forEach((f) => f && f({ mesh: this, camera }));
        let cameraIsFliped = false
        if (camera) {
            // Add empty matrix uniforms to program if unset
            if (!this.program.uniforms.modelMatrix) {
                Object.assign(this.program.uniforms, {
                    modelMatrix: { value: null },
                    viewMatrix: { value: null },
                    modelViewMatrix: { value: null },
                    normalMatrix: { value: null },
                    projectionMatrix: { value: null },
                    cameraPosition: { value: null },
                    isCameraFliped: { value: null },
                });
            }

            // Set the matrix uniforms
            this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
            this.program.uniforms.cameraPosition.value = camera.worldPosition;
            this.program.uniforms.viewMatrix.value = camera.viewMatrix;
            this.program.uniforms.isCameraFliped.value = camera.isFliped;
            this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
            this.normalMatrix.getNormalMatrix(this.worldMatrix);
            this.program.uniforms.modelMatrix.value = this.worldMatrix;
            this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
            this.program.uniforms.normalMatrix.value = this.normalMatrix;
            cameraIsFliped = camera.isFliped;
        }

        // determine if faces need to be flipped - when mesh scaled negatively
        let flipFaces = (this.program.cullFace && this.worldMatrix.determinant() < 0) || cameraIsFliped;
        this.program.use({ flipFaces });
        this.geometry.draw({ mode: this.mode, program: this.program });
        this.afterRenderCallbacks.forEach((f) => f && f({ mesh: this, camera }));
    }
}
