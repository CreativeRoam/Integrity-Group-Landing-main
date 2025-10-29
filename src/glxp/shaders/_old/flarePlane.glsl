<% if (vert) { %>
    attribute vec3 position;
    attribute vec2 uv;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 modelMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
        vUv = uv;   
        gl_Position = modelMatrix * vec4(position, 1.0);
    }
<% } %>



<% if (frag) { %>
    precision highp float;

    uniform sampler2D uTexture;
    uniform float uOpacity;
    uniform float uDirection;

    #ifdef HAS_COLOR_CORRECTION
        uniform float uTintOpacity;
        uniform float uExposure;
        uniform float uSaturation;
        uniform vec3 uTint;
    #endif

    varying vec2 vUv;

    mat2 rotate2d(float _angle){
        return mat2(cos(_angle),-sin(_angle),
                    sin(_angle),cos(_angle));
    }

    vec3 exposure(vec3 color, float value) {
        return (1.0 + value) * color;
    }

    vec3 czm_saturation(vec3 rgb, float adjustment) {
        const vec3 W = vec3(0.2125, 0.7154, 0.0721);
        vec3 intensity = vec3(dot(rgb, W));
        return mix(intensity, rgb, adjustment);
    }

    void main() {
        vec2 rotatedUv = vUv;
        rotatedUv -= vec2(.5);
        rotatedUv *= rotate2d(uDirection);
        rotatedUv += vec2(.5);

        vec4 texel = texture2D(uTexture, rotatedUv);

        vec3 color = texel.rgb;

        #ifdef HAS_COLOR_CORRECTION
            color = czm_saturation(color, uSaturation);
            color = exposure(color, uExposure);
            color = mix(color, color * uTint, uTintOpacity);
        #endif

        gl_FragColor = vec4(color, texel.a * uOpacity);
        // Premultiplied alpha:
        // gl_FragColor = vec4(color * texel.a * uOpacity, 1.);

        // Debug :
        // gl_FragColor = vec4(vec3(uContrast), 1.);
        // gl_FragColor = vec4(uDirection * 10., 0., 0., 1.);
        // gl_FragColor = vec4(vUv.x, vUv.y, 0., 1.);
        // gl_FragColor = vec4(1., 0., 0., 1.);
    }  
<% } %>