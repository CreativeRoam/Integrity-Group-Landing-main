<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    
    uniform float uTime;

    varying vec2 vUv;
    varying vec4 vPos;

    void main(){
        vUv = uv;
        vPos = modelMatrix * vec4(position, 1.0);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec4 vPos;

    uniform float uTime;
    uniform float uAlpha;
    uniform vec2 uRez;

    uniform bool isCameraFliped;

    uniform sampler2D uTexture;
    uniform float uTextureScale;


    void main() { 
        if(isCameraFliped && vPos.y < 0.01){ discard; }

        vec4 t = texture2D( uTexture, vUv * uTextureScale );

        t.a *= uAlpha;
        gl_FragColor = vec4(t);
    } 
        
<% } %>
