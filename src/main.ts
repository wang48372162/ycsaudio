import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import nprogress from './logic/nprogress'
import './styles/index.css'

const app = createApp(App)
app.use(router)
app.use(nprogress)
app.mount('#app')
