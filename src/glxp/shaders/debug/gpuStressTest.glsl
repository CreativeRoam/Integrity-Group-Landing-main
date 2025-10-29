<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    void main(){
      gl_Position = vec4(position, 1.0);
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    const int count = 10;
    void main(void) {
      for(int i=0; i<count; i++) {
        gl_FragColor = vec4(count / i, 0, 0, 1.0);
      }
    }
        
<% } %>