<% if (vert) { %>
    precision highp float;
    attribute vec3 aPos;
    attribute vec2 aUvs;
    varying vec2 vUv;
    void main(void) {
        vUv = aUvs;
        gl_Position = vec4(aPos, 1.0);
    }
<% } %>


<% if (passes.pass_1) { %>
    precision highp float;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    uniform vec2 uRez;
    uniform vec2 uDir;
    uniform vec3 uTint;
    uniform float uPower;
    uniform float uIsFirstPass;
    uniform float uThresold;
    uniform float uSimilarity;
    uniform float uDebug;
    uniform float uOverdrive;

    <%= commons.blur %>
    void main() {
        vec4 color = blur5(uTexture, vUv, uRez, uDir * uPower);
        gl_FragColor = vec4(color.rgb * color.a, color.a);
        if(uIsFirstPass > 0.5){
            float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
            float highlights = smoothstep(uThresold, uThresold+uSimilarity, brightness);
            gl_FragColor = vec4((color.rgb * (1. + uOverdrive)) * vec3(highlights) * uTint, 1.);
        }
    }
<% } %>


<% if (frag) { %>
    precision highp float;
    uniform sampler2D uBlur;
    varying vec2 vUv;
    uniform vec2 uRez;

 <%if (defines["COLOR_CORRECTION"] >= 1) { %>
    uniform float uShift;
    uniform float uBrightness;
    uniform float uContrast;

    <%= commons.colorCorrection %>
<% } %>

    void main() {
        
        vec4 blur = texture2D( uBlur, vUv);
        gl_FragColor = blur;

        <%if (defines["TRANSPARENT"] >= 1) { %>
            // if transparent
            float a = smoothstep(1., 0.2, blur.z);
            a = pow(a, 2.);
            blur.z = 0.;
            gl_FragColor = vec4(blur.rgb, a);
        <% } %>

        <%if (defines["COLOR_CORRECTION"] >= 1) { %>
            vec3 color = hueShift(gl_FragColor.rgb, uShift);
            vec3 colorContrasted = (color) * uContrast;
            vec3 bright = colorContrasted + vec3(uBrightness);
            gl_FragColor.rgb = bright;
        <% } %>


    }
<% } %>