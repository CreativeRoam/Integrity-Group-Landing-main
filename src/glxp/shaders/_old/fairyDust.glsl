

<% if (vert) { %>

    precision highp float;

    <%= commons.pnoise %>

    //
    // CUSTOM
    //
    #define M_PI 3.1415926535897932384626433832795

    attribute vec3 position;
    attribute vec4 seeds;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    uniform vec3  uColor;
    uniform vec3  uVolumeCorner;
    uniform vec3  uVolumeSize;
    uniform vec3  uOffset;
    uniform float uPixelRatio;
    uniform float uTime;
    uniform float uTimeScale;
    uniform float speed;
    uniform float uNoiseIntensity;
    uniform float uNoiseFrequency;
    uniform float uLimitsFadeDistance;
    uniform float uLimitsFadeIntensity;
    uniform float uParticleScale;
    uniform float uParticleOpacity;

    varying vec4  vColor;
    varying vec4  vSeeds;
    varying vec3  vWorldPosition;

    uniform float uSize;

    mat4 rotationMatrix(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        
        return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                    0.0,                                0.0,                                0.0,                                1.0);
    }

    vec3 rotate(vec3 v, vec3 axis, float angle) {
        mat4 m = rotationMatrix(axis, angle);
        return (m * vec4(v, 1.0)).xyz;
    }

    void main(void) {

        vSeeds = seeds;

        // Perlin
        vec3 newPosition  = position;
        vec3 displacement = vec3(
            pnoise(uNoiseFrequency * position + vec3(0., uTime * uTimeScale, 0.), vec3(101.0)) * uNoiseIntensity,
            pnoise(uNoiseFrequency * position + vec3(0., uTime * uTimeScale, 0.), vec3(202.0)) * uNoiseIntensity,
            pnoise(uNoiseFrequency * position + vec3(0., uTime * uTimeScale, 0.), vec3(303.0)) * uNoiseIntensity
        );
        newPosition += displacement;

        // Offset
        newPosition += uOffset;

        newPosition.x = mod(mod(newPosition.x, uVolumeSize.x) + uVolumeSize.y, uVolumeSize.x) + uVolumeCorner.x;
        newPosition.y = mod(mod(newPosition.y, uVolumeSize.y) + uVolumeSize.y, uVolumeSize.y) + uVolumeCorner.y;
        newPosition.z = mod(mod(newPosition.z, uVolumeSize.z) + uVolumeSize.z, uVolumeSize.z) + uVolumeCorner.z;

        // Fade when approaching to box limits
        float alphaFade = 1.0;
        vec3 distanceToLimits;
        float fadeDistance = uLimitsFadeDistance;
        if (fadeDistance > 0.) {
            distanceToLimits.y = min(clamp(abs(newPosition.y - uVolumeCorner.y),0.,fadeDistance),clamp(abs(newPosition.y - (uVolumeCorner.y + uVolumeSize.y)),0.,fadeDistance));
            distanceToLimits.x = min(clamp(abs(newPosition.x - uVolumeCorner.x),0.,fadeDistance),clamp(abs(newPosition.x - (uVolumeCorner.x + uVolumeSize.x)),0.,fadeDistance));
            distanceToLimits.z = min(clamp(abs(newPosition.z - uVolumeCorner.z),0.,fadeDistance),clamp(abs(newPosition.z - (uVolumeCorner.z + uVolumeSize.z)),0.,fadeDistance));
            alphaFade = smoothstep(0.0, fadeDistance, min(min(distanceToLimits.x, distanceToLimits.y), distanceToLimits.z));
            alphaFade *= uLimitsFadeIntensity;
        }


        vec4 viewSpace  = modelViewMatrix * vec4(newPosition, 1.0);
        float dist = length(viewSpace);
        vColor = vec4(uColor, alphaFade * uParticleOpacity);
        vWorldPosition = viewSpace.xyz;
        // vColor = vec4(uColor, 100.);

        gl_Position = projectionMatrix * viewSpace;
        gl_PointSize = uPixelRatio * uParticleScale;
        gl_PointSize = gl_PointSize / length(dist);

    }

<% } %>




<% if (frag) { %>

    precision highp float;

    varying vec4 vColor;
    varying vec4 vSeeds;
    varying vec3 vWorldPosition;

    uniform float uTime;
    uniform float uAlpha;
    uniform vec3 uColor1;

    uniform float uDiscRadius;
    uniform float uDiscRadius1;
    uniform float uBorderSize;
    uniform float uBorderSize1;

    #ifdef HAS_FOG
        uniform vec3 uFogColor;
        uniform float uFogNear;
        uniform float uFogFar;
    #endif

    void main() {
        vec2 uv = gl_PointCoord.xy;
        uv -= vec2(0.5);
        float dist = sqrt(dot(uv, uv));

        float dr = uDiscRadius * vSeeds.x;
        float t = smoothstep(dr+uBorderSize, dr-uBorderSize, dist);
        float t1 = smoothstep(uDiscRadius1 + uBorderSize1, uDiscRadius1 - uBorderSize1, dist);
        
        vec3 color = mix(vColor.xyz, uColor1, vSeeds.z);
        float a = vColor.a * (t+t1) * uAlpha;
        a *= .3 + ((sin(((uTime * 1.) + vSeeds.w) * 6.28) + 1.) * .5) * .7;
        a *= .6 + ((sin(((uTime * 2.) + vSeeds.z) * 6.28) + 1.) * .5) * .5;

        // fog
        #ifdef HAS_FOG
            // Change alpha and color based on fog distance
            float fogDistance = length(vWorldPosition);
            float fogAmount = smoothstep(uFogNear, uFogFar, fogDistance);
            fogAmount = clamp(fogAmount, 0., 1.);
            color = mix(color, uFogColor, fogAmount);
            a *= smoothstep(1., .97, fogAmount);
        #endif
        

        gl_FragColor = vec4(color, a);
    }

<% } %>