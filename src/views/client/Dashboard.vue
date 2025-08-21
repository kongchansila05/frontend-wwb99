<template>
  <div>
    <Header />

    <!-- ⚽ LIVESCORE Section -->
    <section id="livescore" class="py-3" itemscope itemtype="https://schema.org/SportsEvent">
      <div class="container">
        <header class="d-flex justify-content-between align-items-center">
          <h1 class="section-title">⚽ {{ $t('livescore') }}</h1>
          <a href="#" class="text-gold text-decoration-none text-more">{{ $t('moreLivescore') }}</a>
        </header>

        <div class="row g-3">
          <div class="grid-score">
            <div
              class="match-card p-3 border-shadow"
              v-for="match in matches"
              :key="match.id"
              itemprop="subEvent"
              itemscope
              itemtype="https://schema.org/SportsEvent"
            >
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="match-status" itemprop="eventStatus">{{ match.status }}</span>
                <small class="text-secondary-custom" itemprop="name">{{ match.league }}</small>
              </div>

              <!-- Team 1 -->
              <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center flex-grow-1">
                  <img
                    :src="match.team1.logo"
                    :alt="match.team1.name"
                    class="team-logo"
                    itemprop="competitor"
                  />
                  <span class="text-primary-custom">{{ match.team1.name }}</span>
                </div>
                <span class="score mx-2">{{ match.team1.score }}</span>
              </div>

              <!-- Team 2 -->
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center flex-grow-1">
                  <img
                    :src="match.team2.logo"
                    :alt="match.team2.name"
                    class="team-logo"
                    itemprop="competitor"
                  />
                  <span class="text-primary-custom">{{ match.team2.name }}</span>
                </div>
                <span class="score mx-2">{{ match.team2.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 📰 NEWS Section -->
    <section class="py-2" itemscope itemtype="https://schema.org/Blog">
      <div class="container">
        <header class="d-flex justify-content-between align-items-center">
          <h2 class="section-title">📰 {{ $t('news') }}</h2>
          <router-link
            to="/news"
            class="text-gold text-decoration-none text-more"
            exact-active-class="active"
          >
            {{ $t('moreNews') }}
          </router-link>
        </header>

        <div class="grid-4 g-4">
          <article
            v-for="item in news"
            :key="item.id"
            @click="goToDetail(item,'news-detail')"
            class="card news-card h-100 border-shadow"
            itemscope
            itemtype="https://schema.org/NewsArticle"
          >
            <img
              :src="item.image"
              class="card-img-top"
              :alt="item.title"
              itemprop="image"
              style="height: 200px; object-fit: cover;"
            />
            <div class="card-body p-3">
              <h3 class="card-title text-primary-custom mb-2 text-1-lines" itemprop="headline">
                {{ item.title }}
              </h3>
              <div class="card-text text-secondary-custom small text-2-lines" itemprop="description" v-html="item.detail"></div>
              <!-- <p
              
                class="card-text text-secondary-custom small text-2-lines"
                itemprop="description"
              >
                {{ item.detail }}
              </p> -->
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 🎬 HIGHLIGHTS Section -->
    <section id="highlights" class="py-2" itemscope itemtype="https://schema.org/VideoObject">
      <div class="container">
        <header class="d-flex justify-content-between align-items-center mb-2">
          <h2 class="section-title">🎬 {{ $t('highlights') }}</h2>
          <a href="#" class="text-gold text-decoration-none text-more">{{ $t('moreHighlights') }}</a>
        </header>

        <div class="grid-4 g-4">
          <article
            v-for="item in highlights"
            :key="item.id"
            @click="goToDetail(item,'highlights-detail')"
            class="card news-card h-100  border-shadow"
            itemscope
            itemtype="https://schema.org/VideoObject"
          >
            <img
              :src="item.image"
              class="card-img-top"
              :alt="item.title"
              itemprop="thumbnailUrl"
              style="height: 200px; object-fit: cover;"
            />
            <div class="card-body p-3">
              <h3 class="card-title text-primary-custom mb-2 text-2-lines" itemprop="name">
                {{ item.title }}
              </h3>
            </div>
          </article>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()
import Header from '@/components/client/Header.vue'
import Footer from '@/components/client/Footer.vue'
import { useHead } from '@vueuse/head'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
useHead({
  title: 'Live Football Scores, News & Highlights | WWB99',
  meta: [
    {
      name: 'description',
      content:
        'Check today’s live football scores, latest sports news, and match highlights all in one place.'
    },
    { property: 'og:title', content: 'Live Football Scores, News & Highlights' },
    {
      property: 'og:description',
      content:
        'Stay updated with live football matches, the newest sports news articles, and daily highlights.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://wwb99.news/og-preview.jpg' }, // Replace
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
const matches = ref([
  {
    id: '',
    status: '--',
    league: '--',
    team1: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    },
    team2: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    }
  },
  {
    id: '',
    status: '--',
    league: '--',
    team1: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    },
    team2: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    }
  },
  {
    id: '',
    status: '--',
    league: '--',
    team1: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    },
    team2: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    }
  },
  {
    id: '',
    status: '--',
    league: '--',
    team1: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    },
    team2: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    }
  },
  {
    id: '',
    status: '--',
    league: '--',
    team1: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    },
    team2: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    }
  },
  {
    id: '',
    status: '--',
    league: '--',
    team1: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    },
    team2: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    }
  },
  {
    id: '',
    status: '--',
    league: '--',
    team1: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    },
    team2: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    }
  },
  {
    id: '',
    status: '--',
    league: '--',
    team1: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    },
    team2: {
      name: '--------------',
      score: '',
      logo: '/null-livescore.svg'
    }
  }
])

