<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;

    void main(){
        vUv = uv;
        vec3 pos = position;
        pos.z -= .03;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uAlpha;

    vec2 rotate(vec2 v, float a) {
        float s = sin(a);
        float c = cos(a);
        mat2 m = mat2(c, -s, s, c);
        return m * v;
    }

    float blendScreen(float base, float blend) {
        return 1.0-((1.0-base)*(1.0-blend));
    }

    vec3 blendScreen(vec3 base, vec3 blend) {
        return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
    }

    vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
        return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
    }
    
    const float border_size = 0.1;
    const float disc_radius = 0.2;

    void main() {   

        vec2 uv = vUv;
        uv -= vec2(0.5);
        float dist = sqrt(dot(uv, uv));
        float t = smoothstep(disc_radius+border_size, disc_radius-border_size, dist);

        vec4 color = vec4(0., 0., 0., t);

        vec2 rUv0 = rotate(vUv - .5, -uTime * .75) + .5;
        vec2 uv0 = vec2(rUv0.x * .5, rUv0.y);
        color.rgb += texture2D( uTexture, uv0 ).rgb * (.5 + (sin((uTime + 4.096875) * 1.) + .1) * .5 * .3);

        vec2 rUv1 = rotate(vUv - .5, uTime * .55) + .5;
        vec2 uv1 = vec2(rUv1.x * .5, rUv1.y);
        color.rgb += texture2D( uTexture, uv1 ).rgb * (.5 + (cos((uTime + 2.9857443) * -2.) + .1) * .5 * .1);

        vec2 rUv2 = rotate(vUv - .5, -uTime * .75);
        rUv2 /= 2.;
        rUv2 += .5;
        vec2 uv2 = vec2(rUv2.x * .5 + .5, rUv2.y);
        color.rgb += texture2D( uTexture, uv2 ).rgb *  texture2D( uTexture, uv2 ).a * .5;

        gl_FragColor = vec4(color.rgb * t * .66, color.a * uAlpha); 
    } 
        
<% } %>