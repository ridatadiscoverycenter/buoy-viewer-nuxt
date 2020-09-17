<template>
  <div>
    <a class="logo-container" href="https://ridatadiscovery.org">
      <span class="brand-title">Rhode Island Data Discovery Center</span
      ><BaseLogo />
    </a>
    <div class="dashboard-grid">
      <aside class="sidebar">
        <Sidebar />
      </aside>
      <nuxt />
    </div>
  </div>
</template>
<script>
import BaseLogo from '@/components/base/BaseLogo';
import Sidebar from '@/components/Sidebar.vue';
export default {
  components: {
    BaseLogo,
    Sidebar
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
.sidebar {
  border-right: 1px solid #a4b1bf;
  grid-area: sidebar;
  @extend .px-4;
  @extend .py-4;
}
.main-header {
  grid-area: main-header;
  border-bottom: 1px solid #a4b1bf;
  @extend .px-4;
  @extend .py-4;
}
.main-nav {
  grid-area: main-nav;
  border-bottom: 1px solid #a4b1bf;
  @extend .px-4;
  @extend .py-4;
}
.main-section {
  grid-area: main-section;
  @extend .is-flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  @extend .px-4;
  @extend .py-4;
}
.dashboard-grid {
  background-image: linear-gradient(to top left, whitesmoke, white);
  display: grid;
  grid-template-columns: 2fr 10fr;
  grid-template-areas:
    'sidebar main-header'
    'sidebar main-nav'
    'sidebar main-section';
}
</style>
