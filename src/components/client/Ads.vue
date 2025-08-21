<template>
  <Swiper
    :effect="'cube'"
    :grabCursor="true"
    :loop="true"
    :cubeEffect="{
      shadow: true,
      slideShadows: true,
      shadowOffset: 10,
      shadowScale: 0.94,
    }"
    :autoplay="{ delay: 5000, disableOnInteraction: false }"
    :modules="modules"
    class="mySwiper"
  >
    <SwiperSlide
      v-for="sponsor in sponsors"
      :key="sponsor.id"
    >
      <img :src="sponsor.image_url" :alt="sponsor.name" />
    </SwiperSlide>
  </Swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import { EffectCube, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';

export default {
  name: 'CubeSlider',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      sponsors: [],
      modules: [EffectCube, Pagination, Autoplay],
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    };
  },
  async mounted() {
    try {
      const { data } = await axios.get(`${this.apiBaseUrl}/api/sponsors_home`);
      if (data?.data) {
        this.sponsors = data.data;
      }
    } catch (error) {
      console.error('Failed to load sponsors:', error);
    }
  }
};
</script>

<style scoped>
.mySwiper {
  width: 300px;
  height: 300px;
}
.mySwiper img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
