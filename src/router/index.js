import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/admin/auth/Login.vue'
import Home from '../views/admin/Home.vue'

import Dashboard from '../views/client/Dashboard.vue'
import Livescore from '../views/client/Livescore.vue'
import News from '../views/client/News.vue'
import NewsDetail from '../views/client/NewsDetail.vue'
import Highlights from '../views/client/Highlights.vue'


const routes = [
  { path: '/', 
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: false },
  },
  { path: '/livescore', 
    name: 'livescore',
    component: Livescore,
    meta: { requiresAuth: false },
  },
  { path: '/news', 
    name: 'news',
    component: News,
    meta: { requiresAuth: false },
  },
  {
    path: '/news/:id/:slug',
    name: 'news-detail',
    component: NewsDetail,
    meta: { requiresAuth: false },
  },
  { path: '/highlights', 
    name: 'highlights',
    component: Highlights,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
