<% if (vert) { %>
    needES300
    precision highp float;

    in vec3 position;
    #ifdef HAS_NORMALS
        in vec3 normal;
    #endif
    #ifdef HAS_POSEMORPHS
        in vec3 position1;
        in vec3 normal1;
        uniform float uActivePoseMix;
    #endif
    #ifdef HAS_TANGENTS
        // in vec3 tangents; // Broken?
        in vec4 tangents;
    #endif
    #ifdef HAS_UV
        in vec2 uv;
    #endif

    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat3 normalMatrix;
    uniform mat4 projectionMatrix;

    uniform float uTime;

    out vec3 vPosition;
    out vec3 vWorldPosition;
    out vec2 vUv;

    #ifdef HAS_NORMALS
        #ifdef HAS_TANGENTS
            out mat3 vTBN;
        #else
            out vec3 vNormal;
        #endif
    #endif

    void main(){
        vec3 p = position;
        
        #ifdef HAS_POSEMORPHS
            p = mix(position, position1, uActivePoseMix);
            n = mix(normal, normal1, uActivePoseMix);
        #endif

        vec4 pos = modelMatrix * vec4(p, 1.0);
        vPosition = vec3(pos.xyz) / pos.w;
        vWorldPosition = (modelViewMatrix * vec4(p, 1.0)).xyz;

        #ifdef HAS_NORMALS
            vec3 n = normal;

            #ifdef HAS_TANGENTS
                // vec3 normalW = normalize(vec3(normalMatrix * vec4(n, 0.0))); // Broken?
                vec3 normalW = normalize(vec3(normalMatrix * n));
                vec3 tangentW = normalize(vec3(modelMatrix * vec4(tangents.xyz, 0.0)));
                vec3 bitangentW = cross(normalW, tangentW) * tangents.w;
                vTBN = mat3(tangentW, bitangentW, normalW);
            #else // HAS_TANGENTS != 1
                vNormal = normalize(vec3(normalMatrix * n));
            #endif
        #endif

        #ifdef HAS_UV
            vUv = uv;
        #else
            vUv = vec2(0.,0.);
        #endif

        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

    }

<% } %>



