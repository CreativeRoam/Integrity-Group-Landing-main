<% if (vert) { %>
    needES300
    in vec3 position;
    in vec2 uv;
    in vec3 normal;

    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat3 normalMatrix;
    uniform mat4 projectionMatrix;

    out vec3 vPosition;
    out vec3 vWorldPosition;
    out vec3 vWorldNormal;
    out vec4 vPos;
    out vec2 vUv;

    #ifdef HAS_NORMALS
        #ifdef HAS_TANGENTS
            out mat3 vTBN;
        #else
            out vec3 vNormal;
        #endif
    #endif

    void main() {
        #ifdef HAS_NORMALS
            vec3 p = position;
            vec3 n = normal;

            vec4 pos = modelMatrix * vec4(p, 1.0);
            vPos = pos;
            vPosition = vec3(pos.xyz) / pos.w;
            vWorldPosition = (modelViewMatrix * vec4(p, 1.0)).xyz;

            #ifdef HAS_TANGENTS
                // vec3 normalW = normalize(vec3(normalMatrix * vec4(n, 0.0))); // Broken?
                vec3 normalW = normalize(vec3(normalMatrix * n));
                vec3 tangentW = normalize(vec3(modelMatrix * vec4(tangents.xyz, 0.0)));
                vec3 bitangentW = cross(normalW, tangentW) * tangents.w;
                vTBN = mat3(tangentW, bitangentW, normalW);
            #else // HAS_TANGENTS != 1
                vNormal = normalize(vec3(normalMatrix * n));
                vWorldNormal = normalize( modelViewMatrix * vec4(n, 0.0)).xyz;
            #endif
        #endif
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
<% } %>

<% if (frag) { %>
    // needES300
    precision highp float;

    in vec2 vUv;
    in vec3 vPosition;

    // uniform vec4 uBaseColorFactor;
    uniform float uUvScale;

    // #ifdef HAS_NORMALMAP
    //     uniform sampler2D uNormalSampler;
    //     uniform float uNormalScale;
    // #endif

    #ifdef HAS_NORMALS
        #ifdef HAS_TANGENTS
            in mat3 vTBN;
        #else
            in vec3 vNormal;
            in vec3 vWorldNormal;
        #endif
    #endif

    out vec4 outColor;

    vec3 getNormal()
    {
        // Retrieve the tangent space matrix
        #ifndef HAS_TANGENTS
            vec3 pos_dx = dFdx(vPosition);
            vec3 pos_dy = dFdy(vPosition);
            vec3 tex_dx = dFdx(vec3(vUv, 0.0));
            vec3 tex_dy = dFdy(vec3(vUv, 0.0));
            vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);

            #ifdef HAS_NORMALS
                vec3 ng = normalize(vWorldNormal);
            #else
                vec3 ng = cross(pos_dx, pos_dy);
            #endif

            t = normalize(t - ng * dot(ng, t));
            vec3 b = normalize(cross(ng, t));
            mat3 tbn = mat3(t, b, ng);
        #else // HAS_TANGENTS
            mat3 tbn = vTBN;
        #endif

        // #ifdef HAS_NORMALMAP
        //     vec3 n = texture(uNormalSampler, vUv * uUvScale).rgb;
        //     n = normalize(tbn * ((2.0 * n - 1.0) * vec3(uNormalScale, uNormalScale, 1.0)));
        // #else
            // The tbn matrix is linearly interpolated, so we need to re-normalize
            vec3 n = normalize(tbn[2].xyz);
        // #endif

        return n;
    }

    void main() {
        vec3 n = getNormal();
        // vec4 baseColor = uBaseColorFactor;
        #ifdef IS_WEBGL_1
            gl_FragColor = vec4(n, 1.0);
        #else
            outColor = vec4(n, 1.0);
        #endif        
    }
<% } %>