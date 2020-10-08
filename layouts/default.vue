<template>
  <div>
    <a class="logo-container" href="https://ridatadiscovery.org">
      <span class="brand-title">Rhode Island Data Discovery Center</span>
      <BaseLogo />
    </a>
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
