<% if (vert) { %>

   precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;

    void main(void) {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }

<% } %>



<% if (frag) { %>

    precision highp float;

    uniform sampler2D uTexture0;
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;

    uniform sampler2D uBloom0;
    uniform sampler2D uBloom1;
    uniform sampler2D uBloom2;
    varying vec2 vUv;

    uniform vec2 uRez;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uProgress;
    uniform float uMaskProgress;

    uniform float uVignette;
    uniform float uContrast;
    uniform float uGamma;
    uniform float uExposure;
    uniform float uVignetteStrength;
    uniform float uNoiseOpacity;
    uniform float uHapeWalk;

    uniform int uActiveTexture;
    uniform int uPendingTexture;

    uniform float uBloomOpacityBlack;
    uniform float uBloomOpacityWhite;
    uniform float uBloomOpacityRed;
    uniform int uMixingBloomBlack;
    uniform int uMixingBloomWhite;
    uniform int uMixingBloomRed;

    const float borderSize = 0.005;
    const float borderSizeOffset = 0.05;
    const float dispBorderSize = 0.5;
    const vec4 discColor = vec4(1.0, 1.0, 1.0, 1.0);
    const vec2 discCenter = vec2(0.5, 0.5);

    <%= commons.allBlendModes %>
    <%= commons.noise %>
    <%= commons.colorCorrection %>

    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    vec3 margins(vec3 color, vec2 uv, float marginSize)
    {
        if(uv.y < marginSize || uv.y > 1.0-marginSize)
        {
            return vec3(0.0);
        }else{
            return color;
        }
    }

    void main() {

        float noise = snoise(vec4(vUv * 8., 0., uTime));
        vec2 cUv = vUv - discCenter;
        cUv.y /= uRez.x/uRez.y;

        cUv += (noise * (1. - uMaskProgress) * .1);
        float dist = sqrt(dot(cUv, cUv));

        // float p = ( smoothstep(.5, ) * 1.2) - .2;
        float p = (uMaskProgress*1.2) - .2;
        // float p = (((clamp(0., 1., uProgress) / (uRez.x/uRez.y)) - borderSize) * (1. + (borderSize * 2.))) * .5;
        float t = smoothstep(p+borderSize, p-borderSize, dist - borderSizeOffset);
        float t1 = smoothstep(p+(dispBorderSize * p), p-(dispBorderSize * p), dist);

        vec4 pass0Color;
        vec3 pass0Bloom;
        vec4 pass0;

        vec2 source_uv = vUv;
        vec2 distortion_center = vec2(0.5,0.5);
        float distortion_x,distortion_y,rr,r2,theta;
        vec2 dest_uv;
        //K1 < 0 is pincushion distortion
        //K1 >=0 is barrel distortion
        float distortion_k2 = 0.5;
        float distortion_k1 = (uProgress * -1.75) - 0.33;
        rr = sqrt((source_uv.x - distortion_center.x)*(source_uv.x - distortion_center.x) + (source_uv.y - distortion_center.y)*(source_uv.y - distortion_center.y));
        r2 = rr * (1.0 + distortion_k1*(rr*rr) + distortion_k2*(rr*rr*rr*rr));
        theta = atan(source_uv.x - distortion_center.x, source_uv.y - distortion_center.y);
        distortion_x = sin(theta) * r2 * 1.0; //1.0 is  scale factor
        distortion_y = cos(theta) * r2 * 1.0; //1.0 is  scale factor
        dest_uv.x = distortion_x + 0.5;
        dest_uv.y = distortion_y + 0.5;

        vec2 uv = vUv; // dest_uv ;

        distortion_k1 = ((1. - uProgress) * -1.75) - 0.33;
        rr = sqrt((source_uv.x - distortion_center.x)*(source_uv.x - distortion_center.x) + (source_uv.y - distortion_center.y)*(source_uv.y - distortion_center.y));
        r2 = rr * (1.0 + distortion_k1*(rr*rr) + distortion_k2*(rr*rr*rr*rr));
        theta = atan(source_uv.x - distortion_center.x, source_uv.y - distortion_center.y);
        distortion_x = sin(theta) * r2 * 1.0; //1.0 is  scale factor
        distortion_y = cos(theta) * r2 * 1.0; //1.0 is  scale factor
        dest_uv.x = distortion_x + 0.5;
        dest_uv.y = distortion_y + 0.5;

        vec2 uv1 = ((dest_uv - .5) / (pow(t1, 5.))) + .5;
        uv1 += (noise * (1. - uMaskProgress) * .1);
        // uv = uv1;

        if(uActiveTexture == 0){
            pass0Color = texture2D(uTexture0, uv);
            pass0Bloom = texture2D(uBloom0, uv).rgb;
            pass0 = vec4(blendMode_1_25(uMixingBloomWhite, pass0Color.rgb, pass0Bloom, uBloomOpacityWhite), pass0Color.a);
        } else if (uActiveTexture == 1) {
            pass0Color = texture2D(uTexture1, uv);
            pass0Bloom = texture2D(uBloom1, uv).rgb;
            pass0 = vec4(blendMode_1_25(uMixingBloomRed, pass0Color.rgb, pass0Bloom, uBloomOpacityRed), pass0Color.a);
        } else if (uActiveTexture == 2) {
            pass0Color = texture2D(uTexture2, uv);
            pass0Bloom = texture2D(uBloom2, uv).rgb;
            pass0 = vec4(blendMode_1_25(uMixingBloomBlack, pass0Color.rgb, pass0Bloom, uBloomOpacityBlack), pass0Color.a);
        }


        vec4 pass1Color;
        vec3 pass1Bloom;
        vec4 pass1;

        if(uPendingTexture == 0){
            pass1Color = texture2D(uTexture0, uv1);
            pass1 = texture2D(uTexture0, uv1);
        } else if (uPendingTexture == 1) {
            pass1Color = texture2D(uTexture1, uv1);
            pass1 = texture2D(uTexture1, uv1);
        } else if (uPendingTexture == 2) {
            pass1Color = texture2D(uTexture2, uv1);
            pass1 = texture2D(uTexture2, uv1);
        }

        // vec3 color = mix(pass0.xyz, pass1.xyz, t);
        vec3 color = mix(pass0.xyz, pass1.xyz, t * smoothstep(.05, .5, uMaskProgress));
        // color -= (1.-t)*.5;

        vec2 vgnUv = vUv;
        vgnUv *= (1.0 - vgnUv.yx);
        float vig = vgnUv.x*vgnUv.y * 15.0;
        vig = pow(vig, uVignette);

        color = blendOverlay_9_12(color, vec3(random(vUv + mod(uTime, 1.))), uNoiseOpacity);
        color = linearToneMapping(color, uGamma);
        color = contrast(color, uContrast);
        color = exposure(color, uExposure);
        color = mix(color, color * vig, uVignetteStrength);
        color = margins(color, vUv, .15 * uHapeWalk);
        

        gl_FragColor = vec4(color, 1.);
        // gl_FragColor = vec4(vec3(t), 1.);

        // gl_FragColor = vec4(texture2D(uBloom1, vUv));

    }

<% } %>