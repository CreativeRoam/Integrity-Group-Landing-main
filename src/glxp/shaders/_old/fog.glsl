<% if (vert) { %>
  
    precision highp float; 

    attribute vec4 a_param;
    attribute vec3 a_offset;
    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 uOffset;
    uniform vec2 uSize;
    uniform float uTime;

    varying vec2 vUv;
    varying vec4 vParam;

    void main(){
        vUv = uv;
        vParam = a_param;

        vec3 pos = position;
        // Scale -----
        pos.xy *= uSize * a_param.y;


        // pos.xy += a_offset.xy * uOffset.xy;
        // pos.z += a_offset.z;
        pos += a_offset * uOffset;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uAlpha;
    uniform float uSpread;
    uniform float uSpeed;

    varying vec4 vParam;
    varying vec2 vUv;


    void main() { 
        vec2 tUv = vUv*.5;
        tUv.x += vParam.z;
        tUv.y += vParam.w;
        tUv.x -= uTime * vParam.x * uSpeed;

        vec4 t = texture2D( uTexture, tUv );

        vec3 color = t.rgb * uAlpha;
        color *= smoothstep(0., uSpread, vUv.y) * smoothstep(1., 1. - uSpread, vUv.y);
        color *= smoothstep(0., uSpread, vUv.x) * smoothstep(1., 1. - uSpread, vUv.x);
        float a = 1.;

        gl_FragColor = vec4(color, a);
        // gl_FragColor = vec4(1., 0., 0., 1.);
    }
        
<% } %>