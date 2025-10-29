import DebugController from '@/glxp/debug/DebugController'

const CONFIGS = {
  // Example
  CONFIG_0: {
    IBLDiffuseFactor:         { value: 1, params: {min: 0, max: 2, step: 0.01} },
    IBLSpecularFactor:        { value: 1, params: {min: 0, max: 2, step: 0.01} },
    Environment:              { value: "env_autoshop", params:{ options: {default: "env_default", autoshop: "env_autoshop", papermill: "env_papermill", night_sky: "env_night_sky", coffe_shop: "env_coffe_shop", studio: 'env_studio'} } },
    EnvironmentDiffuse:       { value: "env_diffuse", params:{ options: {default: "env_diffuse"} } },
    EnvRotationOffset:        { value: 0, params: { min: 0, max: 1, step: 0.001 } },
    lightColor:               { value: "#ffffff", params: {}},
    lightPosition:            { value: { x: 1, y: 3, z: 1 }, params: {x: {step: 1}, y:{step: 1}, z:{step: 1} } },
    emissiveColor:            { value: "#000000", params: {}},
    FogColor:                 { value: "#ffffff", params: {} },
    FogNear:                  { value: 15, params: {min: 0, max: 50, step: 0.01} },
    FogFar:                   { value: 25, params: {min: 0, max: 50, step: 0.01} },
    lightPower:               { value: 5, params: {min: 0, max: 10, step: 0.01} },
    Alpha:                    { value: 1, params: {min: 0, max: 1, step: 0.01} },
    Debug:                    { value: "disabled", params:{ options: { disabled: "disabled", baseColor: "baseColor", metallic: "metallic", roughness: "roughness", specRef: "specRef", geomOcc: "geomOcc", mcrfctDist: "mcrfctDist", spec: "spec", mathDiff: "mathDiff"} }},
  },
}

// DebugController.addBlade(CONFIGS.CONFIG_0, 'CONFIG_0', 0)

export default CONFIGS
