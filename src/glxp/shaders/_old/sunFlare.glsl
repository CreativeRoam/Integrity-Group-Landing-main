<% if (vert) { %>

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;

attribute vec3 position;
attribute vec2 uv;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vUv = uv;
  
  vec3 pos = position;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

<% } %>



<% if (frag) { %>

precision highp float; 

uniform sampler2D tNoise;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uPos;
uniform float uStep;
uniform float uTime;
uniform float uSpeed;
uniform float uDarken;
varying vec2 vUv;

float noise(float t) {
	return texture2D(tNoise,vec2(t, 0.0)).x;
}
float noise(vec2 t) {
	return texture2D(tNoise,(t + vec2(uTime))).x;
}


vec3 lensflare(vec2 uv,vec2 pos) {
	vec2 main = uv-pos;
	vec2 uvd = uv*(length(uv));
	
	float ang = atan(main.y, main.x);
	float dist=length(main); dist = pow(dist,.1);
	float n = noise(vec2((ang-uTime/9.0)*16.0,dist*32.0));
	
	float f0 = 1.0/(length(uv-pos)*16.0+1.0);
	
	f0 = f0+f0*(sin((ang+(uTime*uSpeed)/18.0)*uStep)*.1+dist*.1+.8);

	vec3 c = vec3(.0);
	
	//c.r+=f2; c.g+=f22; c.b+=f23;
	c+=vec3(f0);
	
	return c;
}


void main() {   
  vec2 nUv = vUv - 0.5;
  // nUv.y = abs(nUv.y - 1.);

  // vec2 rayPos = vec2(u_positionX, u_positionY);
  // vec2 rayRef = normalize(vec2(u_referenceX, u_referenceY));
  // float raySeedA = u_step;
  // float raySeedB = u_step2;
  // float raySpeed = u_speed * u_time;
  // vec3 rays = u_color * rayStrength(rayPos, rayRef, nUv, raySeedA, raySeedB, raySpeed);

  // vec3 color = rays;

  // float brightness = max(0., vUv.y - u_spreadY) * smoothstep(0., u_spreadX, vUv.x) * smoothstep(1., 1. - u_spreadX, vUv.x);
  // color *= brightness * u_alpha;

  // float a = 1.;

  // gl_FragColor = vec4(color, a);
  vec3 color = uAlpha * uColor * lensflare(nUv, vec2(uPos)) *
               smoothstep(0., uDarken, vUv.x) *
               smoothstep(1., 1. - uDarken, vUv.x) *
               smoothstep(0., uDarken, vUv.y) *
               smoothstep(1., 1. - uDarken, vUv.y);
  gl_FragColor = vec4(color, 1.);
}
<% } %>