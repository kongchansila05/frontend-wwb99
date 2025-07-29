<template>
  <div>
    <Header />
    <section class="py-3" aria-label="News Article">
      <div class="container">
        <div class="grid-content">
          <div>
            <header class="bennertitle">
              <h1 class="section-title">📰 News</h1>
            </header>

            <div v-if="newsItem" itemscope itemtype="https://schema.org/NewsArticle">
              <article>
                <h1 class="mb-1" itemprop="headline">{{ newsItem.title }}</h1>

                <div class="text-muted mb-1 text-time color-time">
                  <i class="bi bi-clock"> </i> <time :datetime="newsItem.created_at" itemprop="datePublished">
                    {{
                      formatKhmerDate(newsItem.created_at) }}
                  </time>
                </div>

                <img :src="newsItem.image" :alt="newsItem.title" class="img-fluid mb-1" itemprop="image" />

                <div class="news-content" itemprop="articleBody" v-html="newsItem.detail"></div>
              </article>
              <Share :newsItem="newsItem" />

            </div>

            <div v-else class="text-center">
              <p>កំពុងដំណើរការ...</p>
            </div>
          </div>

          <aside>
            <Ads />
            <!-- <Facebookpage /> -->
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Header from '@/components/client/Header.vue'
import Ads from '@/components/client/Ads.vue'
// import Facebookpage from '@/components/client/Facebookpage.vue'
import Share from '@/components/client/Share.vue'

import { onMounted, ref, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useHead } from '@vueuse/head'
import { useMeta } from 'vue-meta'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const newsItem = ref(null)

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const fetchNewsDetail = async (id) => {
  try {
    const response = await axios.get(`${proxy.$apiBaseUrl}/api/news/getbyid?id=${id}`)
    newsItem.value = response.data?.data || null

    if (newsItem.value) {
      useHead({
        title: newsItem.value.title,
        meta: [
          { name: 'description', content: newsItem.value.detail?.substring(0, 150) || '' },
          { property: 'og:title', content: newsItem.value.title },
          { property: 'og:description', content: newsItem.value.detail?.substring(0, 150) || '' },
          { property: 'og:image', content: newsItem.value.image },
          { property: 'og:type', content: 'article' }
        ]
      })

      const correctSlug = slugify(newsItem.value.title)
      if (route.params.slug !== correctSlug) {
        router.replace({
          name: 'news-detail',
          params: {
            id: newsItem.value.id,
            slug: correctSlug
          }
        })
      }
    }
  } catch (error) {
    console.error('Error loading news detail:', error)
  }
}

// ✅ Use vue-meta to update dynamic meta tags
watchEffect(() => {
  if (newsItem.value) {
    useMeta({
      title: newsItem.value.title,
      meta: [
        { name: 'description', content: newsItem.value.detail?.substring(0, 150) || '' },
        { property: 'og:title', content: newsItem.value.title },
        { property: 'og:description', content: newsItem.value.detail?.substring(0, 150) || '' },
        { property: 'og:image', content: newsItem.value.image },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: window.location.href }
      ]
    })
  }
})
// Khmer date formatting
const formatKhmerDate = (dateString) => {
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Intl.DateTimeFormat('km-KH', options).format(new Date(dateString))
}

// Initial load
onMounted(() => {
  const id = route.params.id
  fetchNewsDetail(id)
})

// Re-fetch if route changes
watch(() => route.params.id, (newId) => {
  fetchNewsDetail(newId)
})
</script>

<style scoped>
.news-content {
  line-height: 1.7;
  font-size: 1rem;
}

h1 {
  line-height: 2;
  font-size: 1.5rem;
}

.text-time {
  font-size: 1rem;
}

article:hover {
  border-radius: unset !important;
  background-color: unset !important;
  overflow: unset !important;
}

h1 {
  line-height: unset !important;
}

.section-title {
  margin-bottom: unset !important;
}
</style>
