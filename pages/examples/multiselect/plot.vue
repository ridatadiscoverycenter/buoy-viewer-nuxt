<template>
  <section class="plot-grid">
    <nuxt-link
      class="plot-nav is-size-4"
      :to="{
        name: 'summary'
      }"
      ><font-awesome-icon icon="arrow-left" /><span class="ml-4"
        >Back to Summary</span
      ></nuxt-link
    >
    <header class="plot-header">
      <h1 class="title is-size-2 py-6">
        <font-awesome-icon icon="chart-area" />Visualizing Buoy Data
      </h1>
      <p class="is-size-4 pb-6">
        Showing <span class="tag is-size-4 is-info">{{ variable }}</span> for
        buoys
        <span
          v-for="buoy in buoyIds"
          :key="buoy"
          class="tag is-size-4 is-success mr-2"
          >{{ buoy }}
        </span>
        from
        <span class="tag is-size-4 is-secondary mr-2"
          >{{ $moment(startDate).format('DD-MMM-YYYY') }} </span
        >to
        <span class="tag is-size-4 is-secondary mr-2">{{
          $moment(endDate).format('DD-MMM-YYYY')
        }}</span>
      </p>
    </header>
    <!-- {{ dataset }} -->
    <div id="viz" class="plot-canvas"></div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import vega from 'vega-embed';

export default {
  async fetch({ store, error, query }) {
    try {
      const ids = query.buoyIds.split(',');
      const payload = {
        variable: query.slug.split(',')[0],
        start: query.slug.split(',')[1],
        end: query.slug.split(',')[2],
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
    variable() {
      return this.$route.query.slug.split(',')[0];
    },
    startDate() {
      const start = new Date(this.$route.query.slug.split(',')[1]);
      return start;
    },
    endDate() {
      return this.$route.query.slug.split(',')[2];
    },
    dataset() {
      return this.buoyData
        .map((arr) => arr.slice(0, 2000))
        .filter((arr) => arr[this.variable] !== null)
        .reduce((a, b) => a.concat(b));
    },
    buoyIds() {
      return this.$route.query.buoyIds.split(',');
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
            domain: { data: 'buoy', field: this.variable },
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
                    y: { scale: 'yscale', field: this.variable },
                    stroke: { scale: 'color', field: 'station_name' },
                    strokeWidth: { value: 2 }
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
.plot-grid {
  display: grid;
  grid-template-columns: 4fr 10fr 4fr;
  grid-template-rows: auto;
  grid-template-areas:
    ' . nav .'
    '. header .'
    '. plot .';
}
.plot-header {
  grid-area: header;
}
.plot-canvas {
  grid-area: plot;
}
.plot-nav {
  grid-area: nav;
}
</style>
