<% if (vert) { %>

   precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform vec2 uRez;

    varying vec2 vUv;

    // <%= commons.fxaa %>

    void main(void) {
        vUv = uv;
        
        // FXAA - Exemple
        // vec2 fragCoord = vUv * uRez;
        // texcoords(fragCoord, uRez, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

        gl_Position = vec4(position, 1.0);
    }

<% } %>

<% if (frag) { %>

    precision highp float;

    uniform sampler2D uTexture;
    uniform sampler2D uTextureSobelNormals;
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

    // Sobel
    uniform float uOutlineDepthThickness;
    uniform float uOutlineNormalsThickness;
    uniform vec3 uOutlineColor;
    uniform float uOutlineCutoff;
    uniform float uOutlineNormalsBias;

    <%= commons.allBlendModes %>
    <%= commons.colorCorrection %>
    // <%= commons.fxaa %>

    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    vec4 sobelSample (sampler2D tex, vec2 uv, vec3 offset) {
        vec4 pixelCenter = texture2D(tex, uv);
        vec4 pixelLeft = texture2D(tex, uv - offset.xz);
        vec4 pixelRight = texture2D(tex, uv + offset.xz);
        vec4 pixelUp = texture2D(tex, uv + offset.zy);
        vec4 pixelDown = texture2D(tex, uv - offset.zy);

        return abs(pixelLeft - pixelCenter) + abs(pixelRight - pixelCenter) + abs(pixelUp - pixelCenter) + abs(pixelDown - pixelCenter);
    }

    vec4 sampleDepthTexture (sampler2D tex, vec2 uv, float near, float far) { 
        vec4 depth = texture2D(tex, uv);
        depth = (2.0 * near) / (far + near - depth * (far - near));

        return depth;
    }

    vec4 sobelSampleDepth (sampler2D tex, vec2 uv, vec3 offset, float near, float far) {
        vec4 pixelCenter = sampleDepthTexture(tex, uv, near, far);
        vec4 pixelLeft = sampleDepthTexture(tex, uv - offset.xz, near, far);
        vec4 pixelRight = sampleDepthTexture(tex, uv + offset.xz, near, far);
        vec4 pixelUp = sampleDepthTexture(tex, uv + offset.zy, near, far);
        vec4 pixelDown = sampleDepthTexture(tex, uv - offset.zy, near, far);

        return abs(pixelLeft - pixelCenter) + abs(pixelRight - pixelCenter) + abs(pixelUp - pixelCenter) + abs(pixelDown - pixelCenter);
    }

    void main() {

        vec2 uv = vUv;
        vec4 color;

        // Unpack Depth 
        float n = 0.01;
        float f = 1000.0; // Needs to be the far value of the camera
        float z = texture2D(uDepth, vUv).x;
        float depth = (2.0 * n) / (f + n - z*(f-n));

        // FXAA - Exemple
        // Be careful, chromatic aberration and other texture based effects will need to use fxaa
        // vec2 fragCoord = vUv * uRez; 
        // color = fxaa(uTexture, fragCoord, uRez, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

        // Chromatic Aberration
        float maxDistort = uChromaticAberations * .1;
        float scalar = 1.0 * maxDistort;
        vec4 colourScalar = vec4(700.0, 560.0, 490.0, 1.0);	// Based on the true wavelengths of red, green, blue light.
        colourScalar /= max(max(colourScalar.x, colourScalar.y), colourScalar.z);
        colourScalar /= 100.;
        colourScalar *= scalar;

        color.r += texture2D(uTexture, uv + colourScalar.r).r;
        color.g += texture2D(uTexture, uv + -colourScalar.g).g;
        color.b += texture2D(uTexture, uv + colourScalar.b).b;

        // Sobel
        vec3 offsetDepth = vec3(uOutlineDepthThickness, uOutlineDepthThickness, 0.0);
        vec3 offsetNormals = vec3(uOutlineNormalsThickness, uOutlineNormalsThickness, 0.0);

        // Only use Normals or Depth for better perfs
        // Sobel - Depth
        vec4 sobelDepth = sobelSampleDepth(uDepth, uv, offsetDepth, n, f);

        // Sobel - Normals
        vec4 sobelNormals = sobelSample(uTextureSobelNormals, uv, offsetNormals);
        sobelNormals = pow(sobelNormals, vec4(uOutlineNormalsBias));

        // Sobel - Combining
        // vec4 sobelCombined = sobelDepth;
        // vec4 sobelCombined = sobelNormals;
        vec4 sobelCombined = clamp(max(sobelNormals, sobelDepth), vec4(0.0), vec4(1.0));        
        float sobelOutlines = step(uOutlineCutoff, sobelCombined.r + sobelCombined.g + sobelCombined.b);

        color.rgb = mix(color.rgb, uOutlineColor, sobelOutlines);

        // Bloom
        if (uBloomEnabled) {
            vec4 bloom = texture2D(uBloom, uv);
            color.rgb = blendScreen_21_19(color.rgb, bloom.rgb, uBloomOpacity);
        }

        // Vignette
        vec2 vgnUv = vUv;
        vgnUv *= (1.0 - vgnUv.yx);
        float vig = vgnUv.x * vgnUv.y * 15.0;
        vig = pow(vig, uVignette);

        // Color Correction
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
        // color.rgb = vec3(sobelDepth.rgb);

        gl_FragColor = color;
    }

<% } %>