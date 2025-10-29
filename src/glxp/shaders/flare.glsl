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
    uniform vec2 uLightPos;
    uniform vec3 uColorHalo;
    uniform vec3 uColorGradient1;
    uniform vec3 uColorGradient2;

    uniform float uStrengthHalo;
    uniform float uOpacityHalo;
    uniform float uStrengthGradient;
    uniform float uOpacityGradient;
    uniform float uOpacityGeneral;
    uniform float uGrain;

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
        
        float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.55 * uStrengthHalo;
        float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.53 * uStrengthHalo;
        float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.51 * uStrengthHalo;
        
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

        vec3 color = vec3(0.);
        float time = uTime;
        
        vec2 tuv = (uv - vec2(.5)) * 2.;
        tuv.x *= ratio;

        vec2 lightPos = uLightPos;
        lightPos.x *= ratio;

        vec3 halo = uColorHalo * lensflare(tuv, lightPos) * uOpacityHalo;
        halo = cc(halo, .5, .5);

        vec2 circlePos1 = uLightPos * .2;
        vec2 circleUv = tuv - circlePos1;
        circleUv += (hash(uv + 13.4) - .5) * .1 * uGrain;

        vec2 circlePos2 = -uLightPos * .6;
        vec2 circleUv2 = tuv - circlePos2;
        circleUv2 += (hash(uv + 86.4) - .5) * .05 * uGrain;

        float borderSize = sin(time * .5) * 2.;
        borderSize = sin(borderSize) * (max(pow(borderSize, .5), 1.));
        float circleRadius = sin(time * .7) * .5 + 0.5;

        float dist = dot((circleUv), (circleUv));
        float dist2 = dot(circleUv2, circleUv2);
        float distGeneral = dot(
            tuv + (lightPos * .2) + ((hash(uv + 13.4) - .5) * .1 * uGrain), 
            tuv + (lightPos * .1) + ((hash(uv + 86.4) - .5) * .05 * uGrain)
        );

        float circleRadiusGeneral = sin(time * .7 + 23.) * .5 + 0.5;
        float borderSizeGeneral = sin(time * .5 + 389.) * 2.;

        dist = pow(dist, .5);
        dist2 = pow(dist2, .5);

        float t = smoothstep(circleRadius - borderSize, circleRadius, dist) - smoothstep(circleRadius, circleRadius + borderSize, dist2);
        float tGeneral = smoothstep(circleRadiusGeneral - borderSizeGeneral, circleRadiusGeneral, distGeneral);

        color = mix(uColorGradient1 * uOpacityGradient, uColorGradient2 * uOpacityGradient, t) * tGeneral;
        color += halo;

        // col = layer1;
        gl_FragColor = vec4(color, uAlpha);

    } 
        
<% } %>