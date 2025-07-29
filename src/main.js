import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { createMetaManager } from 'vue-meta'
// 🔽 Import your custom styles
import './style.css'

const app = createApp(App)
const head = createHead()
const metaManager = createMetaManager()

app.use(metaManager)
// app.config.globalProperties.$apiBaseUrl = 'http://localhost:8080/'
app.config.globalProperties.$apiBaseUrl = 'https://wwb99-golang-production.up.railway.app/'
app.use(router)
app.use(head) // <-- This line is essential!
app.mount('#app')
