<template>
  <div class="chart-container" :class="['is-' + width]">
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
export default {
  props: {
    width: {
      type: String,
      default: 'full'
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'bulma';
.chart-container {
  @extend .box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: scroll;
}
.chart-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @extend .px-4;
  @extend .py-4;
}
.chart {
  padding: 0;
  width: 100%;
}
.is-one-third {
  width: 32%;
}
.is-half {
  width: 49%;
}
.is-full {
  width: 100%;
}
.is-two-thirds {
  width: 66%;
}
</style>
