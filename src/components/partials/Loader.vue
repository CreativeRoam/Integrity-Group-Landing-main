<template>
  <div class="loader" :class="{ 'is-hidden': !isVisible, 'off': off }"></div>
</template>

<script>
// Vue
import { ref } from 'vue'

// Utils
import GlobalEmitter from '@/glxp/utils/EventEmitter'

export default {
  name: 'CustomLoader',
  setup() {
    // References
    const progress = ref(0)
    const isVisible = ref(true)
    const off = ref(false)

    return {
      progress,
      isVisible,
      off,
    }
  },
  mounted() {
    // Events
    GlobalEmitter.on('loading_progress', this.handleLoadingProgress)
    GlobalEmitter.on('webgl_loaded', this.handleLoaded)
  },
  methods: {
    handleLoadingProgress(payload) {
      this.progress = Math.round(payload.progress)
    },
    handleLoaded() {
      this.isVisible = false
      setTimeout(() => {
        this.off = true
      }, 1000)
    },
  },
}
</script>

<style lang="scss">
// Kennel
@import '@/styles/vendors/kennel/kennel';

.loader {
  @include position(fixed, 0 null null 0);
  @include size(100%);

  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: opacity 2s ease;

  &.is-hidden {
    pointer-events: none;
    opacity: 0;
  }

  &.off {
    // display: none;
  }
}
</style>
