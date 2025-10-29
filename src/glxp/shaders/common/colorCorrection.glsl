vec3 contrast(vec3 color, float value) {
    return clamp(0.5 + (1.0 + value) * (color - 0.5), vec3(0.), vec3(1.));
}
vec3 exposure(vec3 color, float value) {
    return (1.0 + value) * color;
}
vec3 czm_saturation(vec3 rgb, float adjustment) {
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}
vec3 hueShift(vec3 color, float hue) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}
vec3 linearToneMapping(vec3 color, float gamma) {
    float exposure = 1.;
    color = clamp(exposure * color, 0., 1.);
    color = pow(color, vec3(1. / gamma));
    return color;
}