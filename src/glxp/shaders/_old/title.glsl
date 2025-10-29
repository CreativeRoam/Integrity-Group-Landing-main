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
        float sdf = texture2D( uTexture, uv ).r;
        float alpha = smoothstep(.3, .8, sdf);

        vec3 color = mix(uColor, vec3(smoothstep(.3, .29, f/uFrames) * uColor), smoothstep(.15, .14, vUv.y));
        gl_FragColor = vec4(color, alpha * uOpacity); 
        // gl_FragColor = vec4(color, 1.); 

    } 
        
<% } %>