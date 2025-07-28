<template>
  <div class="mt-3">
    <div class="d-flex gap-2 share-buttons flex-wrap">
      <!-- Facebook -->
      <a
        :href="`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`"
        target="_blank"
        rel="noopener"
        class="btn btn-sm btn-primary"
      >
        <i class="bi bi-facebook"></i> Facebook
      </a>

      <!-- Telegram -->
      <a
        :href="`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`"
        target="_blank"
        rel="noopener"
        class="btn btn-sm btn-info text-white"
      >
        <i class="bi bi-telegram"></i> Telegram
      </a>

      <!-- Native Share (Mobile Only) -->
      <button @click="shareNative" class="btn btn-sm btn-secondary d-sm-none">
        <i class="bi bi-share-fill"></i> App
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { defineProps } from 'vue'

// Receive `newsItem` as a prop from parent
const props = defineProps({
  newsItem: {
    type: Object,
    required: true
  }
})

// Get the current full URL
const route = useRoute()
const currentUrl = window.location.origin + route.fullPath

// Encode title and URL
const encodedTitle = computed(() =>
  encodeURIComponent(props.newsItem?.title || 'Check out this article!')
)
const encodedUrl = encodeURIComponent(currentUrl)

// Native Share (mobile)
const shareNative = () => {
  if (navigator.share && props.newsItem) {
    navigator
      .share({
        title: props.newsItem.title,
        text: props.newsItem.title,
        url: currentUrl
      })
      .then(() => console.log('Shared successfully'))
      .catch((err) => console.error('Error sharing:', err))
  } else {
    alert('Native sharing is not supported on this device.')
  }
}
</script>
