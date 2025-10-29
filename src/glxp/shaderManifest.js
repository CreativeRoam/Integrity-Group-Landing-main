import Ground from '@/glxp/shaders/ground.glsl'
import Background from '@/glxp/shaders/background.glsl'
import Flare from '@/glxp/shaders/flare.glsl'

// Debug
import Grid from '@/glxp/shaders/debug/grid.glsl'

// Postprocessing
import Post from '@/glxp/shaders/postprocessing/post.glsl'
import BlurPass from '@/glxp/shaders/postprocessing/blurPass.glsl'

// Text
import MSDFUnlit from '@/glxp/shaders/text/unlitMSDF.glsl'
import MSDFUnlitAnimated from '@/glxp/shaders/text/unlitMSDFAnimated.glsl'

// Commons
import Triplanar from '@/glxp/shaders/common/triplanar.glsl'
import ColorBurn from '@/glxp/shaders/common/colorBurn.glsl'
import Rotation from '@/glxp/shaders/common/rotation.glsl'
import NormalBlending from '@/glxp/shaders/common/normalBlending.glsl'
import ScreenBlending from '@/glxp/shaders/common/screenBlending.glsl'
import Blur from '@/glxp/shaders/common/blur5.glsl'
import BlurPost from '@/glxp/shaders/common/blurPost.glsl'
import Composite from '@/glxp/shaders/common/composite.glsl'
import Bright from '@/glxp/shaders/common/bright.glsl'
import Noise from '@/glxp/shaders/common/noise.glsl'
import PerlinNoise from '@/glxp/shaders/common/pnoise.glsl'
import AllBlendModes from '@/glxp/shaders/common/allBlendModes.glsl'
import ColorCorrection from '@/glxp/shaders/common/colorCorrection.glsl'
import Fxaa from '@/glxp/shaders/common/fxaa.glsl'

export default {
  // Misc
  'ground': Ground,
  
  // Background
  'background': Background,
  'flare': Flare,

  // Debug
  'grid': Grid,

  // Postprocessing
  'post': Post,
  'postBlur': BlurPass,

  // Text
  'MSDFUnlit': MSDFUnlit,
  'MSDFUnlitAnimated': MSDFUnlitAnimated,
  
  // Commons
  'commons': {
    'triplanar': Triplanar,
    'colorBurn': ColorBurn,
    'rotation': Rotation,
    'blur': Blur,
    'noise': Noise,
    'pnoise': PerlinNoise,
    'blurPost': BlurPost,
    'composite': Composite,
    'bright': Bright,
    'allBlendModes': AllBlendModes,
    'normalBlending': NormalBlending,
    'screenBlending': ScreenBlending,
    'colorCorrection': ColorCorrection,
    'fxaa': Fxaa,
  }
}