const news = ref([])
const highlights = ref([])


const fetchMatches = async () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const formattedDate = `${year}${month}${day}`
  const Category = 'soccer'
  const encodedTimezone = '+7'
  try {
    const response = await fetch(
      `https://livescore6.p.rapidapi.com/matches/v2/list-by-date?Category=${Category}&Date=${formattedDate}&Timezone=${encodedTimezone}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'e40ec2eb49msh5f5d272513681fep12e198jsn79b7968a2635',
          'X-RapidAPI-Host': 'livescore6.p.rapidapi.com'
        }
      }
    )

    const data = await response.json()

    if (data?.Stages) {
      const results = []

      data.Stages.forEach(stage => {
        const leagueName = stage?.Snm || 'Unknown League'

        stage.Events?.forEach(event => {
          results.push({
            id: event.Eid || Math.random(),
            status: event.Eps || 'NS',
            league: leagueName,
            team1: {
              name: event.T1?.[0]?.Nm || 'Team 1',
              score: event.Tr1 || '',
              logo: 'https://getimage.membertsd.workers.dev/?url=https://lsm-static-prod.livescore.com/medium/' + event.T1?.[0]?.Img || '/null-livescore.svg'
            },
            team2: {
              name: event.T2?.[0]?.Nm || 'Team 2',
              score: event.Tr2 || '',
              logo: 'https://getimage.membertsd.workers.dev/?url=https://lsm-static-prod.livescore.com/medium/' + event.T2?.[0]?.Img || '/null-livescore.svg'
            }
          })
        })
      })
      const LivescoreArray = results.slice(0, 8)
      matches.value = LivescoreArray
    }
  } catch (error) {
    console.error('Failed to fetch matches:', error)
  }
}

const fetchNews = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/news_home`)
    if (Array.isArray(response.data)) {
      const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      news.value = sorted
    }
  } catch (error) {
    console.error('Failed to fetch news:', error)
  }
}
const fetchHighlights = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/highlights_home`)
    if (Array.isArray(response.data)) {
      const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      highlights.value = sorted
    }
  } catch (error) {
    console.error('Failed to fetch news:', error)
  }
}
// Create SEO slug from title
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


// Navigate to detail page
const goToDetail = (item,namepage) => {
  const slug = slugify(item.title)
  router.push({ name: namepage, params: { id: item.id, slug } })
}
onMounted(() => {
  fetchMatches()
  fetchNews()
  fetchHighlights()
})
</script>
