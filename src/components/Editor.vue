<template>
  <div ref="quillRoot" style="min-height: 600px; width: 100%;"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Quill from 'quill'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const quillRoot = ref(null)
let quill

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean']
];

onMounted(() => {
  quill = new Quill(quillRoot.value, {
    theme: 'snow',
    modules: { toolbar: toolbarOptions }
  })

  // Set initial value
  quill.root.innerHTML = props.modelValue || ''

  // Emit on change
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML)
  })
})

// ✅ Watch for external modelValue changes (from API)
watch(
  () => props.modelValue,
  (newValue) => {
    if (quill && quill.root.innerHTML !== newValue) {
      quill.root.innerHTML = newValue || ''
    }
  }
)
</script>
