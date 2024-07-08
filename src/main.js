import { createApp } from 'vue'
import routes from './router/index.js'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import axios from 'axios'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// axios.get('./public/config.json').then((res) => {
  // window.VITE_APP_BASE_API = res.data.VITE_APP_BASE_API;
  const VITE_APP_BASE_API = 'http://192.168.0.124:5000/';
  window.VITE_APP_BASE_API = VITE_APP_BASE_API;
  const app = createApp(App)
  app.use(ElementPlus, {
      locale: zhCn,
    })
  app.use(routes)
  app.use(Antd)
  app.mount('#app')
// })
