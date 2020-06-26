<template>
  <div class="plot-container">
    <!-- {{ dataset }} -->
    <div id="viz"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import vega from 'vega-embed';

export default {
  async fetch({ store, error, query }) {
    try {
      const ids = query.buoyIds.split(',');
      const payload = {
        variable: query.variable,
        ids
      };
      await store.dispatch('buoy/fetchDataGeoJson', payload);
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch data at this time. Try again later.'
      });
    }
  },
  computed: {
    ...mapState({
      buoyData: (state) => state.buoy.buoyData
    }),
    dataset() {
      return this.buoyData
        .map((arr) => arr.slice(0, 2000))
        .filter((arr) => arr[this.$route.query.variable] !== null)
        .reduce((a, b) => a.concat(b));
    },
    spec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description:
          'A basic line chart example, with value labels shown upon mouse hover.',
        width: 800,
        height: 500,
        padding: 5,

        data: [
          {
            name: 'buoy',
            values: this.dataset
          }
        ],
        scales: [
          {
            name: 'xscale',
            type: 'time',
            domain: { data: 'buoy', field: 'time' },
            range: 'width',
            padding: 0.05,
            round: true
          },
          {
            name: 'yscale',
            type: 'linear',
            domain: { data: 'buoy', field: this.$route.query.variable },
            nice: true,
            zero: true,
            range: 'height'
          },
          {
            name: 'color',
            type: 'ordinal',
            range: 'category',
            domain: { data: 'buoy', field: 'station_name' }
          }
        ],
        axes: [
          { orient: 'bottom', scale: 'xscale', labelAngle: 15 },
          { orient: 'left', scale: 'yscale' }
        ],
        marks: [
          {
            type: 'group',
            from: {
              facet: {
                name: 'series',
                data: 'buoy',
                groupby: 'station_name'
              }
            },
            marks: [
              {
                type: 'line',
                from: { data: 'series' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: 'time' },
                    y: { scale: 'yscale', field: this.$route.query.variable },
                    stroke: { scale: 'color', field: 'station_name' },
                    strokeWidth: { value: 4 }
                  },
                  update: {
                    interpolate: 'linear',
                    strokeOpacity: { value: 1 }
                  },
                  hover: {
                    strokeOpacity: { value: 0.5 }
                  }
                }
              }
            ]
          }
        ]
      };
    }
  },
  mounted() {
    vega('#viz', this.spec, { actions: true, theme: 'vox' });
  },
  updated() {
    vega('#viz', this.spec, { actions: true, theme: 'vox' });
  }
};
</script>

<style lang="scss" scoped>
@import 'bulma';
.plot-container {
  display: flex;
  justify-content: center;
  margin-top: 10rem;
}
</style>
