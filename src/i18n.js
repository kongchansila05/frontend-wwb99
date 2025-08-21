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

    timeago: {
      justNow: 'just now',
      second: '1 second ago',
      second_plural: '{n} seconds ago',
      minute: '1 minute ago',
      minute_plural: '{n} minutes ago',
      hour: '1 hour ago',
      hour_plural: '{n} hours ago',
      day: '1 day ago',
      day_plural: '{n} days ago',
      week: '1 week ago',
      week_plural: '{n} weeks ago',
      month: '1 month ago',
      month_plural: '{n} months ago',
      year: '1 year ago',
      year_plural: '{n} years ago'
    }
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
    
    timeago: {
      justNow: 'មុននេះបន្តិច',
      second: '{n} វិនាទីមុន',
      second_plural: '{n} វិនាទីមុន',
      minute: '{n} នាទីមុន',
      minute_plural: '{n} នាទីមុន',
      hour: '{n} ម៉ោងមុន',
      hour_plural: '{n} ម៉ោងមុន',
      day: '{n} ថ្ងៃមុន',
      day_plural: '{n} ថ្ងៃមុន',
      week: '{n} សប្ដាហ៍មុន',
      week_plural: '{n} សប្ដាហ៍មុន',
      month: '{n} ខែមុន',
      month_plural: '{n} ខែមុន',
      year: '{n} ឆ្នាំមុន',
      year_plural: '{n} ឆ្នាំមុន'
    }
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
