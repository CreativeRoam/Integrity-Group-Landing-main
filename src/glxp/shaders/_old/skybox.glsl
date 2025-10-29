<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;
    varying vec4 vPosition;


    void main(){
        vUv = uv;
        gl_Position = vec4(position, 1.0);
        vPosition = vec4(position, 1.0);
        gl_Position.z = 1.;
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec4 vPosition;

    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uYpow;
    uniform mat4 uViewDirProjInverse;
    
    const vec2 invAtan = vec2(0.1591, 0.3183);
    vec2 SampleSphericalMap(vec3 direction)
    {
        vec2 uv = vec2(atan(direction.z, direction.x), asin(direction.y));
        uv *= invAtan;
        uv += 0.5;
        uv.y = 1. - uv.y;
        return uv;
    }

    void main() { 

        vec4 d = uViewDirProjInverse * vPosition;
        vec3 dir = normalize(d.xyz / d.w);
        vec4 t = texture2D( uTexture, SampleSphericalMap(dir) );

        gl_FragColor = vec4(t); 
    } 
        
<% } %>