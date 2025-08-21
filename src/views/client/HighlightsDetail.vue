<template>
  <div>
    <Header />
    <section class="py-3" aria-label="News Article">
      <div class="container">
        <div class="grid-content">
          <div class="border-card">
            <header class="bennertitle">
              <h1 class="section-title">🎬 {{ $t('highlights') }}</h1>
            </header>

            <div v-if="highlightsItem" itemscope itemtype="https://schema.org/NewsArticle">
              <article>
                <h1 class="mb-1" itemprop="headline">{{ highlightsItem.title }}</h1>

                <div class="text-muted mb-1 text-time color-time">
                  <i class="bi bi-clock"> </i> <time :datetime="highlightsItem.created_at" itemprop="datePublished">
                    {{
                      formatKhmerDate(highlightsItem.created_at) }}
                  </time>
                </div>

                <img :src="highlightsItem.image" :alt="highlightsItem.title" class="img-fluid mb-1" itemprop="image" />

                <div class="news-content" itemprop="articleBody" v-html="highlightsItem.content"></div>
              </article>
              <Share :newsItem="highlightsItem" />

            </div>

            <div v-else class="text-center">
              <p>កំពុងដំណើរការ...</p>
            </div>
          </div>

          <aside>
            <Ads />
            <Facebookpage />
          </aside>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/client/Header.vue'
import Footer from '@/components/client/Footer.vue'
import Ads from '@/components/client/Ads.vue'
import Facebookpage from '@/components/client/Facebookpage.vue'
import Share from '@/components/client/Share.vue'
import { onMounted, ref, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
// import { useHead } from '@vueuse/head'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const highlightsItem = ref(null)
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    // Remove diacritics but keep Khmer characters
    .replace(/[\u0300-\u036f]/g, '')
    // Allow Khmer (\u1780–\u17FF), Khmer symbols (\u19E0–\u19FF), English letters, numbers, spaces, and dashes
    .replace(/[^a-z0-9\u1780-\u17FF\u19E0-\u19FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}


const fetchHighlightsDetail = async (id) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/highlights/getbyid?id=${id}`)
    highlightsItem.value = response.data?.data || null
    
    if (highlightsItem.value) {
      // useHead({
      //   title: highlightsItem.value.title,
      //   meta: [
      //     { name: 'description', content: highlightsItem.value.detail?.substring(0, 150) || '' },
      //     { property: 'og:title', content: highlightsItem.value.title },
      //     { property: 'og:description', content: highlightsItem.value.detail?.substring(0, 150) || '' },
      //     { property: 'og:image', content: highlightsItem.value.image },
      //     { property: 'og:type', content: 'article' }
      //   ]
      // })
      const correctSlug = slugify(highlightsItem.value.title)
      if (route.params.slug !== correctSlug) {
        router.replace({
          name: 'highlights-detail',
          params: {
            id: highlightsItem.value.id,
            slug: correctSlug
          }
        })
      }
    }
  } catch (error) {
    console.error('Error loading highlights detail:', error)
  }
}
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
  fetchHighlightsDetail(id)
})

// Re-fetch if route changes
watch(() => route.params.id, (newId) => {
  fetchHighlightsDetail(newId)
})
</script>

<style scoped>
.news-content {
  line-height: 1.7;
  font-size: 1rem;
}
.news-content img{
  width: 100% !important;
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
