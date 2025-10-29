<% if (vert) { %>
    precision highp float;

      attribute vec2 uv;
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
<% } %>



<% if (frag) { %>
    precision highp float;
    uniform vec3 uColor;
    uniform float uAlpha;

    void main() {
        gl_FragColor = vec4(uColor, uAlpha);
    }
<% } %>