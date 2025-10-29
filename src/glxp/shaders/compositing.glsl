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

    #define PI 3.14159

    precision highp float;

    uniform sampler2D uTexture0;
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;

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

    const float borderSize = 0.2;
    const float borderSizeOffset = 0.05;
    const float dispBorderSize = 0.5;
    const vec4 discColor = vec4(1.0, 1.0, 1.0, 1.0);
    const vec2 discCenter = vec2(0.5, 0.5);

    <%= commons.allBlendModes %>
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

    vec3 multiplyWithSlope( vec3 a, vec3 b )
    {
        return vec3( a.xy * b.z + b.xy * a.z, a.z * b.z );
    }

    vec3 ripple( vec2 v, float p )
    {
        // time is a sawtooth wave from 0 to 1 every 2 seconds:
        float time = p;
        
        float radiusSqared = 2.0 * 2.0 * time;
        
        float lengthSquared = dot( v, v );
        if ( lengthSquared > radiusSqared ) return vec3(0.0);
        
        float frequency = 2.;
        float phase = (lengthSquared - radiusSqared) * frequency;
        vec3 result = vec3( cos( phase ) * frequency * v * 2.0, sin( phase ) );
        
        // fade out towards the rim:
        vec3 ratio = -vec3( v * 2.0, lengthSquared - radiusSqared ) / radiusSqared;
        ratio = multiplyWithSlope( ratio, ratio );
        result = multiplyWithSlope( result, ratio );
        
        return result * 0.2;
    }

    void main() {

        vec2 cUv = vUv - discCenter;
        cUv.y /= uRez.x/uRez.y;

        float dist = sqrt(dot(cUv, cUv));
        float p = ((uProgress + (uMaskProgress * 5.)) * (1. + borderSize)) * .1 - borderSize;
        float t = smoothstep(p+borderSize, p-borderSize, dist - borderSizeOffset);
        float t1 = smoothstep(p+(dispBorderSize * p), p-(dispBorderSize * p), dist);

        vec4 pass0Color;

        vec2 v = vUv;
        v -= vec2(0.5,0.5); // roughly centered
        v.x *= uRez.x/uRez.y;
        v *= 5.0 - (uMaskProgress * 5.0); // zoom out
        vec3 result = ripple( v, max(uProgress, 0.) );

        vec2 uv = vUv;
        vec2 uv1 = vUv;

        uv += vec2(result.x, result.z) * result.y;
        uv1 += vec2(result.x, result.z) * result.y * .2 * (1. - uMaskProgress);

        if(uActiveTexture == 0){
            pass0Color = texture2D(uTexture0, uv);
        } else if (uActiveTexture == 1) {
            pass0Color = texture2D(uTexture1, uv);
        } else if (uActiveTexture == 2) {
            pass0Color = texture2D(uTexture2, uv);
        }

        vec4 pass1Color;
        if(uPendingTexture == 0){
            pass1Color = texture2D(uTexture0, uv1);
        } else if (uPendingTexture == 1) {
            pass1Color = texture2D(uTexture1, uv1);
        } else if (uPendingTexture == 2) {
            pass1Color = texture2D(uTexture2, uv1);
        }

        vec3 color = mix(pass0Color.xyz, pass1Color.xyz, t * smoothstep(.05, .5, t));
        color = margins(color, vUv, .15 * uHapeWalk);
        

        gl_FragColor = vec4(color, 1.);

    }

<% } %>