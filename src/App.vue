<template>
  <div>
    <!-- Only show Navbar and Sidebar if route requires auth -->
    <Navbar v-if="showLayout" @toggle-sidebar="toggleSidebar" />

    <div class="d-flex">
      <Sidebar v-if="showLayout && showSidebar" />

      <!-- Main Content -->
      <div :class="{ 'flex-grow-1': showLayout, 'w-100': !showLayout }" class="p-0">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const showSidebar = ref(true)
const route = useRoute()

// Only show layout if route meta.requiresAuth is true
const showLayout = computed(() => route.meta.requiresAuth === true)

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}
</script>