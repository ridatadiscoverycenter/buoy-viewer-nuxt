<template>
  <div class="data-card card-content content is-hidden-mobile">
    <div
      v-for="(item, index) in activeCoordinates"
      :key="index"
      class="data-card-item"
    >
      <h6 class="mb-0">{{ item.station_name }}</h6>
      <p class="mb-0 is-size-7-half">
        {{ sampleText(item.station_name) }}
      </p>
      <svg height="10" :width="280 - 20 * 2">
        <rect
          :width="
            Math.max(0, sampleNormDA(item.station_name) * (280 - 20 * 2) + 2)
          "
          height="10"
          :style="'fill:' + sampleColor(item.station_name)"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('da', ['selectedSamples', 'activeCoordinates']),
  },
  methods: {
    sampleText(site) {
      const match = this.selectedSamples.find((s) => s.station_name === site);
      if (match !== undefined) {
        return match === 0
          ? 'DA not detected'
          : `${parseInt(match.pDA)}ng of DA / L of seawater`;
      } else {
        return 'No sample';
      }
    },
    sampleColor(site) {
      const match = this.selectedSamples.find((s) => s.station_name === site);
      if (match !== undefined) {
        return match.color;
      } else {
        return 'white';
      }
    },
    sampleNormDA(site) {
      const match = this.selectedSamples.find((s) => s.station_name === site);
      if (match !== undefined) {
        return match.normDA;
      } else {
        return -1;
      }
    },
  },
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

.is-size-7-half
  font-size: 0.85rem

svg
    display: block
    margin-bottom: 10px
</style>
