/*========== [AppBootstrap] - 应用启动入口 ========== */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/global.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
/* ========== [AppBootstrap] END ========== */
