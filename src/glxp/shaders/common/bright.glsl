precision highp float;

uniform sampler2D tMap;
uniform float u_threshold;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(tMap, vUv);
  vec4 bright = tex * step(u_threshold, length(tex.rgb) / 1.73205);
  
  gl_FragColor = bright;
}