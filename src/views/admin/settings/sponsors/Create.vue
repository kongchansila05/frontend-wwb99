<template>
  <div class="px-2 py-2">
    <h2>Create Sponsor</h2>

    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Name -->
      <div class="mb-3">
        <label for="name" class="form-label">Sponsor Name</label>
        <input
          v-model.trim="form.name"
          type="text"
          id="name"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          @blur="validateField('name')"
          required
        />
        <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
      </div>

      <!-- Logo URL -->
      <div class="mb-3">
        <label for="image_url" class="form-label">Logo URL</label>
        <input
          v-model.trim="form.image_url"
          type="text"
          id="image_url"
          class="form-control"
          :class="{ 'is-invalid': errors.image_url }"
          @blur="validateField('image_url')"
          required
        />
        <div v-if="errors.image_url" class="invalid-feedback">{{ errors.image_url }}</div>
      </div>

      <!-- Website URL -->
      <div class="mb-3">
        <label for="redirect" class="form-label">Website Link</label>
        <input
          v-model.trim="form.redirect"
          type="text"
          id="redirect"
          class="form-control"
          :class="{ 'is-invalid': errors.redirect }"
          @blur="validateField('redirect')"
          required
        />
        <div v-if="errors.redirect" class="invalid-feedback">{{ errors.redirect }}</div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="btn btn-success"
        :disabled="!isFormValid"
      >
        Create
      </button>
    </form>

    <!-- Preview -->
    <div v-if="form.name" class="mt-5">
      <h4>📄 Preview</h4>
      <div class="card text-center">
        <img :src="form.image_url" class="card-img-top mx-auto mt-2" style="max-width:150px" alt="Sponsor Logo" />
        <div class="card-body">
          <h5 class="card-title">{{ form.name }}</h5>
          <a :href="form.redirect" target="_blank" class="btn btn-primary btn-sm mt-2">Visit Website</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const router = useRouter()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const form = reactive({
  name: '',
  image_url: '',
  redirect: '',
});

const errors = reactive({
  name: '',
  image_url: '',
  redirect: '',
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
    case 'name':
      errors.name = form.name.length < 2 ? 'Name must be at least 2 characters.' : '';
      break;
    case 'image_url':
      errors.image_url = !isValidUrl(form.image_url) ? 'Please enter a valid image URL.' : '';
      break;
    case 'redirect':
      errors.redirect = !isValidUrl(form.redirect) ? 'Please enter a valid website URL.' : '';
      break;
  }
}

const isFormValid = computed(() => {
  return (
    form.name.length >= 2 &&
    isValidUrl(form.image_url) &&
    isValidUrl(form.redirect) &&
    !errors.name &&
    !errors.image_url &&
    !errors.redirect
  );
});

async function handleSubmit() {
  ['name', 'image_url', 'redirect'].forEach(validateField);

  if (!isFormValid.value) {
    alert('Please fix the errors before submitting.');
    return;
  }

  try {
    const { data } = await axios.post(`${apiBaseUrl}/api/sponsors/create`, form);

    Swal.fire('✅ Success!', data.message || 'Sponsor created successfully!', 'success');

    // Reset form after success
    form.name = '';
    form.image_url = '';
    form.redirect = '';
    Object.keys(errors).forEach(key => (errors[key] = ''));

    setTimeout(() => router.push('/admin/settings/sponsors'), 1000);
  } catch (error) {
    const message = error?.response?.data?.message || 'Something went wrong.';
    Swal.fire('❌ Error', message, 'error');
    console.error('Submission error:', error);
  }
}
</script>
