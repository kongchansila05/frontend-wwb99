import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    welcome: 'Welcome',
    hello: 'Hello',
    home: 'Home',
    livescore: 'Live Score',
    news: 'News',
    highlights: 'Highlights',
    prev: 'Previous',
    next: 'Next',
    moreHighlights: 'More Highlights',
    moreNews: 'More News',
    moreLivescore: 'More Livescore',
    loading: 'Loading...',
  },
  km: {
    welcome: 'សូមស្វាគមន៍',
    hello: 'សួស្តី',
    home: 'ទំព័រដើម',
    livescore: 'ពិន្ទុបាល់',
    news: 'មាតិកា',
    highlights: 'ហាយឡាយ',
    prev: 'មុន',
    next: 'បន្ទាប់',
    moreHighlights: 'ហាយឡាយបន្ថែម',
    moreNews: 'មាតិកាបន្ថែម',
    moreLivescore: 'ពិន្ទុបាល់បន្ថែម',
    loading: 'កំពុងដំណើរការ...',
  },
}

const savedLocale = localStorage.getItem('locale') || 'en'
const i18n = createI18n({
  legacy: false, // Composition API style
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
})

export default i18n
