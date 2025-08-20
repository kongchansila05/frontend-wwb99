import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    username: null,
    permissions: []
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUsername(name) {
      this.username = name
      localStorage.setItem('username', name)
    },
    setPermissions(permissions) {
      this.permissions = permissions
      localStorage.setItem('permissions', JSON.stringify(permissions))
    },
    hasPermission(required) {
      if (typeof required === 'string') {
        return this.permissions.includes(required);
      }
      if (Array.isArray(required)) {
        return required.every(p => this.permissions.includes(p));
      }
    },
    loadFromStorage() {
      this.token = localStorage.getItem('token')
      this.username = localStorage.getItem('username')
      this.permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
    },
    logout() {
      this.token = null
      this.username = null
      this.permissions = []
      localStorage.clear()
    }
  }
})
