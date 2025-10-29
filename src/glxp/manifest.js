export default {

  // textures options:
  // "repeat" / "clamp": gl.texture wrap
  // "flipY": flip texture vertically
  // "lodTarget=2048": target texture inside subfolder "2048"
  // "compressed": choose .ktx2 texture
  // "transparent": choose png texture
  // "png": force-select png texture (named xxx.png.png)
  // "jpg": force-select jpg texture (named xxx.png.jpg)
  // "webp": force-select webp texture (named xxx.png.webp), if webp is supported


  main: {
    // Debug
    'test': { url: `${import.meta.env.BASE_URL}glxp/textures/Debug/UV_Grid.ktx2`, options: ['compressed'] },
    'testPng': { url: `${import.meta.env.BASE_URL}glxp/textures/Debug/UV_Grid.png`, options: [] },

    // Utils
    'brdfLUT': { url: `${import.meta.env.BASE_URL}glxp/brdfLUT.png`, options: ["clamp"] },
    'flakes': { url: `${import.meta.env.BASE_URL}glxp/flake-map.ktx2`, options: ["compressed", "repeat"] },
    'white': { url: `${import.meta.env.BASE_URL}glxp/textures/white.jpg`, options: ["repeat"] },
    'black': { url: `${import.meta.env.BASE_URL}glxp/textures/black.jpg`, options: ["repeat"] },
    'default_normals': { url: `${import.meta.env.BASE_URL}glxp/textures/default_normals.jpg`, options: ["repeat"] },

    // Environments
    // 'env_diffuse': { url: `${import.meta.env.BASE_URL}glxp/environment/diffuse.png`, options: ["repeat"] },
    // 'env_default': { url: `${import.meta.env.BASE_URL}glxp/environment/env_default.jpg`, options: ["repeat"] },
    // 'env_autoshop': { url: `${import.meta.env.BASE_URL}glxp/environment/autoshop.jpg`, options: ["repeat"] },
    // 'env_papermill': { url: `${import.meta.env.BASE_URL}glxp/environment/papermill.png`, options: ["repeat"] },
    // 'env_night_sky': { url: `${import.meta.env.BASE_URL}glxp/environment/night_sky.jpg`, options: ["repeat"] },
    // 'env_coffe_shop': { url: `${import.meta.env.BASE_URL}glxp/environment/coffe_shop.jpg`, options: ["repeat"] },
    // 'env_studio': { url: `${import.meta.env.BASE_URL}glxp/environment/studio.jpg`, options: ["repeat"] },

    // Noises
    // 'noise_crosshatch': { url: `/glxp/textures/Noises/noise_crosshatch.png`, options: ["repeat"] },


  },

  // Fonts
  fonts: {
    // 'SofiaProBlack': {
    //   'spritesheet': { url: `${import.meta.env.BASE_URL}glxp/fonts/SofiaProBlack.json` },
    //   'sdf': { url: `${import.meta.env.BASE_URL}glxp/fonts/SofiaProBlack.png`, options: ["flipY"] },
    // },
  },

  audio: {
    // 'audio_intro': `${import.meta.env.BASE_URL}assets/audios/01.ogg`,
  },
  mp3: {
    // 'audio_intro': `${import.meta.env.BASE_URL}assets/audios/01.mp3`,
  },

  materials: {
  }
}
