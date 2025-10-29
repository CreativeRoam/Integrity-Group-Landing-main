// Pages
import Home from '@@/pages/index.vue'
import Page144 from '@@/pages/144.vue'
import Error from '@@/pages/error.vue'

// Routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/144',
    name: 'Page144',
    component: Page144,
  },
  {
    path: '/:route(.*)*',
    component: Error,
  },
]

export default routes
