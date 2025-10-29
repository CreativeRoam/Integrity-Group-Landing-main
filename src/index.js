import { createApp } from 'vue'

// Dependencies
// import store from '@/store'
import router from '@/router'

// Application
import RouterRoot from '@/router/index.vue'

// Global Styles
import '@/styles/global.scss'

window.console.log('Made with love ♥ Dorian Lods - http://www.dorianlods.com/')

// Create Application
const app = createApp(RouterRoot)

// Tools
// app.use(store)
app.use(router)

// Mount
app.mount('#app')
