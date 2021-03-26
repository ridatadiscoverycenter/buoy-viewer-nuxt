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
      <main>
        <nuxt />
      </main>
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
<style lang="scss" scoped>
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
main {
  grid-area: main;
}
.dashboard-grid {
  background-image: linear-gradient(to top left, whitesmoke, white);
  display: grid;
  grid-template-columns: 2fr 10fr;
  grid-template-areas: 'sidebar main';
  @include mobile {
    grid-template-columns: 100vw;
    grid-template-areas:
      'sidebar'
      'main';
  }
}
.dashboard-grid-collapsed {
  background-image: linear-gradient(to top left, whitesmoke, white);
  display: grid;
  grid-template-columns: 8ch auto;
  grid-template-areas: 'sidebar main';
  @include mobile {
    grid-template-columns: 100vw;
    grid-template-rows: 3.5rem auto auto auto;
    grid-template-areas:
      'sidebar'
      'main';
  }
}
</style>
