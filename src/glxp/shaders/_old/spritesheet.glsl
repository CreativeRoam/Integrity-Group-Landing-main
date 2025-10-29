<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;
    uniform float uTime;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;

    void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uRez;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uFrames;
    uniform float uFrame;
    uniform float uCollums;
    uniform float uRows;

    void main() { 

        vec2 uv = vUv;
        float f = max(uFrame - 1., 0.);
        uv.x += mod(f, uCollums);
        uv.y -= floor(uRows * (f/uFrames)) + 1.;
        uv.y /= uRows;
        uv.x /= uCollums;    
        gl_FragColor = texture2D( uTexture, uv ); 

    } 
        
<% } %>