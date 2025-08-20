<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <h1>403</h1>
      <p>You don’t have permission to access this page.</p>
      <router-link to="/" class="back-btn">Go Back Home</router-link>
    </div>
  </div>
</template>

<script setup>
// no script needed unless you want extra logic
</script>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background: #f9f9f9;
  padding: 20px;
}

.forbidden-content {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.forbidden-content h1 {
  font-size: 80px;
  margin: 0;
  color: #ff4d4f;
}

.forbidden-content p {
  font-size: 18px;
  margin: 10px 0 20px;
  color: #555;
}

.back-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #1890ff;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #096dd9;
}
</style>
