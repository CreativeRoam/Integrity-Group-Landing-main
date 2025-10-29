<% if (vert) { %>
    needES300
    precision highp float; 

    in vec3 position;
    in vec3 center;
    in vec2 uv;
    in float charsId;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    uniform float uProgress;
    uniform float uMaxIds;
    uniform vec2 uAnimationDirrection;

    out vec2 vUv;
    out vec4 vPos;
    out float vAlpha;

    const float stagger = .15;

    <%= commons.easing %>

    void main(){
        vUv = uv;
        // vId = charsId;
        vec3 pos = position;

        float inProgress = smoothstep(-1., 0., (1. - uProgress) - 1.);
        float outProgress = smoothstep(1., 0., (1. - uProgress) - 1.);
        float cp = charsId/uMaxIds;
        float lpi = smoothstep(0. + (cp * stagger), 1. + (cp * stagger), (1. - inProgress) * (1. + stagger));
        float lpo = smoothstep(0. - (cp * stagger), 1. - (cp * stagger), (1. - outProgress) * (1. + stagger) - stagger);
        pos = mix(pos, center, quarticOut(lpo));
        pos.yz -= uAnimationDirrection * .5 * quarticIn(lpi);
        pos.yz += uAnimationDirrection * quarticOut(lpo);
        vAlpha = (1. - quarticInOut(lpi)) * (1. - quarticOut(lpo));

        vPos = modelMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }

<% } %>



<% if (frag) { %>
    // needES300
    precision highp float; 

    in vec2 vUv;
    in vec4 vPos;
    in float vAlpha;

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
            gl_FragColor.a = alpha * uAlpha * vAlpha;
        #else
            outColor.rgb = uColor;
            outColor.a = alpha * uAlpha * vAlpha;
        #endif

    } 
        
<% } %>