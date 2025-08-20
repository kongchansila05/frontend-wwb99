import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../views/stores/auth'
import Login from '../views/admin/auth/Login.vue'
import Home from '../views/admin/Home.vue'
import Settings from '../views/admin/Settings.vue'

import News_View from '../views/admin/news/View.vue'
import News_Create from '../views/admin/news/Create.vue'
import News_Update from '../views/admin/news/Update.vue'

import Highlights_View from '../views/admin/highlights/View.vue'
import Highlights_Create from '../views/admin/highlights/Create.vue'
import Highlights_Update from '../views/admin/highlights/Update.vue'

import Footers_View from '../views/admin/settings/footers/View.vue'
import Footers_Create from '../views/admin/settings/footers/Create.vue'
import Footers_Update from '../views/admin/settings/footers/Update.vue'

import Sponsors_View from '../views/admin/settings/sponsors/View.vue'
import Sponsors_Create from '../views/admin/settings/sponsors/Create.vue'
import Sponsors_Update from '../views/admin/settings/sponsors/Update.vue'

import Permissions_View from '../views/admin/settings/permissions/View.vue'
import Roles_View from '../views/admin/settings/roles/View.vue'
import Assign from '../views/admin/settings/roles/Assign.vue'

import Dashboard from '../views/client/Dashboard.vue'
import Livescore from '../views/client/Livescore.vue'
import News from '../views/client/News.vue'
import NewsDetail from '../views/client/NewsDetail.vue'
import Highlights from '../views/client/Highlights.vue'
import HighlightsDetail from '../views/client/HighlightsDetail.vue'

import Forbidden from '../views/errors/403.vue'
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
    path: '/highlights/:id/:slug',
    name: 'highlights-detail',
    component: HighlightsDetail,
    meta: { requiresAuth: false },
  },

  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/admin/home',
    component: Home,
    meta: { requiresAuth: true},
  },
  {
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: true },
  },

  {
    path: '/admin/news',
    component: News_View,
    meta: { requiresAuth: true, },
  },
  {
    path: '/admin/news/create',
    component: News_Create,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/news/update',
    component: News_Update,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/highlights',
    component: Highlights_View,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/highlights/create',
    component: Highlights_Create,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/highlights/update',
    component: Highlights_Update,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/footers',
    component: Footers_View,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/footers/create',
    component: Footers_Create,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/footers/update',
    component: Footers_Update,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/sponsors',
    component: Sponsors_View,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/sponsors/create',
    component: Sponsors_Create,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/sponsors/update',
    component: Sponsors_Update,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/permissions',
    component: Permissions_View,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/roles',
    component: Roles_View,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/settings/roles/assign/:id',
    name: 'role-assign',
    component: Assign,
    meta: { requiresAuth: true },
  },
  { path: '/403', name: 'forbidden', component: Forbidden },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Load from storage in case the page was refreshed
  if (!authStore.token) {
    authStore.loadFromStorage()
  }

  // Check authentication
  if (to.meta.requiresAuth && !authStore.token) {
    return next('/login')
  }

  // Check permissions if specified
  if (to.meta.permissions && !authStore.hasPermission(to.meta.permissions)) {
    return next('/403') // or some "403 Forbidden" page
  }

  next()
})

export default router
