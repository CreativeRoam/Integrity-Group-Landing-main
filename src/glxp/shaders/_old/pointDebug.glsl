<% if (vert) { %>

   precision highp float;

    attribute vec3 aPos;

    uniform mat4 uPMatrix;
    uniform mat4 uMMatrix;
    uniform mat4 uVMatrix;

    uniform float uSize;

    void main(void) {
        gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPos, 1.0);
        gl_PointSize = uSize;
    }

<% } %>



<% if (frag) { %>

    precision highp float;

    uniform vec3 uColor;
    
    const float border_size = 0.01;
    const float disc_radius = 0.5;

    void main() {
        vec2 uv = gl_PointCoord.xy;
        uv -= vec2(0.5);
        float dist = sqrt(dot(uv, uv));
        float t = smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
        gl_FragColor = vec4(uColor * (1.1 -dist), t);
    }

<% } %>