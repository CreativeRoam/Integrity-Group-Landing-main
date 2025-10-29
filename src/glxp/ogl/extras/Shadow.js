import { Camera } from '../core/Camera.js';
import { Program } from '../core/Program.js';
import { RenderTarget } from '../core/RenderTarget.js';

export class Shadow {
    constructor(gl, { light = new Camera(gl), width = 1024, height = width }) {
        this.gl = gl;

        this.light = light;

        this.target = new RenderTarget(gl, { 
            width, 
            height,
            format: gl.RGBA,
            internalFormat: gl.RGBA16F,
            type: gl.FLOAT,
        });

        this.depthProgram = new Program(gl, {
            vertex: defaultVertex,
            fragment: defaultFragment,
            cullFace: null,
        });

        this.castMeshes = [];
    }

    add({
        mesh,
        receive = true,
        cast = true,
        vertex = defaultVertex,
        fragment = defaultFragment,
        uniformProjection = 'shadowProjectionMatrix',
        uniformView = 'shadowViewMatrix',
        uniformTexture = 'tShadow',
    }) {
        // Add uniforms to existing program
        if (receive && !mesh.program.uniforms[uniformProjection]) {
            mesh.program.uniforms[uniformProjection] = { value: this.light.projectionMatrix };
            mesh.program.uniforms[uniformView] = { value: this.light.viewMatrix };
            mesh.program.uniforms[uniformTexture] = { value: this.target.texture };
        }

        let uniforms = {}
        if (mesh.skin !== undefined) {
            vertex = `#define MAX_BONES ${mesh.skin.bonesNumb}
            ${skinedtVertex}`

            uniforms['uBones'] = { value: mesh.skin.boneArray }
        }


        if (!cast) return;
        this.castMeshes.push(mesh);

        // Store program for when switching between depth override
        mesh.colorProgram = mesh.program;

        // Check if depth program already attached
        // if (mesh.depthProgram) return;

        // Use global depth override if nothing custom passed in
        // if (vertex === defaultVertex && fragment === defaultFragment) {
        //     mesh.depthProgram = this.depthProgram;
        //     return;
        // }

        // Create custom override program
        mesh.depthProgram = new Program(this.gl, {
            vertex,
            fragment,
            cullFace: null,
            uniforms
        });
    }

    render({ scene }) {

        for (let i = 0; i < this.castMeshes.length; i++) {
            const element = this.castMeshes[i];
            if (this.castMeshes[i].skin !== undefined) {
                this.castMeshes[i].depthProgram.uniforms.uBones.value = this.castMeshes[i].skin.boneArray
            }
        }

        // For depth render, replace program with depth override.
        // Hide meshes not casting shadows.
        scene.traverse((node) => {
            if (!node.draw) return;
            if (!!~this.castMeshes.indexOf(node)) {
                node.program = node.depthProgram;
            } else {
                node.isForceVisibility = node.visible;
                node.visible = false;
            }
        });

        // Render the depth shadow map using the light as the camera
        this.gl.renderer.render({
            scene,
            camera: this.light,
            target: this.target,
        });

        // Then switch the program back to the normal one
        scene.traverse((node) => {
            if (!node.draw) return;
            if (!!~this.castMeshes.indexOf(node)) {
                node.program = node.colorProgram;
            } else {
                node.visible = node.isForceVisibility;
            }
        });
    }
}

const defaultVertex = /* glsl */ `
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const skinedtVertex = /* glsl */ `
    attribute vec4 joints0;
    attribute vec4 weights0;
    uniform mat4 uBones[MAX_BONES];

    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    void main() {

        vec4 bindPos = vec4(position, 1.0);
        vec4 skinedPos = vec4(0.0);

        mat4 boneMatX = uBones[int(joints0.x)];
        mat4 boneMatY = uBones[int(joints0.y)];
        mat4 boneMatZ = uBones[int(joints0.z)];
        mat4 boneMatW = uBones[int(joints0.w)];

        skinedPos += boneMatX * bindPos * weights0.x;
        skinedPos += boneMatY * bindPos * weights0.y;
        skinedPos += boneMatZ * bindPos * weights0.z;
        skinedPos += boneMatW * bindPos * weights0.w;

        gl_Position = projectionMatrix * modelViewMatrix * skinedPos;

    }
`;

const defaultFragment = /* glsl */ `
    precision highp float;
    vec3 floatToRgb(float v, float scale) {
        float r = v;
        float g = mod(v*scale,1.0);
        r-= g/scale;
        float b = mod(v*scale*scale,1.0);
        g-=b/scale;
        return vec3(r,g,b);
    }
    void main() {
        // gl_FragColor = vec4(floatToRgb(gl_FragCoord.z, 1.), 1.);
        // gl_FragColor = packRGBA(gl_FragCoord.z);
        gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.);
    }
`;
