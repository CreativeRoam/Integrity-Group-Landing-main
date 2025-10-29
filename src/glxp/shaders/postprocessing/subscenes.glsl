<% if (vert) { %>
    attribute vec2 uv;
    attribute vec2 position;

    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
<% } %>



<% if (frag) { %>
    precision highp float;

    uniform float uTime;
    uniform vec2 uMouse;
    uniform sampler2D uSceneFirst;
    uniform sampler2D uSceneSecond;
    uniform float uTransitionFactor;
    uniform float uTransitionSkew;

    varying vec2 vUv;

    // Scale UV centered on [0.5, 0.5]
    vec2 scaleUv(vec2 uv, float scale) {
        float invScale = 1.0 / scale;

        vec2 scaledUv = uv * 2.0 - 1.0;
        scaledUv *= invScale;
        scaledUv = scaledUv * 0.5 + 0.5;

        return scaledUv;
    }

    <%= commons.colorCorrection %>

    void main() {
        // EXEMPLE : Most of this code (roughly until the "Transition Mask" section) 
        // is used for the diagonal animation and can be removed.

        float transitionValue = uTransitionFactor;
        float transitionTranslateY = 0.4;
        float transitionScaleAdd = 0.2;

        // Coords
        vec2 uvFirst = scaleUv(vUv, 1.0 + transitionValue * transitionScaleAdd);
        uvFirst.y += transitionValue * transitionTranslateY * -1.0;

        vec2 uvSecond = scaleUv(vUv, 1.0 + transitionScaleAdd - transitionValue * transitionScaleAdd);
        uvSecond.y += (1.0 - transitionValue) * transitionTranslateY;

        // Textures
        vec4 sceneFirstCol = texture2D(uSceneFirst, uvFirst);
        vec4 sceneSecondCol = texture2D(uSceneSecond, uvSecond);

        // Color animation
        float colorTransitionValueFirst = smoothstep(0.0, 0.75, transitionValue);
        float colorTransitionValueSecond = 1.0 - smoothstep(0.25, 1.0, transitionValue);

        float darkenIntensity = 0.4;
        float contrastIntensity = 0.25;

        float darkenFactorFirst = 1.0 - colorTransitionValueFirst * darkenIntensity;
        float contrastFactorFirst = colorTransitionValueFirst * contrastIntensity;

        float darkenFactorSecond = 1.0 - colorTransitionValueSecond * darkenIntensity;
        float contrastFactorSecond = colorTransitionValueSecond * contrastIntensity;

        vec3 colFirst = sceneFirstCol.rgb * darkenFactorFirst;
        colFirst = contrast(colFirst, contrastFactorFirst);

        vec3 colSecond = sceneSecondCol.rgb * darkenFactorSecond;
        colSecond = contrast(colSecond, contrastFactorSecond);
        
        // Transition Mask
        float mask = 1.0 - step(transitionValue * (1.0 + uTransitionSkew) - (1.0 - vUv.x) * uTransitionSkew, vUv.y);

        // Color mix
        vec3 mixed = mix(colFirst, colSecond, mask);

        gl_FragColor = vec4(mixed, 1.0);
        // gl_FragColor = vec4(vec3(vUv.x, vUv.y, 0.0), 1.0);
    }
<% } %>