import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import nprogress from './logic/nprogress'
import './styles/index.css'

createApp(App)
  .use(router)
  .use(nprogress)
  .mount('#app')
