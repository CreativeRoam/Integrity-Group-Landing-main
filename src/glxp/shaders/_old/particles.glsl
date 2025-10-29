<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 seeds;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;
    uniform float uPixelRatio;
    uniform float uParticleScale;

    varying float vAlpha;

    vec2 rotate2d(vec2 v, float a){
        mat2 m = mat2(cos(a), -sin(a), sin(a),  cos(a));
        return m * v;
    }

    void main(){

        vec3 pos = position;
        float t = uTime * -(.1 + pow(1. - (length(pos.xy) * .05), 3.)) * .15;
        pos.xy = rotate2d(pos.xy, t);

        vec4 viewSpace  = modelViewMatrix * vec4(pos, 1.0);
        float dist = length(viewSpace);

        vAlpha = smoothstep(0.1, .3, (length(pos.xy) * .05));

        gl_Position = projectionMatrix * viewSpace;
        gl_PointSize = uPixelRatio * (uParticleScale * (1. + pow(seeds.x * 2., 2.5)));
        gl_PointSize = gl_PointSize / length(dist);

    }

<% } %>



<% if (frag) { %>

    precision highp float; 
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uColor;

    varying float vAlpha;

    const float border_size = 0.01;
    const float disc_radius = 0.5;

    void main() { 
        vec2 uv = gl_PointCoord.xy;
        uv -= vec2(0.5);
        float dist = sqrt(dot(uv, uv));

        float dr = disc_radius;
        float t = smoothstep(dr+border_size, dr-border_size, dist);

        vec3 color = uColor;

        gl_FragColor = vec4(color, t * uOpacity * vAlpha); 
    } 
        
<% } %>