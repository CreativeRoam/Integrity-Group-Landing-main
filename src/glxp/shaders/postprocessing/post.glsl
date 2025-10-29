<% if (vert) { %>

   precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform vec2 uRez;
    uniform bool uFxaa;

    varying vec2 vUv;

    <%= commons.fxaa %>

    void main(void) {
        vUv = uv;

        vec2 fragCoord = vUv * uRez;
        texcoords(fragCoord, uRez, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

        gl_Position = vec4(position, 1.0);
    }

<% } %>

<% if (frag) { %>

    precision highp float;

    uniform sampler2D uTexture;
    uniform sampler2D uDepth;
    uniform sampler2D uBloom;
    uniform sampler2D uNoise;
    varying vec2 vUv;

    uniform vec2 uRez;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uHueShift;
    uniform float uVignette;
    uniform float uNoiseOpacity;
    uniform float uChromaticAberations;
    uniform float uGamma;
    uniform float uExposure;
    uniform float uBloomOpacity;
    uniform float uContrast;
    uniform float uKonami;
    uniform vec3 uVignetteColor;
    uniform float uVignetteStrength;
    uniform bool uBloomEnabled;
    uniform bool uShowDepth;
    uniform bool uFxaa;

    <%= commons.allBlendModes %>
    <%= commons.colorCorrection %>
    <%= commons.fxaa %>

    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {

        vec2 uv = vUv;
        vec4 color;

        // Unpack Depth 
        float n = 1.0;
        float f = 1000.0; // Needs to be the far value of the camnera
        float z = texture2D(uDepth, vUv).x;
        float depth = (2.0 * n) / (f + n - z*(f-n));

        // FXAA - Exemple
        // Be careful, chromatic aberration and other texture based effects will need to use fxaa

        // Chromatic Aberration
        float maxDistort = uChromaticAberations * .1;
        float scalar = 1.0 * maxDistort;
        vec4 colourScalar = vec4(700.0, 560.0, 490.0, 1.0);	// Based on the true wavelengths of red, green, blue light.
        colourScalar /= max(max(colourScalar.x, colourScalar.y), colourScalar.z);
        colourScalar /= 100.;
        colourScalar *= scalar;

        // Straight colors
        if (uFxaa) {
            vec2 fragCoord = vUv * uRez; 
            color = fxaa(uTexture, fragCoord, uRez, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
        } else {
            color.r += texture2D(uTexture, uv + colourScalar.r).r;
            color.g += texture2D(uTexture, uv + -colourScalar.g).g;
            color.b += texture2D(uTexture, uv + colourScalar.b).b;
        }

        // Bloom
        if(uBloomEnabled){
            vec4 bloom = texture2D(uBloom, uv);
            color.rgb = blendScreen_21_19(color.rgb, bloom.rgb, uBloomOpacity);
        }

        // Vignette
        vec2 vgnUv = vUv;
        vgnUv *= (1.0 - vgnUv.yx);
        float vig = vgnUv.x * vgnUv.y * 15.0;
        vig = pow(vig, uVignette);

        // Useless?
        // vec2 nUv = vUv;
        // nUv.x *= uRez.x/uRez.y;
        // nUv.y += mod(uTime * 46.54687, 1.);
        // nUv.x -= mod(uTime * 12.68655, 1.);

        // Color Corection
        color.rgb = blendOverlay_9_12(color.rgb, vec3(random(vUv + mod(uTime, 1.))), uNoiseOpacity);
        color.rgb = linearToneMapping(color.rgb, uGamma);
        color.rgb = contrast(color.rgb, uContrast);
        color.rgb = exposure(color.rgb, uExposure);

        // Composition
        // Composition - Vignette
        color.rgb = mix(color.rgb, mix(uVignetteColor, color.rgb * vig, vig), uVignetteStrength);

        // Composition - Alpha
        color.a = 1.;

        
        // Debug
        if(uShowDepth){
            color = vec4(depth, depth, depth, 1.0);
        }
        // color = vec4(vec3(dith), 1.);

        gl_FragColor = color;
    }

<% } %>