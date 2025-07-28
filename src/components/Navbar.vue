<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
    <button class="btn btn-outline-light me-2" @click="$emit('toggle-sidebar')">
      <i class="bi bi-list"></i>
    </button>

    <div class="ms-auto" v-if="isAuthenticated">
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle" type="button" id="profileDropdown"
          data-bs-toggle="dropdown" aria-expanded="false">
          {{ username }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
          <li class="block-profile">
            <a class="dropdown-item" @click="handleLogout">
               <i class="bi bi-box-arrow-right"></i> Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const username = ref('')
  const isAuthenticated = ref(false)

  onMounted(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('username')
    isAuthenticated.value = !!token
    username.value = user || 'Profile'
  })

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }
</script>
<style scoped>
.block-profile .dropdown-item{
  cursor: pointer;
}

</style>