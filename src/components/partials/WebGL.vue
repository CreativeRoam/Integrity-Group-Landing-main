<template>
  <div ref="canvas" class="demo" />
</template>

<script>
// Vue
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// WebGL Utilities
import RAF from '@/glxp/utils/RAF'

// WebGL Manager
import WebGLManager from '@/glxp/WebGLManager'

export default {
  name: 'WebGL',
  props: {
    height: {
      type: String,
      default: '88vh',
    },
    mobileHeight: {
      type: String,
      default: '80vh',
    },
  },
  setup() {
    // References
    const canvas = ref(null)

    // Routing
    const router = useRouter()
    const route = useRoute()
    // Lifecycle
    onMounted(async () => {
      await router.isReady()

      // WebGL Manager
      const Manager = WebGLManager.init(canvas.value)

      // Render Loop
      RAF.subscribe('canvas', Manager.render.bind(Manager))

      // WebGL Events
      const sceneName = 'main'
      const scene = WebGLManager.getScene(sceneName)

      // WebGL Progress
      scene.setProgress(0)

      // WebGL Activation
      WebGLManager.textureLoader.detectFallbackFormats().then(() => {
        WebGLManager.loadScene(sceneName).then(() => {
          WebGLManager.activate(sceneName).then(() => {
            // console.log('scene activated')
          })
        })
      })
    })

    return {
      canvas,
    }
  },
}
</script>

<style lang="scss">
.demo {
  position: relative;
  width: 100%;
  height: v-bind(height);
  
  @media (max-width: 768px) {
    height: v-bind(mobileHeight);
  }
  
  canvas {
    pointer-events: none;
    touch-action: none;
  }
}
</style>
