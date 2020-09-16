<template>
  <div class="chart-container">
    <header class="chart-header">
      <h2 class="title"><slot name="title"></slot></h2>
      <h3 class="subtitle"><slot name="subtitle"></slot></h3>
    </header>
    <section class="chart">
      <slot name="chart"></slot>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'bulma';
.chart-container {
  @extend .box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.chart-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @extend .px-4;
  @extend .py-4;
}
.chart {
  padding: inherit;
  width: 100%;
}
</style>
