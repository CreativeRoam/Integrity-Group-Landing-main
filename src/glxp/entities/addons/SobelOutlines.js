import { Camera } from '@/glxp/ogl/core/Camera.js'
import { Program } from '@/glxp/ogl/core/Program.js'
import { RenderTarget } from '@/glxp/ogl/core/RenderTarget.js'
import { Texture } from '@/glxp/ogl/core/Texture.js'

import Shader from '@/glxp/utils/Shader'
import ShaderManifest from '@/glxp/shaderManifest'

import PostProcessRT from '@/glxp/postProcess/PostProcessRT'

export default class SobelOutlines {
    constructor(scene, { camera = new Camera(gl), width = 1024, height = width }) {
        this.scene = scene
        this.gl = this.scene.gl

        this.camera = camera

        this.target = new RenderTarget(this.gl, { 
            width, 
            height,
            format: this.gl.RGBA,
            internalFormat: this.gl.RGBA16F,
            type: this.gl.FLOAT,
        })

        this.rt = new PostProcessRT(this.scene , 1, 'rgb', null, true)
        this.rtt = new Texture(this.gl, {
            rt: this.rt,
            width: this.rt.width,
            height: this.rt.height,
        })
        this.rttDepth = new Texture(this.gl, {
            rt: this.rt,
            depth: true,
            width: this.rt.width,
            height: this.rt.height,
        })

        // this.sobelProgram = new Program(this.gl, {
        //     vertex: defaultVertex,
        //     fragment: defaultFragment,
        //     cullFace: null,
        // })

        this.castMeshes = []
    }

    add({
        mesh,
        cast = true,
        occlude = false,
        overrideNormals = true,
        vertex = defaultVertex,
        fragment = defaultFragment,
        // uniformProjection = 'shadowProjectionMatrix',
        // uniformView = 'shadowViewMatrix',
        // uniformTexture = 'tShadow',
    }) {
        // Add uniforms to existing program
        // if (receive && !mesh.program.uniforms[uniformProjection]) {
        //     mesh.program.uniforms[uniformProjection] = { value: this.camera.projectionMatrix };
        //     mesh.program.uniforms[uniformView] = { value: this.camera.viewMatrix };
        //     mesh.program.uniforms[uniformTexture] = { value: this.target.texture };
        // }

        if (!cast && !occlude) return

        this.castMeshes.push(mesh)

        // Store program for when switching between depth override
        mesh.colorProgram = mesh.program

        // Check if depth program already attached
        if (mesh.sobelProgram) return

        // Use global depth override if nothing custom passed in
        // if (vertex === defaultVertex && fragment === defaultFragment) {
        //     mesh.sobelProgram = this.sobelProgram;
        //     return;
        // }

        // Different shader for occluders
        if (occlude) {
            fragment = occludeFragment
        } else if (overrideNormals) {
            const defines = {}

            if (mesh.geometry.attributes.normal) {
                defines['HAS_NORMALS'] = 1
            }

            if (mesh.geometry.attributes.uvs) {
                defines['HAS_UV'] = 1
            }

            if (mesh.geometry.attributes.tangents){
                defines['HAS_TANGENTS'] = 1
            }

            const shader = new Shader(ShaderManifest['sobel'], 1, defines)

            vertex = shader.vert
            fragment = shader.frag
        }

        // Create custom override program
        let uniforms = {}

        mesh.sobelProgram = new Program(this.gl, {
            vertex,
            fragment,
            // cullFace: null,
            uniforms
        });
    }

    render({ scene }) {

        // for (let i = 0; i < this.castMeshes.length; i++) {
        //     const element = this.castMeshes[i];
        //     if (this.castMeshes[i].skin !== undefined) {
        //         this.castMeshes[i].sobelProgram.uniforms.uBones.value = this.castMeshes[i].skin.boneArray
        //     }
        // }

        // For depth render, replace program with depth override.
        // Hide meshes not casting shadows.
        scene.traverse((node) => {
            if (!node.draw) return

            if (!!~this.castMeshes.indexOf(node)) {
                node.program = node.sobelProgram
            } else {
                node.isForceVisibility = node.visible
                node.visible = false
            }
        });

        // Render the depth shadow map using the light as the camera
        this.gl.renderer.render({
            scene,
            camera: this.camera,
            post: this,
        });

        // Then switch the program back to the normal one
        scene.traverse((node) => {
            if (!node.draw) return
          
            if (!!~this.castMeshes.indexOf(node)) {
                node.program = node.colorProgram
            } else {
                node.visible = node.isForceVisibility
            }
        });
    }
}

const defaultVertex = /* glsl */ `
    attribute vec3 position;
    attribute vec2 uv;
    attribute vec3 normal;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec3 vNormal;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const defaultFragment = /* glsl */ `
    precision highp float;

    varying vec3 vNormal;

    void main() {
        gl_FragColor = vec4(vNormal, 1.);
    }
`;

const occludeFragment = /* glsl */ `
    precision highp float;

    varying vec3 vNormal;

    void main() {
        gl_FragColor = vec4(vec3(1.0), 1.);
    }
`;
