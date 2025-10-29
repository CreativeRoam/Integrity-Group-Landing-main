< % if(vert) { % >

  precision highp float;

  attribute vec3 position;
  attribute vec3 normal;
  attribute vec3 centroids;
  attribute vec3 seeds;
  attribute vec2 uv;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat4 modelMatrix;
  uniform float uTime;
  uniform float uProgress;

  varying vec2 vUv;
  varying vec4 vPos;
  varying vec3 vWorldPosition;

  #ifdef HAS_SHEEN
    varying vec3 vNormal;
  #endif

  const float M_PI = 3.141592653589793;

  void main() {
    vUv = uv;

    float p = uProgress;
    vec3 pos = position;
    pos -= centroids;

    pos = rotate(pos, M_PI * 4. * (seeds - .5), p);
    pos += centroids * ((p) * 2. + 1.);

    vPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;

    #ifdef HAS_SHEEN
      vec3 n = normal;
      vNormal = normalize(vec3(modelMatrix * vec4(n, 0.0)));
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }

< % } % >

< % if(frag) { % >

precision highp float;

varying vec2 vUv;
varying vec4 vPos;
varying vec3 vWorldPosition;
#ifdef HAS_SHEEN
  varying vec3 vNormal;
#endif

uniform float uTime;
uniform float uAlpha;
uniform float uTintOpacity;
uniform float uExposure;
uniform float uContrast;
uniform float uSaturation;
uniform vec3 uTint;

uniform bool isCameraFliped;

#ifdef HAS_BASECOLORMAP
  uniform sampler2D uTexture;
#else 
  uniform vec3 uColor;
#endif

#ifdef HAS_ALPHAMAP
  uniform sampler2D uAlphaMapSampler;
#endif

#ifdef HAS_FOG
  const float LOG2 = 1.442695;
  uniform vec3 uFogColor;
  // uniform float uFogDensity;
  uniform float uFogNear;
  uniform float uFogFar;
#endif

#ifdef HAS_SHEEN
  uniform float uSheenDepth;
  uniform float uSheenOpacity;
  uniform vec3 uSheenColor;
  uniform vec3 uCamera;
#endif

<%= commons.colorCorrection %>

#ifdef HAS_SHEEN
  vec3 getNormal() {
    return normalize(vNormal);
  }
#endif

void main() {
  if(isCameraFliped && vPos.y < 0.01) {
    discard;
  }

  vec4 t;
  #ifdef HAS_BASECOLORMAP
    t = texture2D(uTexture, vUv); 
  #else 
    t = vec4(uColor, 1.);
  #endif

  #ifdef HAS_ALPHAMAP
    t.a *= texture2D(uAlphaMapSampler, vUv).r * max(uExposure, 1.);
  #endif

  #ifdef HAS_FOG
    float fogDistance = length(vWorldPosition);
    // float fogAmount = 1. - exp2(-uFogDensity * uFogDensity * fogDistance * fogDistance * LOG2);
    float fogAmount = smoothstep(uFogNear, uFogFar, fogDistance);
    fogAmount = clamp(fogAmount, 0., 1.);
    t.rgb = mix(t.rgb, uFogColor, fogAmount);
  #endif

  #ifdef HAS_SHEEN
    vec3 n = getNormal();
    vec3 v = normalize(uCamera - vPos.xyz);
    float fresnelFactor = abs(dot(v, n));
    float sheen = pow(1.0 - fresnelFactor, uSheenDepth);
    t.rgb = mix(t.rgb, uSheenColor, sheen * uSheenOpacity);
  #endif

  // Color correction
  t.rgb = czm_saturation(t.rgb, uSaturation);
  t.rgb = contrast(t.rgb, uContrast);
  t.rgb = exposure(t.rgb, uExposure);
  t.rgb = mix(t.rgb, uTint, uTintOpacity);

  // t = vec4(vUv, 0., 1.);

  t.a *= uAlpha;
  gl_FragColor = vec4(t);
}

< % } % >
