<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;
    varying vec4 vPosition;


    void main(){
        vUv = uv;
        gl_Position = vec4(position, 1.0);
        vPosition = vec4(position, 1.0);
        gl_Position.z = 1.;
    }

<% } %>



<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec4 vPosition;

    uniform float uTime;
    uniform float uAlpha;
    uniform vec2 uRez;

    uniform sampler2D uTextureNoise;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform vec3 uColorBackground;
    uniform float uProgress;

    #define S(a,b,t) smoothstep(a,b,t)

    mat2 Rot(float a)
    {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    // Created by inigo quilez - iq/2014
    // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    vec2 hash( vec2 p )
    {
        p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
        return fract(sin(p)*43758.5453);
    }

    float noise( in vec2 p )
    {
        vec2 i = floor( p );
        vec2 f = fract( p );
        
        vec2 u = f*f*(3.0-2.0*f);

        float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                            dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                            dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
        return 0.5 + 0.5*n;
    }

    vec3 lensflare(vec2 uv,vec2 pos)
    {
        vec2 main = uv-pos;
        vec2 uvd = uv*(length(uv));
        
        float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.55;
        float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.53;
        float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.51;
        
        vec3 c = vec3(f2, f22, f23); 
        return c;
    }

    vec3 cc(vec3 color, float factor,float factor2) 
    {
        float w = color.x+color.y+color.z;
        return mix(color,vec3(w)*factor,w*factor2);
    }


    void main() { 

        vec2 uv = vUv;
        float ratio = uRez.x / uRez.y;
        
        vec2 tuv = uv;
        tuv -= .5;

        if (ratio < 1.) {
            tuv.x /= 2./ratio;
        }

        // rotate with Noise
        float degree = noise(vec2(uTime*.1, tuv.x*tuv.y));
        tuv.y *= 1./ratio;
        tuv *= Rot(radians((degree-.5)*720.+180.));
        tuv.y *= ratio;

        // Wave warp with sin
        float frequency = 5.;
        float amplitude = 30.;
        float speed = uTime * 2.;
        tuv.x += sin(tuv.y*frequency+speed)/amplitude;
        tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);

        // draw the image
        vec3 layer1 = mix(uColor1, uColor2, S(-.3, .2, (tuv*Rot(radians(-5.))).x));
        vec3 layer2 = mix(uColor3, uColor4, S(-.3, .2, (tuv*Rot(radians(-5.))).x));
        
        // Composition
        vec3 finalComp = mix(layer1, layer2, S(.5, -.3, tuv.y));
        finalComp = mix(uColorBackground, finalComp, uProgress);
        finalComp *= uAlpha;

        vec3 col = finalComp;

        // col = layer1;
        gl_FragColor = vec4(col, 1.0);

    } 
        
<% } %>