<% if (vert) { %>
    needES300
    precision highp float; 

    in vec3 position;
    in vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 modelMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;

    #ifdef HAS_SHADOW
        uniform mat4 shadowViewMatrix;
        uniform mat4 shadowProjectionMatrix;
        out vec4 vLightNDC;
        const mat4 depthScaleMatrix = mat4( 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5, 1 );
    #endif

    out vec2 vUv;

    void main(){
        vUv = uv;

        // Calculate the NDC (normalized device coords) for the light to compare against shadowmap
        #ifdef HAS_SHADOW
            vLightNDC = depthScaleMatrix * shadowProjectionMatrix * shadowViewMatrix * modelMatrix * vec4(position, 1.0);
        #endif

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

<% } %>



<% if (frag) { %>
    needES300
    precision highp float; 

    in vec2 vUv;
    uniform vec3 uColor;
    out vec4 outColor;

    #ifdef HAS_SHADOW
        uniform sampler2D tShadow;
        in vec4 vLightNDC;
    #endif

    const float division = 50.;

    void main() { 
        vec2 uv = vUv.xy * division;
        vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
        float line = min(grid.x, grid.y);

        vec2 circleUv = vUv -.5;
        float dist = sqrt(dot(circleUv, circleUv));
        float t = pow(smoothstep(.6, .1, dist), 1.5);

        #ifdef IS_WEBGL_1
            gl_FragColor = vec4(1.0 - min(line, 1.0)) * .5 * t;
            gl_FragColor.rgb = uColor - gl_FragColor.rgb;
            gl_FragColor.a = t;
        #else
            outColor = vec4(1.0 - min(line, 1.0)) * .5 * t;
            outColor.rgb = uColor - outColor.rgb;
            outColor.a = t;
        #endif


        #ifdef HAS_SHADOW

            vec3 lightPos = vLightNDC.xyz / vLightNDC.w;
            float bias = 0.0025;
            float depth = lightPos.z - bias;
            float occluder = texture(tShadow, lightPos.xy).r;
            float bounds = (step(0., lightPos.x) - step(1., lightPos.x)) * (step(0., lightPos.y) - step(1., lightPos.y));
            // float shadow = mix(0.2, 1.0, smoothstep(depth - .1, depth + .1, ));
            float shadow = mix(0.2, 1.0, step(depth, occluder));

            #ifdef IS_WEBGL_1
                gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * shadow, bounds);
            #else
                outColor.rgb = mix(outColor.rgb, outColor.rgb * shadow, bounds);
            #endif

            // outColor.rgb = vec3(lightPos.xy, 1. - bounds);
            // outColor.rgb = vec3(step(depth, occluder));
            // outColor.rgb = vec3(texture(tShadow, lightPos.xy));
            // outColor.rgb = vec3(rgbToFloat(texture(tShadow, lightPos.xy).rgb, 1.));
            
        #endif


    } 
        
<% } %>