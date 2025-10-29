<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    uniform float uTime;

    uniform float uHeight;
    uniform float uWidth;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    void main(){
        vUv = uv;
        vPosition = position;
        vec3 pos = position;
        pos.xz *= 1. + (-pos.y + 1.);
        pos.xz *= uWidth;
        pos.y *= uHeight;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

        vPositionW = vec3( modelViewMatrix * vec4( pos, 1.0 ) );
        vNormalW = normalize( vec3(modelViewMatrix * vec4( normal, 0.0 )) );

    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vPositionW;
    varying vec3 vNormalW;

    uniform float uTime;
    uniform vec2 uScale;
    uniform vec3 uColor;
    uniform vec3 uCamera;
    uniform float uFade;
    uniform float uOpacity;

    const float M_PI = 3.141592653589793;

    <%= commons.noise %>

    void main() { 

        vec3 pos = vPosition;
        pos.xz *= uScale.x;
        pos.y = 1./uScale.x;

        vec2 uv = vUv;
        uv.x *= uScale.x;
        float t = uTime;

        float noise = snoise(vec4(pos, t));
        // float noise = snoise(vec4(cos((uv.x) * 2. * M_PI), sin((uv.x) * 2. * M_PI), uv.y * .5, t));
        vec3 color = uColor;
        float alpha = noise;
        float fade = pow(sin(uv.y*M_PI), 1.+uFade);

        vec3 viewDirectionW = normalize(uCamera - vPositionW);
	    float fresnelTerm = dot(viewDirectionW, -vNormalW);
	    fresnelTerm = clamp(fresnelTerm, 0., 1.);

        alpha *= fresnelTerm;
        alpha *= fade;
        alpha *= uOpacity;

        gl_FragColor = vec4(color * alpha, alpha); 

    } 
        
<% } %>