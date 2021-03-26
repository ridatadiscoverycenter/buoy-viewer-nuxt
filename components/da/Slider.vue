<template>
  <div class="slider-container">
    <label class="x-axis" for="slider"></label>
    <input
      id="slider"
      v-model="value"
      class="slider is-info has-output"
      step="1"
      min="0"
      :max="dateLength - 1"
      type="range"
      @change="changeDate"
    />
  </div>
</template>

<script>
// import moment from 'moment';
import { mapGetters, mapState } from 'vuex';
import { scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { axisBottom } from 'd3-axis';

export default {
  data() {
    return {
      value: 0
    };
  },
  computed: {
    ...mapState('da', ['dates']),
    ...mapGetters('da', ['dateLength']),
    updatedDate() {
      return this.dates[this.value];
    },
    domainArray() {
      const startDate = this.dates[0];
      const endDate = this.dates.slice(-1)[0];
      return [startDate, endDate];
    }
  },
  watch: {
    dates() {
      this.generateAxis();
    }
  },
  mounted() {
    this.generateAxis();
  },
  methods: {
    generateAxis() {
      if (this.dates.length === 0) return;
      const svg = select('.x-axis')
        .append('svg')
        .attr('width', 'calc(100% - 40px)')
        .attr('transform', 'translate(20, -100)');
      const scale = scaleTime()
        .domain(this.domainArray)
        .range([0, svg.node().getBoundingClientRect().width]);
      const xAxis = axisBottom()
        .scale(scale)
        .ticks(10);
      svg.append('g').call(xAxis);
    },
    changeDate() {
      this.$store.dispatch('da/setSelectedDate', this.updatedDate);
    }
  }
};
</script>

<style lang="sass" scoped>
.slider-container
  display: flex
  flex-direction: column
  position: relative

.x-axis
  z-index: 1000
  height: 0

.slider
  margin-left: 20px !important
  bottom: 1rem
  position: absolute
  z-index: 1000
  width: calc(100% - 40px) !important
</style>
