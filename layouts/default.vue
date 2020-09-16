<template>
  <div>
    <div class="logo-container">
      <span>Rhode Island Data Discovery Center</span><BaseLogo />
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
<style lang="scss">
@import 'bulma';
.logo-container {
  @extend .is-flex;
  @extend .px-2;
  @extend .py-2;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #a4b1bf;
}
</style>
