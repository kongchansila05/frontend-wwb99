

<template>
<Swiper
    :effect="'cube'"
    :grabCursor="true"
    :loop="true"
    :cubeEffect="{
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    }"
    :autoplay="{ delay: 2000, disableOnInteraction: false }"
    :modules="modules"
    class="mySwiper"
  >
    <SwiperSlide><img src="https://i.imgur.com/sKLziUq.png" /></SwiperSlide>
    <SwiperSlide><img src="https://i.imgur.com/Hc7hSoJ.png" /></SwiperSlide>
    <SwiperSlide><img src="https://i.imgur.com/gQmHKh5.png" /></SwiperSlide>
  </Swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import { EffectCube, Pagination,Autoplay } from 'swiper/modules';

export default {
  name: 'CubeSlider',
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    return {
      modules: [EffectCube, Pagination,Autoplay]
    };
  }
}
</script>
<style scoped>
.mySwiper {
    width: 350px;
    height: 350px;
}
.mySwiper img
{
    width: 100%;
}
</style>