<% if (frag) { %>
    // needES300
    precision highp float; 

    uniform vec3 uLightDirection;
    uniform vec3 uLightColor;
    uniform float uUvScale;

    #ifdef USE_IBL
        uniform sampler2D uDiffuseEnvSampler;
        uniform sampler2D uSpecularEnvSampler;
        uniform sampler2D uBrdfLUT;
        uniform float uIBLAlbedoMix;
        uniform float uIBLRoughnessImpact;
        uniform float uEnvOffset;
    #endif

    #ifdef HAS_BASECOLORMAP
        uniform sampler2D uBaseColorSampler;
    #endif
    #ifdef HAS_ALPHAMAP
        uniform sampler2D uAlphaMapSampler;
    #endif
    #ifdef HAS_SHEEN
        uniform float uSheenDepth;
        uniform float uSheenOpacity;
        uniform vec3 uSheenColor;
    #endif

    #ifdef HAS_NORMALMAP
        uniform sampler2D uNormalSampler;
        uniform float uNormalScale;
    #endif

    #ifdef HAS_EMISSIVEMAP
        uniform sampler2D uEmissiveSampler;
        uniform vec3 uEmissiveFactor;
    #endif
    #ifdef HAS_EMISSIVECOLOR
        uniform vec3 uEmissiveColor;
        uniform float uEmissivePower;
    #endif
    
    #ifdef HAS_METALROUGHNESSMAP
        uniform sampler2D uMetallicRoughnessSampler;
    #endif

    #ifdef HAS_ORM_MAP
        uniform sampler2D uOcclusionRoughnessMetallicSampler;
        uniform float uOcclusionStrength;
    #endif

    #ifdef HAS_OCCLUSIONMAP
        uniform sampler2D uOcclusionSampler;
        uniform float uOcclusionStrength;
    #endif

    #ifdef HAS_FOG
        const float LOG2 = 1.442695;
        uniform vec3 uFogColor;
        // uniform float uFogDensity;
        uniform float uFogNear;
        uniform float uFogFar;
    #endif

    // Color correction
    #ifdef HAS_COLOR_CORRECTION
        uniform float uTintOpacity;
        uniform float uExposure;
        uniform float uContrast;
        uniform float uSaturation;
        uniform vec3 uTint;

        <%= commons.colorCorrection %>
    #endif

    uniform vec2 uMetallicRoughnessValues;
    uniform vec4 uBaseColorFactor;
    uniform vec3 uCamera;

    // debugging flags used for shader output of intermediate PBR variables
    uniform vec4 uScaleDiffBaseMR;
    uniform vec4 uScaleFGDSpec;
    uniform vec4 uScaleIBLAmbient;

    in vec2 vUv;
    in vec3 vPosition;
    in vec3 vWorldPosition;

    out vec4 outColor;

    #ifdef HAS_NORMALS
        #ifdef HAS_TANGENTS
            in mat3 vTBN;
        #else
            in vec3 vNormal;
        #endif
    #endif

    struct PBRInfo
    {
        float NdotL;                  // cos angle between normal and light direction
        float NdotV;                  // cos angle between normal and view direction
        float NdotH;                  // cos angle between normal and half vector
        float LdotH;                  // cos angle between light direction and half vector
        float VdotH;                  // cos angle between view direction and half vector
        float perceptualRoughness;    // roughness value, as authored by the model creator (input to shader)
        float metalness;              // metallic value at the surface
        vec3 reflectance0;            // full reflectance color (normal incidence angle)
        vec3 reflectance90;           // reflectance color at grazing angle
        float alphaRoughness;         // roughness mapped to a more linear change in the roughness (proposed by [2])
        vec4 baseColor;               // color from base diffuse map
        vec3 diffuseColor;            // color contribution from diffuse lighting
        vec3 specularColor;           // color contribution from specular lighting
    };

    const float M_PI = 3.141592653589793;
    const float c_MinRoughness = 0.04;
    const vec2 invAtan = vec2(0.1591, 0.3183);

    vec4 SRGBtoLINEAR(vec4 srgbIn)
    {
        #ifdef MANUAL_SRGB
            #ifdef SRGB_FAST_APPROXIMATION
                vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
            #else //SRGB_FAST_APPROXIMATION
                vec3 bLess = step(vec3(0.04045),srgbIn.xyz);
                vec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );
            #endif //SRGB_FAST_APPROXIMATION
                return vec4(linOut,srgbIn.w);;
        #else //MANUAL_SRGB
            return srgbIn;
        #endif //MANUAL_SRGB
    }

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
            vec3 ng = normalize(vNormal);
        #else
            vec3 ng = cross(pos_dx, pos_dy);
        #endif

            t = normalize(t - ng * dot(ng, t));
            vec3 b = normalize(cross(ng, t));
            mat3 tbn = mat3(t, b, ng);
        #else // HAS_TANGENTS
            mat3 tbn = vTBN;
        #endif

        #ifdef HAS_NORMALMAP
            vec3 n = texture(uNormalSampler, vUv * uUvScale).rgb;
            n = normalize(tbn * ((2.0 * n - 1.0) * vec3(uNormalScale, uNormalScale, 1.0)));
        #else
            // The tbn matrix is linearly interpolated, so we need to re-normalize
            vec3 n = normalize(tbn[2].xyz);
        #endif

        return n;
    }

    vec2 SampleSphericalMap(vec3 direction)
    {
        vec2 uv = vec2(atan(direction.z, direction.x), asin(direction.y));
        uv *= invAtan;
        uv += 0.5;
        uv.y = 1. - uv.y;
        uv.x = mod(uv.x + uEnvOffset, 1.);
        return uv;
    }

    // Calculation of the lighting contribution from an optional Image Based Light source.
    // Precomputed Environment Maps are required uniform inputs and are computed as outlined in [1].
    #ifdef USE_IBL
        vec3 getIBLContribution(PBRInfo pbrInputs, vec3 n, vec3 reflection)
        {
            float mipCount = 9.0; // resolution of 512x512
            float lod = (pbrInputs.perceptualRoughness * mipCount);
            // retrieve a scale and bias to F0. See [1], Figure 3
            vec3 brdf = SRGBtoLINEAR(texture(uBrdfLUT, vec2(pbrInputs.NdotV, 1.0 - pbrInputs.perceptualRoughness), lod)).rgb;
            vec3 diffuseLight = SRGBtoLINEAR(texture(uDiffuseEnvSampler, SampleSphericalMap(n), lod)).rgb;

            vec3 specularLight = SRGBtoLINEAR(texture(uSpecularEnvSampler, SampleSphericalMap(reflection), lod)).rgb;

            vec3 diffuse = diffuseLight * pbrInputs.diffuseColor;
            vec3 specular = specularLight * (pbrInputs.specularColor * brdf.x + brdf.y);

            // ROUGHNESS HACK UPDATE START
            vec3 mixedRoughDiffuse = mix(pbrInputs.baseColor.rgb, pbrInputs.diffuseColor.rgb, uIBLAlbedoMix);
            diffuse = mix(diffuse, mixedRoughDiffuse, pbrInputs.perceptualRoughness * uIBLRoughnessImpact);
            specular *= (1.0 - pbrInputs.perceptualRoughness);
            // ROUGHNESS HACK UPDATE END

            // For presentation, this allows us to disable IBL terms
            diffuse *= uScaleIBLAmbient.x;
            specular *= uScaleIBLAmbient.y;

            return diffuse + specular;
        }
    #endif

    // Basic Lambertian diffuse
    // Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
    vec3 diffuse(PBRInfo pbrInputs)
    {
        return pbrInputs.diffuseColor / M_PI;
    }

    // The following equation models the Fresnel reflectance term of the spec equation (aka F())
    vec3 specularReflection(PBRInfo pbrInputs)
    {
        return pbrInputs.reflectance0 + (pbrInputs.reflectance90 - pbrInputs.reflectance0) * pow(clamp(1.0 - pbrInputs.VdotH, 0.0, 1.0), 5.0);
    }

    // This calculates the specular geometric attenuation (aka G()),
    // where rougher material will reflect less light back to the viewer.
    float geometricOcclusion(PBRInfo pbrInputs)
    {
        float NdotL = pbrInputs.NdotL;
        float NdotV = pbrInputs.NdotV;
        float r = pbrInputs.alphaRoughness;

        float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
        float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
        return attenuationL * attenuationV;
    }

    // The following equation(s) model the distribution of microfacet normals across the area being drawn (aka D())
    // Implementation from "Average Irregularity Representation of a Roughened Surface for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
    // Follows the distribution function recommended in the SIGGRAPH 2013 course notes from EPIC Games [1], Equation 3.
    float microfacetDistribution(PBRInfo pbrInputs)
    {
        float roughnessSq = pbrInputs.alphaRoughness * pbrInputs.alphaRoughness;
        float f = (pbrInputs.NdotH * roughnessSq - pbrInputs.NdotH) * pbrInputs.NdotH + 1.0;
        return roughnessSq / (M_PI * f * f);
    }


    void main() {   

        // Metallic and Roughness material properties are packed together
        // In glTF, these factors can be specified by fixed scalar values
        // or from a metallic-roughness map
        float perceptualRoughness = uMetallicRoughnessValues.y;
        float metallic = uMetallicRoughnessValues.x;

        #ifdef HAS_METALROUGHNESSMAP
            // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
            // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
            vec4 mrSample = texture(uMetallicRoughnessSampler, vUv * uUvScale);
            perceptualRoughness = mrSample.g * perceptualRoughness;
            metallic = mrSample.b * metallic;
        #endif

        #ifdef HAS_ORM_MAP
            //'r': occlusion map (O)
            //'g': roughness map (R)
            //'b': metallic map (M)
            vec4 mrSample = texture(uOcclusionRoughnessMetallicSampler, vUv * uUvScale);
            perceptualRoughness = mrSample.g * perceptualRoughness;
            metallic = mrSample.b * metallic;
            float ao = mrSample.r;
        #endif

        perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
        metallic = clamp(metallic, 0.0, 1.0);
        // Roughness is authored as perceptual roughness; as is convention,
        // convert to material roughness by squaring the perceptual roughness [2].
        float alphaRoughness = perceptualRoughness * perceptualRoughness;

        // The albedo may be defined from a base texture or a flat color
        #ifdef HAS_BASECOLORMAP
            vec4 baseColor = SRGBtoLINEAR(texture(uBaseColorSampler, vUv * uUvScale)) * uBaseColorFactor;
        #else
            vec4 baseColor = uBaseColorFactor;
        #endif
        #ifdef HAS_ALPHAMAP
            baseColor.a *= texture(uAlphaMapSampler, vUv * uUvScale).r;
        #endif

        vec3 f0 = vec3(0.04);
        vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);
        diffuseColor *= 1.0 - metallic;
        vec3 specularColor = mix(f0, baseColor.rgb, metallic);

        // Compute reflectance.
        float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);

        // For typical incident reflectance range (between 4% to 100%) set the grazing reflectance to 100% for typical fresnel effect.
        // For very low reflectance range on highly diffuse objects (below 4%), incrementally reduce grazing reflecance to 0%.
        float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
        vec3 specularEnvironmentR0 = specularColor.rgb;
        vec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;

        vec3 n = getNormal();                             // normal at surface point
        vec3 v = normalize(uCamera - vPosition);          // Vector from surface point to camera
        vec3 l = normalize(uLightDirection);              // Vector from surface point to light
        vec3 h = normalize(l+v);                          // Half vector between both l and v
        vec3 reflection = -normalize(reflect(v, n));

        #ifdef HAS_SHEEN
            float fresnelFactor = abs(dot(v, n));
            float sheen = pow(1.0 - fresnelFactor, uSheenDepth);
        #endif

        float NdotL = clamp(dot(n, l), 0.001, 1.0);
        float NdotV = clamp(abs(dot(n, v)), 0.001, 1.0);
        float NdotH = clamp(dot(n, h), 0.0, 1.0);
        float LdotH = clamp(dot(l, h), 0.0, 1.0);
        float VdotH = clamp(dot(v, h), 0.0, 1.0);

        PBRInfo pbrInputs = PBRInfo(
            NdotL,
            NdotV,
            NdotH,
            LdotH,
            VdotH,
            perceptualRoughness,
            metallic,
            specularEnvironmentR0,
            specularEnvironmentR90,
            alphaRoughness,
            baseColor,
            diffuseColor,
            specularColor
        );

        // Calculate the shading terms for the microfacet specular shading model
        vec3 F = specularReflection(pbrInputs);
        float G = geometricOcclusion(pbrInputs);
        float D = microfacetDistribution(pbrInputs);

        // Calculation of analytical lighting contribution
        vec3 diffuseContrib = (1.0 - F) * diffuse(pbrInputs);
        vec3 specContrib = F * G * D / (4.0 * NdotL * NdotV);
        // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
        vec3 color = NdotL * uLightColor * (diffuseContrib + specContrib);

        // Calculate lighting contribution from image based lighting source (IBL)
        #ifdef USE_IBL
            color += getIBLContribution(pbrInputs, n, reflection);
        #endif

        // Apply optional PBR terms for additional (optional) shading
        #ifdef HAS_OCCLUSIONMAP
            float ao = texture(uOcclusionSampler, vUv * uUvScale).r;
            color = mix(color, color * ao, uOcclusionStrength);
        #endif

        // apply occlusion from ORM if exists
        #ifdef HAS_ORM_MAP
            color = mix(color, color * ao, uOcclusionStrength);
        #endif

        #ifdef HAS_EMISSIVEMAP
            vec3 emissive = SRGBtoLINEAR(texture(uEmissiveSampler, vUv * uUvScale)).rgb * uEmissiveFactor;
            color += emissive;
        #endif

        // This section uses mix to override final color for reference app visualization
        // of various parameters in the lighting equation.
        color = mix(color, F, uScaleFGDSpec.x);
        #ifdef HAS_SHEEN
            color = mix(color, uSheenColor, sheen * uSheenOpacity);
        #endif
        color = mix(color, vec3(G), uScaleFGDSpec.y);
        color = mix(color, vec3(D), uScaleFGDSpec.z);
        color = mix(color, specContrib, uScaleFGDSpec.w);

        color = mix(color, diffuseContrib, uScaleDiffBaseMR.x);
        color = mix(color, baseColor.rgb, uScaleDiffBaseMR.y);
        color = mix(color, vec3(metallic), uScaleDiffBaseMR.z);
        color = mix(color, vec3(perceptualRoughness), uScaleDiffBaseMR.w);

        // Color correction
        #ifdef HAS_COLOR_CORRECTION
            color.rgb = czm_saturation(color.rgb, uSaturation);
            color.rgb = contrast(color.rgb, uContrast);
            color.rgb = exposure(color.rgb, uExposure);
            color.rgb = mix(color.rgb, uTint, uTintOpacity);
        #endif

        #ifdef HAS_FOG
            float fogDistance = length(vWorldPosition);
            // float fogAmount = 1. - exp2(-uFogDensity * uFogDensity * fogDistance * fogDistance * LOG2);
            float fogAmount = smoothstep(uFogNear, uFogFar, fogDistance);
            fogAmount = clamp(fogAmount, 0., 1.);
            color = mix(color, uFogColor, fogAmount);
        #endif

        #ifdef IS_WEBGL_1
            gl_FragColor = vec4(pow(color,vec3(1.0/2.2)), baseColor.a);
            #ifdef HAS_EMISSIVECOLOR
                gl_FragColor.rgb = mix(gl_FragColor.rgb, uEmissiveColor * uEmissivePower, min(uEmissivePower, 1.));
            #endif
        #else
            outColor = vec4(pow(color,vec3(1.0/2.2)), baseColor.a);
            #ifdef HAS_EMISSIVECOLOR
                outColor.rgb = mix(outColor.rgb, uEmissiveColor * uEmissivePower, min(uEmissivePower, 1.));
            #endif
        #endif

        // Debug
        // #ifdef HAS_NORMALS
        //     vec3 worldNormal = normalize(vNormal);
        //     outColor.rgb = worldNormal;
        // #endif
        // vec3 eyeToSurfaceDir = normalize(vPosition - uCamera);
        // vec3 direction = reflect(eyeToSurfaceDir,worldNormal);
        // outColor = SRGBtoLINEAR(textureCube(uDiffuseEnvSampler, direction));
    } 
        
<% } %>