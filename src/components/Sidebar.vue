<template>
  <div class="bg-dark border-end vh-100 sidebar" style="width: 250px;">
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        <router-link to="/" class="text-decoration-none">Dashboard</router-link>
      </li>
      <li class="list-group-item">
        <router-link to="/profile" class="text-decoration-none">Profile</router-link>
      </li>
      <li class="list-group-item">
        <router-link to="/settings" class="text-decoration-none">Settings</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
  transition: all 0.3s ease;
}
</style>
