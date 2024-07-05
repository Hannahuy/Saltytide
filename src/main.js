import { createApp } from 'vue'
import routes from './router/index.js'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import axios from 'axios'

axios.get('./public/config.json').then((res) => {
  window.VITE_APP_BASE_API = res.data.VITE_APP_BASE_API;
  const app = createApp(App)
  app.use(ElementPlus, {
      locale: zhCn,
    })
  app.use(routes)
  app.mount('#app')
})
