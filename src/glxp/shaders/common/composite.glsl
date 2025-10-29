precision highp float;

uniform sampler2D tMap;
uniform sampler2D t_bloom;
uniform vec2 u_resolution;
uniform float u_bloomStrength;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tMap, vUv) + texture2D(t_bloom, vUv) * u_bloomStrength;
  // color.a = color.r; 
  gl_FragColor = color;
}