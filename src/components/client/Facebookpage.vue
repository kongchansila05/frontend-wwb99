<template>
  <div class="facebook-page-container">
    <iframe
      :src="iframeSrc"
      width="100%"
      height="500"
      style="border:none;overflow:hidden"
      scrolling="no"
      frameborder="0"
      allowfullscreen="true"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    ></iframe>
  </div>
</template>

<script>

export default {
  name: 'FacebookPage',
  props: {
    pageUrl: {
      type: String,
      default: 'https://web.facebook.com/wwb99company.official'
    }
  },
  computed: {
    iframeSrc() {
      return `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(this.pageUrl)}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
    }
  }
}
</script>

<style scoped>
.facebook-page-container {
  width: 100%;
  max-width: 500px;
  margin: auto;
}
</style>
