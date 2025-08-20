<template>
  <div class="px-2 py-2">
    <h2>Set Permission for: {{ roleName }}</h2>

    <div v-for="(group, module) in groupedPermissions" :key="module" class="mb-3">
      <label class="form-check-label fw-bold">
        <input
          type="checkbox"
          class="form-check-input me-1"
          :checked="isAllChecked(module)"
          @change="toggleModule(module, $event.target.checked)"
        />
        {{ module }}
      </label>
      <div class="ms-3">
        <div v-for="perm in group" :key="perm.ID" class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            :id="'perm-' + perm.ID"
            :value="perm.ID"
            v-model="selectedPermissions"
          />
          <label class="form-check-label" :for="'perm-' + perm.ID">{{ perm.Name }}</label>
        </div>
      </div>
    </div>

    <button class="btn btn-primary" @click="savePermissions">Save Permissions</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2';
const route = useRoute()
const id = route.params.id
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const roleName = ref('')
const permissions = ref([])
const selectedPermissions = ref([])
const groupedPermissions = ref({})
const fetchRolePermissions = async () => {
  try {
    const GetPermmissionById = await axios.get(`${apiBaseUrl}/api/roles/getbyid?id=${id}`)
    const roleData = GetPermmissionById.data.data
    roleName.value = GetPermmissionById.data.data.Name

    const resPerms = await axios.get(`${apiBaseUrl}/api/roles/permissions`)
    permissions.value = resPerms.data.data
    // Set selected permissions
    selectedPermissions.value = roleData.Permissions.map(p => p.ID)
  // Group permissions by module prefix
  const groups = {}
  permissions.value.forEach(p => {
    const parts = p.Name.split('-')
    const module = parts[0]
    if (!groups[module]) groups[module] = []
    groups[module].push(p)
  })
  groupedPermissions.value = groups
  } catch (err) {
    console.error(err)
  }
}

// Check if all permissions in module are selected
const isAllChecked = (module) => {
  const allIds = groupedPermissions.value[module].map(p => p.ID)
  return allIds.every(id => selectedPermissions.value.includes(id))
}

// Toggle all permissions in a module
const toggleModule = (module, checked) => {
  const allIds = groupedPermissions.value[module].map(p => p.ID)
  if (checked) {
    allIds.forEach(id => {
      if (!selectedPermissions.value.includes(id)) selectedPermissions.value.push(id)
    })
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(id => !allIds.includes(id))
  }
}

// Save permissions (simulated)
const savePermissions = async () => {
  try {
    const roleId = route.params.id
    const formData = {
      ID: Number(roleId),
      permissions: selectedPermissions.value
    }
    const res = await axios.put(`${apiBaseUrl}/api/roles/assign`, formData);
    if (res.data.status) {
      Swal.fire('✅ Success!', res.data.message, 'success');
    } else {
      Swal.fire('Failed to save permissions:', res.data.message, 'error');
    }
  } catch (err) {
    console.error(err)
    alert('Error saving permissions: ' + (err.response?.data?.message || err.message))
  }
}


onMounted(fetchRolePermissions)
</script>

<style scoped>
.form-check-input {
  cursor: pointer;
}
.fw-bold {
  font-weight: 600;
}
</style>
