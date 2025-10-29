// old matcap shader:
/*
<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 aPos;
    attribute vec3 aNormal;
    attribute vec2 aUvs;

    uniform vec3 uEye;
    uniform mat4 uPMatrix;
    uniform mat4 uMMatrix;
    uniform mat4 uVMatrix;
    uniform mat4 uNMatrix;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec2 vScreenPos;
    varying vec3 vPos;
    varying vec3 vPeye;

    void main(){
        vUv = aUvs;

        vNormal = normalize((uNMatrix * vec4(aNormal, 0.0)).xyz);

        vec4 wPos = uMMatrix * vec4(aPos, 1.0);
        vPos = wPos.xyz;

        vPeye = normalize(vPos - vec3(uEye));
        vPeye = mat3(uVMatrix) * vPeye;

        gl_Position = uPMatrix * uVMatrix * wPos;
        vScreenPos = ((gl_Position.xy / gl_Position.w) * .5) +.5;
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    uniform sampler2D uTexture;
    uniform sampler2D uMatcap;

    varying vec2 vUv;
    varying vec2 vScreenPos;
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 vPeye;

    vec2 matcap(vec3 eye, vec3 normal) {
        vec3 reflected = reflect(eye, normal);
        float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
        return reflected.xy / m + 0.5;
    }

    void main() {   

        // Matcap                            
        vec4 m = texture2D( uMatcap, matcap(vPeye, vNormal));
        gl_FragColor = vec4(m); 

    } 
        
<% } %>
*/

<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform vec3 uEye;
    uniform mat4 uPMatrix;
    uniform mat4 uMMatrix;
    uniform mat4 uVMatrix;
    uniform mat3 uNMatrix;

    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 cameraPosition;

    varying vec2 vUv;
    varying vec3 vNormal;
    // varying vec2 vScreenPos;
    varying vec3 vPos;
    varying vec3 vPeye;

    void main(){
        vUv = uv;

        vNormal = normalize(modelMatrix * vec4(normal, 0.)).xyz;

        vec4 wPos = modelMatrix * vec4(position, 1.0);
        vPos = wPos.xyz;

        vPeye = normalize(vPos - vec3(uEye));
        vPeye = mat3(uVMatrix) * vPeye;

        gl_Position = projectionMatrix * uVMatrix * wPos;
        // vScreenPos = ((gl_Position.xy / gl_Position.w) * .5) +.5;
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    uniform sampler2D uMatcap;

    varying vec2 vUv;
    // varying vec2 vScreenPos;
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec3 vPeye;

    vec2 matcap(vec3 eye, vec3 normal) {
        vec3 reflected = reflect(eye, normal);
        float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
        return reflected.xy / m + 0.5;
    }

    void main() {   

        // Matcap                 
        vec4 m = texture2D( uMatcap, matcap(vPeye, vNormal));
        // vec4 m = texture2D(uMatcap, vUv);
        // vec4 m = vec4(1.0, 0., 0.0, 1.0);
        // vec4 m = vec4(vUv.x, vUv.y, 0., 1.);
        gl_FragColor = vec4(m); 

    } 
        
<% } %>