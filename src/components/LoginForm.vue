<template>
  <div class="login-wrapper">
    <div class="container">
      <div class="row justify-content-center align-items-center vh-100">
        <div class="col-md-4">
          <div class="card mt-5">
            <div class="card-body">
              <h3 class="card-title text-center mb-2">
                <img src="https://wwb99.news/wp-content/uploads/2025/04/WWB99.png" alt="Logo"
                  class="img-fluid logo-img" />
              </h3>

              <!-- ✅ Error Alert -->
              <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ error }}
                <button type="button" class="btn-close" @click="error = ''"></button>
              </div>

              <!-- ✅ Success Alert -->
              <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
                {{ success }}
                <button type="button" class="btn-close" @click="success = ''"></button>
              </div>

              <!-- Username -->
              <div class="mb-3">
                <label for="username" class="form-label text-white">Username</label>
                <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username" />
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label text-white">Password</label>
                <div class="input-group">
                  <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control"
                    id="password" placeholder="Enter password" />
                  <button class="btn btn-light" type="button" @click="togglePassword">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- Login Button -->
              <div class="d-grid gap-2">
                <button class="btn btn-login" @click="handleLogin">Login</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../views/stores/auth'

const router = useRouter()
const userStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const showPassword = ref(false)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  error.value = ''
  success.value = ''
  try {
    const response = await axios.post(`${apiBaseUrl}/api/login`, {
      username: username.value,
      password: password.value,
    })

    // ✅ Use store actions instead of localStorage directly
    userStore.setToken(response.data.access_token)
    userStore.setUsername(response.data.user.username)
    userStore.setPermissions(response.data.user.permissions)

    success.value = 'Login successful!'
    setTimeout(() => {
      router.push('/admin/news')
    }, 1000)
  } catch (err) {
    error.value = 'Invalid credentials'
  }
}
</script>

<style scoped>
.login-wrapper {
  background: url('https://wwb99.news/wp-content/uploads/2021/12/bg4.jpg') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
}

.card {
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.85);
}

.card-title img {
  max-height: 80px;
  object-fit: contain;
}

.login-wrapper .card {
  background: linear-gradient(122deg, #10122da6, #2b7d2d6b);
  border: 2px solid #ffd9b2;
  border-radius: 30px;
}
.btn-login{
      background-image: linear-gradient(#d5ab51, #b48b33) !important;
      border-radius: 25px;
}
</style>