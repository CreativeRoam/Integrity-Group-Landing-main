<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 modelMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;

    varying vec2 vUv;
    varying vec4 vPos;


    void main(){
        vec4 wPos = modelMatrix * vec4(position, 1.0);
        vPos = wPos;
        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec4 vPos;

    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;

    uniform float uReflectionScale;
    uniform float uReflectionSize;
    uniform float uReflectionOpacity;
    uniform float uCircleRadius;
    uniform float uFeather;
    uniform float uScrollSpeed;

    uniform vec3 uColor;

    uniform sampler2D uTexture;
    uniform sampler2D uNoiseTexture;
    uniform float uTime;

    float blendScreen(float base, float blend) {
        return 1.0-((1.0-base)*(1.0-blend));
    }

    vec3 blendScreen(vec3 base, vec3 blend) {
        return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
    }

    vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
        return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
    }

    void main() { 

        vec4 clipSpace = projectionMatrix * (viewMatrix * vPos);
        vec3 ndc = clipSpace.xyz / clipSpace.w;
        vec2 ssUv = (ndc.xy * .5 + .5);

        vec2 uv = vUv;
        uv -= vec2(0.5);
        float dist = sqrt(dot(uv, uv)) * 2.;

        float dr = uCircleRadius;
        float alpha = smoothstep(dr+uFeather, dr-uFeather, dist);

        vec2 fUv = (vUv + vec2(0., uTime * uScrollSpeed)) * uReflectionSize;
        vec2 d = ((texture2D( uNoiseTexture, fUv ).xy));
        vec4 t = texture2D( uTexture, ssUv + (d * uReflectionScale) );

        vec3 color = uColor;
        color.xyz = blendScreen(color, t.xyz * uReflectionOpacity, 1.);
        color -= (d.x + d.y) * .05;

        gl_FragColor = vec4(color, alpha); 
        
        // gl_FragColor = texture2D( uNoiseTexture, fUv ); 
    } 
        
<% } %>