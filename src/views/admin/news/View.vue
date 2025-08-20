<template>
  <div class="px-2 py-2">
    <h2>List News</h2>
    <!-- Search and Limit Filter -->
    <div class="row mb-1 g-2 justify-content-between align-items-center">
      <div class="col-auto">
        <label class="form-label me-2">Show</label>
        <select v-model.number="limit" @change="onLimitChange" class="form-select d-inline-block w-auto">
          <option :value="10">10</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
      <div class="col-auto">
        <input
          v-model="search"
          @input="onSearch"
          type="text"
          class="form-control"
          placeholder="🔍 Search title..."
        />
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="table-responsive">
      <table class="table table-hover table-bordered align-middle">
        <thead class="table-dark">
          <tr>
            <th @click="sortBy('id')" style="cursor: pointer">
              <i :class="sortIcon('id')"></i>
            </th>
            <th>Image</th>
            <th @click="sortBy('title')" style="cursor: pointer" class="title">
              Title <i :class="sortIcon('title')"></i>
            </th>
            <th @click="sortBy('created_by')" style="cursor: pointer">
              Author <i :class="sortIcon('created_by')"></i>
            </th>
            <th @click="sortBy('created_at')" style="cursor: pointer">
              Created At <i :class="sortIcon('created_at')"></i>
            </th>
            <th style="cursor: pointer " class="text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in newsData" :key="item.id">
            <th scope="row">{{ index + 1 + (page - 1) * limit }}</th>
            <td>
              <img @click.prevent="openModal(item)"
                :src="item.image"
                alt="news image"
                class="img-thumbnail"
                style="max-width: 100px; height: auto;cursor: pointer"
              />
            </td>
            <td class="title-td">
              <a href="#" style="text-decoration:none; color: inherit;">
                {{ item.title }}
              </a>
            </td>
            <td>{{ item.created_by }}</td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-primary me-1" @click="editItem(item)" v-if="hasPermission('NEW-View')">
                <i class="bi bi-pencil-square"></i> Update
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteItem(item.id)" v-if="hasPermission('NEW-Delete')">
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-1">
      <div>
        Showing {{ (page - 1) * limit + 1 }} to
        {{ Math.min(page * limit, total) }} of {{ total }} entries
      </div>
      <div>
        <button
          class="btn btn-sm btn-outline-secondary me-2"
          :disabled="page === 1"
          @click="prevPage"
        >
          ← Previous
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          :disabled="page === totalPages"
          @click="nextPage"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: modalVisible }"
      :style="{ display: modalVisible ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }"
      @click.self="closeModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">{{ selectedArticle.title }}</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img
              v-if="selectedArticle.image"
              :src="selectedArticle.image"
              alt="Article Image"
              class="img-fluid mb-3"
            />
            <p><strong>Author:</strong> {{ selectedArticle.created_by }} <strong>Created At:</strong> {{ formatDate(selectedArticle.created_at) }} </p>
            <p name="detail" class="form-control"> 
              <strong>Detail :</strong> {{ selectedArticle.detail }}
            </p>
            <hr />
            <p v-html="selectedArticle.content || 'No content available.'"></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '..//../stores/auth.js';
const { hasPermission } = useAuthStore();
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'
const newsData = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const search = ref('')
const sortField = ref('created_at')
const sortOrder = ref('desc')
import { useRouter } from 'vue-router'
const router = useRouter()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
// Modal state
const modalVisible = ref(false)
const selectedArticle = ref({})
// Debounce utility
function debounce(fn, delay = 500) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}
function editItem(item) {
  router.push({ path: '/admin/news/update', query: { id: item.id } })
}
const deleteItem = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this item!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`${apiBaseUrl}/api/news/delete?id=${id}`)
      .then((response) => {
        Swal.fire('Deleted!', response.data.message || 'Your item has been deleted.', 'success')
        fetchNews()
      }).catch((error) => {
        console.error(error)
        Swal.fire('Error!', 'Something went wrong.', 'error')
      })
    }
  })
}
// Fetch data
const fetchNews = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: page.value,
      limit: limit.value,
      search: search.value,
      sortBy: sortField.value,
      order: sortOrder.value,
    })

    const res = await fetch(`${apiBaseUrl}/api/news?${params}`)
    const result = await res.json()

    newsData.value = result.data
    total.value = result.total
    totalPages.value = result.totalPages
  } catch (error) {
    console.error('Error fetching news:', error)
  } finally {
    loading.value = false
  }
}

// Debounced search input handler
const onSearch = debounce(() => {
  page.value = 1
  fetchNews()
}, 500)

// When limit selector changes
const onLimitChange = () => {
  page.value = 1
  fetchNews()
}

// Sort by column handler
const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  fetchNews()
}

// Return icon class for sorting arrows
const sortIcon = (field) => {
  if (sortField.value !== field) return 'bi bi-arrow-down-up'
  return sortOrder.value === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down'
}

// Pagination handlers
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchNews()
  }
}
const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    fetchNews()
  }
}

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Modal open/close functions
const openModal = (article) => {
  selectedArticle.value = article
  modalVisible.value = true
  document.body.classList.add('modal-open')
}

const closeModal = () => {
  modalVisible.value = false
  document.body.classList.remove('modal-open')
}

onMounted(fetchNews)
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}
/* Modal fade effect */
.modal {
  transition: opacity 0.15s linear;
}
.modal-open {
  overflow: hidden;
}

</style>
