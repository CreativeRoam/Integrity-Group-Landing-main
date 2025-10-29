<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;

    varying vec2 vUv;


    void main(){
        vUv = uv;
        gl_Position = vec4(position, 1.0);
        gl_Position.z = 1.;
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uRez;
    uniform float uOpacity;
    uniform float uOffset;
    uniform mat4 modelViewMatrix;
    uniform float uSpacing;
    uniform vec3 uColor;

    const float M_PI = 3.141592653589793;
    const float border_size = 0.02;
    const float disc_radius = 0.01;

    vec2 rotate2d(vec2 v, float a){
        mat2 m = mat2(cos(a), -sin(a), sin(a),  cos(a));
        return m * v;
    }

    void main() { 

        float scale = uSpacing;
        vec2 uv = vUv;
        uv.x *= uRez.x/uRez.y;
        uv.y += uOffset;
        uv = mod(uv * scale, 1.);

        float b = 0.;
        vec2 px = (1./uRez) * 1.5;

        vec2 dUv = uv;// - vec2(0.5);
        float dist = sqrt(dot(dUv, dUv));
        float dr = disc_radius;
        float bs = border_size;
        float t = smoothstep(dr+bs, dr-bs, dist);

        b += (smoothstep(0., scale*px.x, uv.x) - smoothstep(scale*px.x, 2.*scale*px.x, uv.x)) * uOpacity;
        b += (smoothstep(0., scale*px.y, uv.y) - smoothstep(scale*px.y, 2.*scale*px.y, uv.y)) * uOpacity;
        uv = rotate2d(uv, M_PI*-.25);
        uv.y -= .7;
        b += (smoothstep(0., scale*px.y, uv.y) - smoothstep(scale*px.y, 2.*scale*px.y, uv.y)) * uOpacity;
        b += t * .5;

        float fade = smoothstep(.1, .5, vUv.y);
        gl_FragColor = vec4(uColor, b * fade); 
        // gl_FragColor = vec4(uv, 0., 1.); 
    } 
        
<% } %>