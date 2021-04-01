<template>
  <div>
    <nav class="main-nav">
      <slot name="main-nav"></slot>
    </nav>
    <header class="main-header">
      <slot name="main-header"></slot>
    </header>
    <section class="main-section">
      <slot name="main-section"></slot>
    </section>
  </div>
</template>

<style lang="scss">
@import 'bulma';
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
  @extend .px-4;
  @extend .py-4;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: auto;
  column-gap: 15px;
  row-gap: 15px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: space-between;
  align-content: start;
  grid-auto-flow: row;
  @include mobile {
    grid-template-columns: 100vw;
    column-gap: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>
