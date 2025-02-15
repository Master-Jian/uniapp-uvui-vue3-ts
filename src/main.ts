import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import uvUI from '@/uni_modules/uv-ui-tools'

import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.use(uvUI)
  app.use(pinia)
  return {
    app,
  }
}
