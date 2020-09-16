<template>
  <div>
    <div class="logo-container">
      <span class="subtitle mb-0 mr-2">Rhode Island Data Discovery Center</span>
      <BaseLogo />
    </div>
    <nuxt />
  </div>
</template>
<script>
import BaseLogo from '@/components/base/BaseLogo';
export default {
  components: {
    BaseLogo
  },
  mounted() {
    // add event listener for prefers-color-scheme
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onMediaChange = (e) => this.onMediaChange(e);
    mql.addEventListener('change', function(e) {
      onMediaChange(e);
    });
  },
  methods: {
    onMediaChange(e) {
      this.$store.dispatch('mode/setMode', e.matches ? 'dark' : 'light');
    }
  }
};
</script>
