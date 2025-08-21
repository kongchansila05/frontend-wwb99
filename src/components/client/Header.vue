<template>
  <header>
    <nav class="navbar navbar-expand-lg shadow-sm header">
      <div class="container">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand">
          <img src="https://wwb99.news/wp-content/uploads/2025/04/WWB99.png" alt="WWB99 Logo" height="80"
            class="d-inline-block align-text-top" />
        </router-link>

        <!-- Toggler for mobile -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain"
          aria-controls="navbarMain" :aria-expanded="isOpen.toString()" @click="toggleMenu"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Menu and buttons -->
        <transition name="slide-transform">
          <div class="collapse navbar-collapse " v-show="isOpen" id="navbarMain">
            <!-- Left Menu -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link to="/" class="nav-link" exact-active-class="active">
                  {{ $t('home') }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/livescore" class="nav-link" exact-active-class="active">
                  {{ $t('livescore') }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/news" class="nav-link" exact-active-class="active">
                  {{ $t('news') }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/highlights" class="nav-link" exact-active-class="active">
                  {{ $t('highlights') }}
                </router-link>
              </li>
            </ul>

            <!-- Right Buttons -->
            <div class="d-flex gap-2 position-relative">
              <!-- Globe Button -->
              <div class="btn fw-bold bg-primary rounded-circle" style="cursor: pointer; user-select: none;"
                @click="togglePopup" ref="btnRef" aria-label="Change language">
                <i class="bi bi-globe" style="font-size: 20px; color: white;"></i>
              </div>

              <!-- Language Popup -->
              <div v-if="popupVisible" class="card shadow"
                style="position: absolute; top: 110%; right: 0; width: 150px; z-index: 1000;">
                <ul class="list-group list-group-flush">
                  <li v-for="(locale, key) in availableLocales" :key="key"
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    :class="{ active: currentLocale === key }" @click="changeLanguage(key)"
                    style="cursor: pointer;padding: 5px !important;">
                    <img :src="locale.logo" alt="flag"
                      style="width: 24px; height: 16px; margin-right: 8px; object-fit: cover;" />
                    <span>{{ locale.label }}</span>
                  </li>
                </ul>
              </div>


            </div>
          </div>
        </transition>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const availableLocales = {
  en: { label: 'English', logo: 'https://flagcdn.com/us.svg' },
  km: { label: 'ខ្មែរ', logo: 'https://flagcdn.com/kh.svg' },
};

const { locale } = useI18n()

const popupVisible = ref(false)
const currentLocale = ref(locale.value)
const btnRef = ref(null)

const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function togglePopup() {
  popupVisible.value = !popupVisible.value
  console.log(popupVisible.value = !popupVisible.value);
}

function closePopup() {
  popupVisible.value = false
}

function changeLanguage(lang) {
  locale.value = lang           // change i18n locale
  currentLocale.value = lang    // update your local state (if used)
  localStorage.setItem('locale', lang)  // save selection persistently
  closePopup()                  // close language popup
}

function handleClickOutside(event) {
  if (
    btnRef.value &&
    !btnRef.value.contains(event.target) &&
    !event.target.closest('.card.shadow')
  ) {
    closePopup()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.list-group-item.active,
.list-group-item:hover {
  background-color: #c1983d !important;
  border-color: unset !important;
  color: white !important;
  font-weight: bold;
}


.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255,255,255,1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

/* White border for the button */
.navbar-toggler {
  border: 1px solid white; /* Set white border */
  border-radius: 0.5rem;  /* optional: default rounded corners */
}

/* Optional: hover effect */
.navbar-toggler:hover {
  background-color: rgba(255, 255, 255, 0.1); /* subtle hover */
} 

.slide-transform-enter-active,
.slide-transform-leave-active {
  transition: all 0.35s ease;
}
.slide-transform-enter-from,
.slide-transform-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-transform-enter-to,
.slide-transform-leave-from {
  transform: translateY(0);
  opacity: 1;
}

</style>
