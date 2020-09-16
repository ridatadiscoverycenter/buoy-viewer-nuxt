<template>
  <div class="dashboard-grid">
    <aside class="sidebar">
      <slot name="sidebar"></slot>
    </aside>
    <main>
      <nav class="main-header">
        <slot name="main-nav"></slot>
      </nav>
      <header class="main-header">
        <slot name="main-header"></slot>
      </header>
      <section class="main-section">
        <slot name="main-section"></slot>
      </section>
    </main>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'bulma';
.sidebar {
  border-right: 1px solid #a4b1bf;
  grid-area: sidebar;
  height: 100vh;
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
  display: grid;
  grid-template-columns: 2fr 10fr;
  grid-template-areas:
    'sidebar main-header'
    'sidebar main-nav'
    'sidebar main-section';
}
</style>
