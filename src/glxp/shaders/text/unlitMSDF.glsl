<% if (vert) { %>
    needES300
    precision highp float; 

    in vec3 position;
    in vec2 uv;
    in float charsId;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;

    out vec2 vUv;
    out vec4 vPos;

    void main(){
        vUv = uv;
        charsId;
        vPos = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

<% } %>



<% if (frag) { %>
    // needES300
    precision highp float; 

    in vec2 vUv;
    in vec4 vPos;

    uniform bool isCameraFliped;

    uniform sampler2D tMap;
    uniform vec3 uColor;
    uniform float uAlpha;

    out vec4 outColor;

    void main() { 
        if(isCameraFliped && vPos.y < 0.01){ discard; }

        vec3 tex = texture(tMap, vUv).rgb;

        float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
        float d = fwidth(signedDist);
        float alpha = smoothstep(-d, d, signedDist);

        if (alpha < 0.01) discard;

        #ifdef IS_WEBGL_1
            gl_FragColor.rgb = uColor;
            gl_FragColor.a = alpha * uAlpha;
        #else
            outColor.rgb = uColor;
            outColor.a = alpha * uAlpha;
        #endif

    } 
        
<% } %>