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

<% if(locals.pass_1) { %>
    
    precision highp float;

    uniform sampler2D uTexture;
    varying vec2 vUv;

    uniform vec2 uRez;
    uniform vec2 uMouse;
    uniform float uTime;

    void main() {

        vec2 uv = vUv;
        vec4 color = texture2D( uTexture, uv);
        
        gl_FragColor = color;

    }
   
<% } %>

<% if (frag) { %>
    
    precision highp float;

    uniform sampler2D uTexture;
    varying vec2 vUv;

    uniform vec2 uRez;
    uniform vec2 uMouse;
    uniform float uTime;

    void main() {

        vec2 uv = vUv;
        vec4 color = texture2D( uTexture, uv);
        
        gl_FragColor = color;

    }
   
<% } %>