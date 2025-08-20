import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import './style.css'
import 'quill/dist/quill.snow.css'
const app = createApp(App)
const head = createHead()
app.use(createPinia())
// app.config.globalProperties.$apiBaseUrl = 'http://localhost:8080/'
app.config.globalProperties.$apiBaseUrl = 'https://wwb99.2m-sy.com/'
app.use(i18n)
app.use(router)
app.use(head) // <-- This line is essential!
app.mount('#app')
