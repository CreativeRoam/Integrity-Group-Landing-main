<% if (vert) { %>

    precision highp float; 

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    attribute vec4 aWeights_0;         // 4 weights per vertex
    attribute vec4 aBoneNdx_0;         // 4 bone indices per vertex

    <%if (defines["ATTRIB_STACK"] >= 2) { %>
        attribute vec4 aWeights_1;         // 4 weights per vertex
        attribute vec4 aBoneNdx_1;         // 4 bone indices per vertex
    <% } %>
    <%if (defines["ATTRIB_STACK"] >= 3) { %>
        attribute vec4 aWeights_2;         // 4 weights per vertex
        attribute vec4 aBoneNdx_2;         // 4 bone indices per vertex
    <% } %>

    uniform mat4 uBones[MAX_BONES];   // 1 matrix per bone

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vDebug;
    varying vec3 vNormal;

    mat4 extractRotationFromMat4(mat4 t){
        mat4 rotMat = t;
        rotMat[3][0] = 0.;
        rotMat[3][1] = 0.;
        rotMat[3][2] = 0.;
        rotMat[3][3] = 1.;
        return rotMat;
    }

    void main(){
        vUv = uv;        
        vec4 skinedPos = vec4(0.);
        vec4 skinedNorm = vec4(0.);

        skinedPos += uBones[int(aBoneNdx_0[0])] * vec4(position, 1.0) * aWeights_0[0];
        skinedPos += uBones[int(aBoneNdx_0[1])] * vec4(position, 1.0) * aWeights_0[1];
        skinedPos += uBones[int(aBoneNdx_0[2])] * vec4(position, 1.0) * aWeights_0[2];
        skinedPos += uBones[int(aBoneNdx_0[3])] * vec4(position, 1.0) * aWeights_0[3];

        skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_0[0])] ) * vec4(normal, 1.0) * aWeights_0[0];
        skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_0[1])] ) * vec4(normal, 1.0) * aWeights_0[1];
        skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_0[2])] ) * vec4(normal, 1.0) * aWeights_0[2];
        skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_0[3])] ) * vec4(normal, 1.0) * aWeights_0[3];

        <%if (defines["ATTRIB_STACK"] >= 2) { %>
            skinedPos += uBones[int(aBoneNdx_1[0])] * vec4(position, 1.0) * aWeights_1[0];
            skinedPos += uBones[int(aBoneNdx_1[1])] * vec4(position, 1.0) * aWeights_1[1];
            skinedPos += uBones[int(aBoneNdx_1[2])] * vec4(position, 1.0) * aWeights_1[2];
            skinedPos += uBones[int(aBoneNdx_1[3])] * vec4(position, 1.0) * aWeights_1[3];

            skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_1[0])] ) * vec4(normal, 1.0) * aWeights_1[0];
            skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_1[1])] ) * vec4(normal, 1.0) * aWeights_1[1];
            skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_1[2])] ) * vec4(normal, 1.0) * aWeights_1[2];
            skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_1[3])] ) * vec4(normal, 1.0) * aWeights_1[3];
        <% } %>

        <%if (defines["ATTRIB_STACK"] >= 3) { %>
            skinedPos += uBones[int(aBoneNdx_2[0])] * vec4(position, 1.0) * aWeights_2[0];
            skinedPos += uBones[int(aBoneNdx_2[1])] * vec4(position, 1.0) * aWeights_2[1];
            skinedPos += uBones[int(aBoneNdx_2[2])] * vec4(position, 1.0) * aWeights_2[2];
            skinedPos += uBones[int(aBoneNdx_2[3])] * vec4(position, 1.0) * aWeights_2[3];

            skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_2[0])] ) * vec4(normal, 1.0) * aWeights_2[0];
            skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_2[1])] ) * vec4(normal, 1.0) * aWeights_2[1];
            skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_2[2])] ) * vec4(normal, 1.0) * aWeights_2[2];
            skinedNorm += extractRotationFromMat4( uBones[int(aBoneNdx_2[3])] ) * vec4(normal, 1.0) * aWeights_2[3];
        <% } %>

        vNormal = skinedNorm.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * skinedPos;

    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec3 vNormal;

    uniform sampler2D uTexture;
    uniform float uAlpha;
    uniform float uBright;

    void main() {   
        vec4 t = texture2D( uTexture, vUv );
        t.rgb *= uBright;
        t.a *= uAlpha;

        gl_FragColor = t; 
        gl_FragColor = vec4(vNormal, 1.); 
    } 
        
<% } %>