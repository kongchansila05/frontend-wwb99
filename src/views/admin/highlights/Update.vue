<template>
  <div class="px-2 py-2">
    <h2>Update highlights</h2>
    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Title -->
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          v-model.trim="form.title"
          type="text"
          id="title"
          class="form-control"
          :class="{ 'is-invalid': errors.title }"
          @blur="validateField('title')"
          required
        />
        <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
      </div>

      <!-- Image -->
      <div class="mb-3">
        <label for="image" class="form-label">Image URL</label>
        <input
          v-model.trim="form.image"
          type="text"
          id="image"
          class="form-control"
          :class="{ 'is-invalid': errors.image }"
          @blur="validateField('image')"
          required
        />
        <div v-if="errors.image" class="invalid-feedback">{{ errors.image }}</div>
      </div>

      <!-- Created By -->
      <div class="mb-3">
        <label for="created_by" class="form-label">Created By</label>
        <input
          v-model.trim="form.created_by"
          type="text"
          id="created_by"
          class="form-control"
          :class="{ 'is-invalid': errors.created_by }"
          @blur="validateField('created_by')"
          required
        />
        <div v-if="errors.created_by" class="invalid-feedback">{{ errors.created_by }}</div>
      </div>

      <!-- Content -->
      <div class="mb-3">
        <label for="content" class="form-label">Content</label>
        <Editor v-model="form.content" />
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
        Update
      </button>
    </form>

    <!-- Preview -->
    <div v-if="form.title" class="mt-5">
      <h4>📄 Preview</h4>
      <div class="card">
        <img :src="form.image" class="card-img-top" alt="Preview Image" />
        <div class="card-body">
          <h5 class="card-title">{{ form.title }}</h5>
          <p class="text-muted">Created by: {{ form.created_by }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Editor from '@/components/Editor.vue';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const route = useRoute();
const router = useRouter();
// ✅ Get id from query parameter (for /admin/highlights/update?id=25)
const highlightsId = route.query.id;

const form = reactive({
  id: '',
  title: '',
  image: '',
  created_by: '',
  content: '',
});

const errors = reactive({
  id: '',
  title: '',
  image: '',
  created_by: '',
  content: '',
});

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateField(field) {
  switch (field) {
    case 'title':
      errors.title = form.title.length < 5 ? 'Title must be at least 5 characters.' : '';
      break;
    case 'image':
      errors.image = !isValidUrl(form.image) ? 'Please enter a valid image URL.' : '';
      break;
    case 'created_by':
      errors.created_by = form.created_by.length < 3 ? 'Created By must be at least 3 characters.' : '';
      break;
    case 'content':
      errors.content = form.content.length < 10 ? 'Content must be at least 10 characters.' : '';
      break;
  }
}

const isFormValid = computed(() => {
  return (
    form.title.length >= 5 &&
    isValidUrl(form.image) &&
    form.created_by.length >= 3 &&
    !errors.title &&
    !errors.image &&
    !errors.created_by &&
    !errors.content
  );
});

// ✅ Fetch and populate form
async function fetchHighlightsDetail() {
  try {
    const { data } = await axios.get(`${apiBaseUrl}/api/highlights/getbyid?id=${highlightsId}`);
    const highlights = data?.data;
    if (highlights) {
      form.id = highlights.id;
      form.title = highlights.title;
      form.image = highlights.image;
      form.created_by = highlights.created_by;
      form.content = highlights.content;
    }
  } catch (error) {
    Swal.fire('❌ Error', 'Failed to load highlights details.', 'error');
    console.error(error);
  }
}

async function handleSubmit() {
  ['title', 'image', 'detail', 'created_by', 'content'].forEach(validateField);

  if (!isFormValid.value) {
    alert('Please fix the errors before submitting.');
    return;
  }
  try {
    const { data } = await axios.put(`${apiBaseUrl}/api/highlights/update`, form);
    Swal.fire('✅ Updated!', data.message || 'Highlights updated successfully!', 'success');
    setTimeout(() => router.push('/admin/highlights'), 1000);
  } catch (error) {
    const message = error?.response?.data?.message || 'Something went wrong during update.';
    Swal.fire('❌ Error', message, 'error');
    console.error('Update error:', error);
  }
}

onMounted(() => {
  if (highlightsId) fetchHighlightsDetail();
});
</script>

<style scoped>
</style>
