<template>
  <div class="chart-container" :class="['is-' + width, 'is-height-' + height]">
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
      default: 'full',
    },
    height: {
      type: Number,
      default: 2,
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  margin-bottom: 0 !important;
  @extend .box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: visible;
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
  grid-column-start: span 2;
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-half {
  grid-column-start: span 3;
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-full {
  grid-column-start: span 6;
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-two-thirds {
  grid-column-start: span 4;
  @include mobile {
    grid-column-start: span 1;
  }
}
.is-height-1 {
  grid-row-start: span 1;
}
.is-height-2 {
  grid-row-start: span 2;
}
.is-height-3 {
  grid-row-start: span 3;
}
.is-height-4 {
  grid-row-start: span 4;
}
.is-height-5 {
  grid-row-start: span 5;
}
.is-height-6 {
  grid-row-start: span 6;
}
</style>
