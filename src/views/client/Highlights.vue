<template>
  <div>
    <Header />
    <section class="py-3" aria-label="Match Highlights">
      <div class="container">
        <div class="grid-content">
          <div>
            <header class="bennertitle mb-2">
              <h1 class="section-title">🎬 Highlights</h1>
            </header>

            <div>
              <article
                class="post grid-content-list"
                v-for="item in highlights"
                :key="item.id"
                itemscope
                itemtype="https://schema.org/VideoObject"
              >
                <div>
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="img-responsive"
                    itemprop="thumbnailUrl"
                  />
                </div>

                <div>
                  <header class="title">
                    <h2 class="text-2-lines" itemprop="name">{{ item.title }}</h2>
                    <div class="small">
                      <ul>
                        <li>
                          <i class="bi bi-clock"> </i> 
                          <time
                            class="pub-date"
                            :datetime="item.created_at"
                            itemprop="uploadDate"
                          >
                            {{ formatKhmerDate( item.created_at) }}
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

              <!-- Pagination Buttons -->
              <nav
                class="pagination d-flex justify-content-center mt-3 flex-wrap gap-2"
                aria-label="Highlights Pagination"
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
import Ads from '@/components/client/Ads.vue'
import Facebookpage from '@/components/client/Facebookpage.vue'

import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

// ✅ SEO with @vueuse/head
import { useHead } from '@vueuse/head'

useHead({
  title: 'Latest Match Highlights | WWB99',
  meta: [
    { name: 'description', content: 'Watch the latest football and sports highlights brought to you by WWB99.' },
    { property: 'og:title', content: 'Latest Match Highlights | WWB99' },
    { property: 'og:description', content: 'Catch up on top match replays, goals, and sports video highlights.' },
    { property: 'og:type', content: 'website' }
  ]
})

const highlights = ref([])

const currentPage = ref(1)
const totalPages = ref(1)
const perPage = 10

const fetchHighlights = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/highlights?page=${currentPage.value}&limit=${perPage}`)
    const result = response.data
    highlights.value = result.data || []
    totalPages.value = result.totalPages || 1
  } catch (error) {
    console.error('Failed to fetch Highlights:', error)
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

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(() => {
  fetchHighlights()
})

watch(currentPage, () => {
  fetchHighlights()
})
</script>

<style scoped>
/* You can add more semantic-friendly styles here if needed */
</style>
