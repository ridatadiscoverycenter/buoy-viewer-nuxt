<template>
  <div>
    <a class="logo-container" href="https://ridatadiscovery.org">
      <span class="brand-title">Rhode Island Data Discovery Center</span
      ><BaseLogo />
    </a>
    <div :class="[collapsed ? 'dashboard-grid-collapsed' : 'dashboard-grid']">
      <aside class="sidebar">
        <Sidebar @toggle="toggle" />
      </aside>
      <nuxt />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false
    };
  },
  methods: {
    toggle(e) {
      this.collapsed = e;
      return e;
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
  overflow: hidden;
  background-color: whitesmoke;
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
.main-section > div {
  grid-area: main-section;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  @extend .px-4;
  @extend .py-4;
  z-index: 20;
}
.dashboard-grid {
  background-image: linear-gradient(to top left, whitesmoke, white);
  display: grid;
  grid-template-columns: 2fr 10fr;
  grid-template-areas:
    'sidebar main-header'
    'sidebar main-nav'
    'sidebar main-section';
  @include mobile {
    grid-template-columns: 100vw;
    grid-template-areas:
      'sidebar'
      'main-header'
      'main-nav'
      'main-section';
  }
}
.dashboard-grid-collapsed {
  background-image: linear-gradient(to top left, whitesmoke, white);
  display: grid;
  grid-template-columns: 8ch auto;
  grid-template-areas:
    'sidebar main-header'
    'sidebar main-nav'
    'sidebar main-section';
  @include mobile {
    grid-template-columns: 100vw;
    grid-template-rows: 3.5rem auto auto auto;
    grid-template-areas:
      'sidebar'
      'main-header'
      'main-nav'
      'main-section';
  }
}
</style>
