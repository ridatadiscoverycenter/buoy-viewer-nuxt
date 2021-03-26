<template>
  <div class="data-card card-content content">
    <div
      v-for="(item, index) in selectedSamples.data.features"
      :key="index"
      class="data-card-item"
    >
      <h5 class="title">{{ item.properties.site }}</h5>
      <p class="subtitle mb-2">
        {{ item.properties.da | daDisplay }}
      </p>
      <svg height="20" :width="280 - 20 * 2">
        <rect
          :width="item.properties.norm_da * (280 - 20 * 2)"
          height="10"
          :style="'fill:' + item.properties.color"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  filters: {
    daDisplay(int) {
      return int === 0
        ? 'DA not detected'
        : `${parseInt(int)}ng of DA / L of seawater`;
    }
  },
  computed: {
    ...mapGetters('da', ['selectedSamples'])
  }
};
</script>

<style lang="sass" scoped>
.data-card
    z-index: 10000
    position: absolute
    background-color: white
    width: 280px
    margin: 20px
    border-radius: 1rem
    box-shadow: 3px 3px  rgba(1,1,1,0.1)
</style>
