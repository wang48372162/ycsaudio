import { createApp } from 'vue'
import tippy from 'vue-tippy'
import App from './App.vue'
import router from './router'
import nprogress from './logic/nprogress'
import 'tippy.js/dist/tippy.css'
import './styles/index.css'

createApp(App)
  .use(router)
  .use(nprogress)
  .use(tippy, {
    defaultProps: {
      placement: 'bottom',
      hideOnClick: false,
    },
  })
  .mount('#app')
