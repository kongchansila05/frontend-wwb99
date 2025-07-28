<template>
  <div>
    <Header />
    <section class="py-3" aria-label="Latest News">
      <div class="container">
        <div class="grid-content">
          <div>
            <header class="bennertitle mb-2">
              <h1 class="section-title">📰 News</h1>
            </header>
            <div>
              <article
                v-for="item in news"
                :key="item.id"
                class="post grid-content-list"
                @click="goToDetail(item)"
                style="cursor: pointer"
                itemscope
                itemtype="https://schema.org/NewsArticle"
              >
                <div>
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="img-responsive"
                    itemprop="image"
                  />
                </div>
                <div>
                  <header class="title">
                    <h2 class="text-2-lines" itemprop="headline">{{ item.title }}</h2>
                    <div class="small">
                      <ul>
                        <li>
                          <i class="bi bi-clock"></i>
                          <time
                            class="pub-date"
                            :datetime="item.created_at"
                            itemprop="datePublished"
                          >
                            {{ formatKhmerDate(item.created_at) }}
                          </time>
                        </li>
                      </ul>
                    </div>
                  </header>
                  <div class="myExcerpt">
                    <p class="text-1-lines" itemprop="description">{{ item.detail }}</p>
                  </div>
                </div>
              </article>

              <!-- Pagination -->
              <nav
                class="pagination d-flex justify-content-center mt-3 flex-wrap gap-2"
                aria-label="News Pagination"
              >
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="btn btn-sm btn-secondary"
                >
                  Prev
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="['btn', 'btn-sm', page === currentPage ? 'bg-primary' : 'btn-outline-secondary']"
                >
                  {{ page }}
                </button>
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="btn btn-sm btn-secondary"
                >
                  Next
                </button>
              </nav>
              <!-- End Pagination -->
            </div>
          </div>

          <!-- Sidebar -->
          <aside>
            <Ads />
            <Facebookpage />
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Header from '@/components/client/Header.vue'
import Facebookpage from '@/components/client/Facebookpage.vue'
import Ads from '@/components/client/Ads.vue'
import { ref, onMounted, watch ,getCurrentInstance} from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
// SEO Head Setup
import { useHead } from '@vueuse/head'

useHead({
  title: 'Latest News | WWB99',
  meta: [
    { name: 'description', content: 'Read the latest sports and trending news on WWB99.' },
    { property: 'og:title', content: 'Latest News | WWB99' },
    { property: 'og:description', content: 'Stay updated with the most recent news, articles, and highlights from around the world.' },
    { property: 'og:type', content: 'website' },
  ]
})

const news = ref([])
const router = useRouter()
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 10

const fetchNews = async () => {
  try {
    const response = await axios.get(`${proxy.$apiBaseUrl}api/news?page=${currentPage.value}&limit=${perPage}`)
    const result = response.data

    news.value = result.data || []
    totalPages.value = result.totalPages || 1
  } catch (error) {
    console.error('Failed to fetch news:', error)
  }
}

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

const goToDetail = (item) => {
  const slug = slugify(item.title)
  router.push({ name: 'news-detail', params: { id: item.id, slug } })
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(() => {
  fetchNews()
})

watch(currentPage, () => {
  fetchNews()
})
</script>

<style scoped>
/* Add any scoped CSS for better styling and structure */
</style>
