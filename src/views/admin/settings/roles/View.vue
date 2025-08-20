<template>
  <div class="px-2 py-2">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">List Roles</h2>
      <router-link to="#" class="btn btn-success" @click="openCreateModal()">
        <i class="bi bi-plus-circle"></i> Add Role
      </router-link>
    </div>

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
          placeholder="🔍 Search role name..."
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
            <th @click="sortBy('id')">
              <i :class="sortIcon('id')"></i>
            </th>
            <th @click="sortBy('name')">
              Role Name <i :class="sortIcon('name')"></i>
            </th>
            <th @click="sortBy('created_at')">
              Created At <i :class="sortIcon('created_at')"></i>
            </th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rolesData" :key="item.ID">
            <th scope="row">{{ index + 1 + (page - 1) * limit }}</th>
            <td>{{ item.Name }}</td>
            <td>{{ formatDate(item.CreatedAt) }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-primary me-1" @click="openEditModal(item)">
                <i class="bi bi-pencil-square"></i> Update
              </button>
              <router-link  :to="{ name: 'role-assign', params: { id: item.ID } }" class="btn btn-info me-1">
                <i class="bi bi-view-list"></i> Assign Permissions 
              </router-link>
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

    <!-- Update Role Modal -->
    <div class="modal fade" id="updateRoleModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Update Role</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Role Name</label>
              <input type="text" v-model="editForm.name" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" @click="updateRole">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Role Modal -->
    <div class="modal fade" id="createRoleModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Role</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Role Name</label>
              <input 
                type="text" 
                v-model="createForm.name" 
                class="form-control" 
                placeholder="Enter role name"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" @click="createRole">Create</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'

const rolesData = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const search = ref('')
const sortField = ref('created_at')
const sortOrder = ref('desc')
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Debounce
function debounce(fn, delay = 500) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

const createForm = ref({ name: "" })
let createModal = null

const editForm = ref({ id: null, name: '' })
let updateModal = null

function openEditModal(item) {
  editForm.value.id = item.ID
  editForm.value.name = item.Name
  updateModal = new Modal(document.getElementById('updateRoleModal'))
  updateModal.show()
}
async function updateRole() {
  if (!editForm.value.name.trim()) {
    return Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Role Name is required.' })
  }

  try {
    const { data } = await axios.put(`${apiBaseUrl}/api/roles/update`, {
      ID: editForm.value.id,
      Name: editForm.value.name
    })
    updateModal.hide()
    Swal.fire({ icon: 'success', title: 'Updated!', text: data.message || 'Role updated successfully.', timer: 2000, showConfirmButton: false })
    fetchRoles()
  } catch (err) {
    console.error(err)
    Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error updating role' })
  }
}

const openCreateModal = () => {
  createForm.value.name = ""
  createModal = new Modal(document.getElementById('createRoleModal'))
  createModal.show()
}
const createRole = async () => {
  try {
    const { data } = await axios.post(`${apiBaseUrl}/api/roles/create`, {
      Name: createForm.value.name
    })
    createModal.hide()
    Swal.fire({ icon: 'success', title: 'Created!', text: data.message || 'Role created successfully.', timer: 2000, showConfirmButton: false })
    fetchRoles()
  } catch (err) {
    console.error(err)
    Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Error creating role' })
  }
}

const fetchRoles = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: page.value,
      limit: limit.value,
      search: search.value,
      sortBy: sortField.value,
      order: sortOrder.value,
    })

    const res = await fetch(`${apiBaseUrl}/api/roles?${params}`)
    const result = await res.json()
    rolesData.value = result.data
    total.value = result.total
    totalPages.value = result.totalPages
  } catch (error) {
    console.error('Error fetching roles:', error)
  } finally {
    loading.value = false
  }
}

// Search debounce
const onSearch = debounce(() => {
  page.value = 1
  fetchRoles()
}, 500)

const onLimitChange = () => {
  page.value = 1
  fetchRoles()
}

// Sorting
const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  fetchRoles()
}
const sortIcon = (field) => {
  if (sortField.value !== field) return 'bi bi-arrow-down-up'
  return sortOrder.value === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down'
}

// Pagination
const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchRoles()
  }
}
const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    fetchRoles()
  }
}

// Format date
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

onMounted(fetchRoles)
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}
.form-control:focus {
  border-color: #7a7a7a !important;
}
</style>
