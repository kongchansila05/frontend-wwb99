<template>
  <aside class="sidebar bg-dark text-white ">
    <ul class="list-group">
      <div v-for="item in filteredMenu" :key="item.name">
        <template v-if="item.children">
          <li
            class="list-group-item text-decoration-none text-white li-pending"
            :class="[{ active: isActive(item.path) }, isOpen(item.name) ? 'active-page' : 'hover-page']"
          >
            <a
              href="javascript:void(0);"
              @click.prevent="handleClick(item)"
              class="d-flex justify-content-between align-items-center text-decoration-none text-white"
            >
              <span><i :class="item.icon"></i> {{ item.label }}</span>
              <i class="bi" :class="isOpen(item.name) ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
            </a>
            <ul v-show="isOpen(item.name)" class="list-group list-group-flush">
              <router-link
                v-for="child in filteredChildren(item.children)"
                :key="child.path"
                :to="child.path"
                class="text-decoration-none text-white"
              >
                <li
                  class="list-group-item text-white ps-2 item-hover li-pending"
                  :class="{ active: isActive(child.path) }"
                >
                  <i :class="child.icon"></i> {{ child.label }}
                </li>
              </router-link>
            </ul>
          </li>
        </template>
        <template v-else>
          <router-link
            v-if="hasPermission(item.permissions)"
            :to="item.path"
            class="text-white text-decoration-none"
            @click.native.prevent="handleClick(item)"
          >
            <li
              class="list-group-item text-decoration-none text-white li-pending hover-page"
              :class="{ active: isActive(item.path) }"
            >
              <i :class="item.icon"></i> {{ item.label }}
            </li>
          </router-link>
        </template>
      </div>
    </ul>
  </aside>
</template>

<script>
import { useAuthStore } from '../views/stores/auth'

export default {
  name: 'Sidebar',
  data() {
    return {
      openDropdowns: {},
      // Add a 'permissions' property for each menu item as needed
      menu: [
        {
          name: 'home',
          label: 'Home',
          icon: 'bi bi-houses-fill',
          path: '/admin/home',
          // permissions: ['view_dashboard'], 
        },
        {
          name: 'news',
          label: 'News',
          icon: 'bi bi-newspaper',
          permissions: ['NEW-View'], 
          children: [
            {
              path: '/admin/news',
              label: 'List News',
              icon: 'bi bi-circle',
              permissions: ['NEW-View'],
            },
            {
              path: '/admin/news/create',
              label: 'Create News',
              icon: 'bi bi-circle',
              permissions: ['NEW-Create'],
            },
          ],
        },
        {
          name: 'highlights',
          label: 'HighLights',
          icon: 'bi bi-film',
          // permissions: ['view_highlights'],
          children: [
            {
              path: '/admin/highlights',
              label: 'List HighLights',
              icon: 'bi bi-circle',
              // permissions: ['view_highlights'],
            },
            {
              path: '/admin/highlights/create',
              label: 'Add HighLights',
              icon: 'bi bi-circle',
              // permissions: ['create_highlights'],
            },
          ],
        },
        {
          name: 'settings',
          label: 'Settings',
          icon: 'bi bi-gear',
          // permissions: ['view_settings'],
          children: [
            {
              path: '/admin/settings/footers',
              label: 'List Footers',
              icon: 'bi bi-circle',
              // permissions: ['view_footers'],
            },
            {
              path: '/admin/settings/sponsors',
              label: 'List Sponsors',
              icon: 'bi bi-circle',
              // permissions: ['view_sponsors'],
            },
            {
              path: '/admin/settings/permissions',
              label: 'List Permissions',
              icon: 'bi bi-circle',
              // permissions: ['view_permissions'],
            },
            {
              path: '/admin/settings/roles',
              label: 'List Roles',
              icon: 'bi bi-circle',
              // permissions: ['view_roles'],
            },
          ],
        },
      ],
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    filteredMenu() {
      // Filter menu by permission for parent items (including those with children)
      return this.menu.filter((item) => this.hasPermission(item.permissions))
    },
  },
  methods: {
    hasPermission(requiredPermissions = []) {
      if (!requiredPermissions.length) return true // no permission required = show always
      return requiredPermissions.every((perm) => this.authStore.permissions.includes(perm))
    },
    filteredChildren(children) {
      // Filter children by permission
      return children.filter((child) => this.hasPermission(child.permissions))
    },
    handleClick(item) {
      if (item.children) {
        if (this.openDropdowns[item.name]) {
          this.openDropdowns = {}
        } else {
          this.openDropdowns = { [item.name]: true }
        }
      } else {
        this.openDropdowns = {}
      }
    },
    isOpen(name) {
      return !!this.openDropdowns[name]
    },
    isActive(path) {
      return this.$route.path === path
    },
    expandActiveDropdowns() {
      this.menu.forEach((item) => {
        if (
          item.children &&
          item.children.some((sub) => this.$route.path.startsWith(sub.path))
        ) {
          this.openDropdowns = { [item.name]: true }
        }
      })
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.expandActiveDropdowns()
      },
    },
  },
}
</script>

<style scoped>
.sidebar {
  min-width: 250px;
  padding: 10px;
  min-height: 100vh;
}

.list-group {
  border-radius: 0%;
}

.list-group-item.text-decoration-none.text-white.li-pending {
  margin-top: 2px;
}

.list-group-item {
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.item-hover:hover,
.only-page {
  background-color: #007bff;
}

.list-group-item.active>a,
.list-group-item.active>.router-link-active {
  font-weight: bold;
  color: #007bff;
}

.router-link-active {
  text-decoration: none;
}

.list-group-item+.list-group-item {
  border-top-width: 0;
}

.li-pending {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.hover-page:hover{
  background-color: #007bff;
}
.active-page a span{
  font-weight: bold;
}
</style>
