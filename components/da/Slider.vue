<template>
  <div class="slider-container">
    <label class="x-axis" for="slider"></label>
    <input
      id="slider"
      v-model="value"
      class="slider mb-2"
      step="1"
      min="0"
      :max="dateLength - 1"
      type="range"
      @input="changeDate"
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
      value: 0,
      timeout: null,
    };
  },
  computed: {
    ...mapState('da', ['dates']),
    ...mapGetters('da', ['dateLength', 'startDate', 'endDate']),
    updatedDate() {
      const selectedDate = new Date(
        this.startDate.valueOf() + this.value * 1000 * 60 * 60 * 24
      );
      // return first date in the dataset that is at least this date
      return this.dates.find((d) => d >= selectedDate);
    },
    domainArray() {
      return [this.startDate, this.endDate];
    },
  },
  watch: {
    dates() {
      this.generateAxis();
    },
  },
  mounted() {
    this.generateAxis();

    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    generateAxis() {
      if (this.dates.length === 0) return;
      try {
        // remove the old axis if it exists
        select('.x-axis svg').remove();
      } catch {}
      const svg = select('.x-axis').append('svg').attr('width', 'calc(100%)');
      const scale = scaleTime()
        .domain(this.domainArray)
        .range([0, svg.node().getBoundingClientRect().width - 40]);
      const xAxis = axisBottom()
        .scale(scale)
        .ticks(Math.round(svg.node().getBoundingClientRect().width / 100));
      svg.append('g').attr('transform', 'translate(20, 20)').call(xAxis);
    },
    changeDate() {
      this.$store.dispatch('da/setSelectedDate', this.updatedDate);
    },
    onResize() {
      // debounce re-drawing axis
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.generateAxis();
      }, 300);
    },
  },
};
</script>

<style lang="sass" scoped>
.slider-container
  display: flex
  flex-direction: column
  position: absolute
  background: rgba(355, 355, 355, 0.7)
  z-index: 2
  width: 95%
  margin: auto
  height: 70px
  bottom: 30px
  left: 2.5%

.x-axis
  z-index: 1000
  height: 0
  font-weight: 600
  stroke-width: 1.5px

.slider
  margin-left: 20px !important
  bottom: 0px
  position: absolute
  z-index: 1000
  width: calc(100% - 40px) !important

input[type="range"]::-webkit-slider-runnable-track
  background: rgb(89, 81, 139) !important

input[type="range"]::-moz-range-track
  background: rgb(89, 81, 139) !important

input[type="range"]::-ms-track
  background: rgb(89, 81, 139) !important
</style>
