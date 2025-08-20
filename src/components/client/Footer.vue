<template>
  <section class="pt-3">
    <footer class="footer">
      <!-- Loading -->
      <div v-if="loading" class="text-center text-light py-2">
        Loading footers...
      </div>

      <!-- Footer Links -->
      <div v-else class="social-icons">
        <a
          v-for="footer in footers"
          :key="footer.id"
          :href="footer.redirect"
          target="_blank"
          :aria-label="footer.name"
        >
          <img
            :src="footer.image_url"
            :alt="footer.name"
            class="footer-icon"
          />
        </a>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const footers = ref([])
const loading = ref(true)

async function fetchFooters() {
  loading.value = true
  try {
    const { data } = await axios.get(`${apiBaseUrl}/api/footers_home`)
    footers.value = data?.data || []
  } catch (err) {
    console.error('Error fetching footers:', err)
    footers.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchFooters)
</script>

<style scoped>
.footer {
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 10px 0;
  background: #181818;
}

.social-icons a {
  margin: 0 15px;
  transition: 0.3s;
}

.footer-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: brightness(0) invert(1); /* make white if icon is dark */
  transition: 0.3s;
}

.social-icons a:hover .footer-icon {
  /* filter: none; */
  transform: scale(1.1);
}
</style>
