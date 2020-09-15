<template>
  <section class="plot-grid">
    <aside class="plot-aside">
      <header class="plot-variables">
        <ul class="py-4">
          <li>
            <span class="has-text-weight-bold">Variable:</span
            ><span class="tag is-link">{{ variable }}</span>
          </li>
          <li>
            <span class="has-text-weight-bold">Buoys:</span>
            <span
              v-for="buoy in buoyIds"
              :key="buoy"
              class="tag is-success mr-2"
              >{{ buoy }}
            </span>
          </li>
          <li>
            <span class="has-text-weight-bold">Date Range:</span>
            <span class="tag is-info mr-2"
              >{{ $moment(startDate).format('DD-MMM-YYYY') }} </span
            >to
            <span class="tag is-info mr-2">{{
              $moment(endDate).format('DD-MMM-YYYY')
            }}</span>
          </li>
        </ul>
      </header>
      <Map
        id="map"
        :width="500"
        :height="600"
        :scale="25000"
        :points="filterCoordinates"
        :center="[-71.07, 41.6]"
        background="whitesmoke"
        class="plot-container"
      />
    </aside>
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
        <font-awesome-icon icon="chart-area" />{{ variable }}
      </h1>
    </header>
    <!-- {{ dataset }} -->
    <div id="viz" class="plot-canvas"></div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import vega from 'vega-embed';
import Map from '@/components/Map.vue';

export default {
  components: {
    Map
  },
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
    ...mapState('buoy', ['coordinates', 'buoyData']),
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
        .filter((arr) => arr[this.variable] !== null)
        .reduce((a, b) => a.concat(b));
    },
    buoyIds() {
      return this.$route.query.buoyIds.split(',');
    },
    filterCoordinates() {
      return this.coordinates.filter((o) => {
        return this.buoyIds.includes(o.buoyId);
      });
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
  created() {
    if (this.coordinates.length === 0) {
      this.$store.dispatch('buoy/fetchBuoyCoordinates', {
        ids: this.buoyIds
      });
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
  @extend .mt-6;
  display: grid;
  grid-template-columns: 5fr 10fr;
  grid-template-rows: auto;
  grid-template-areas:
    ' aside nav'
    ' aside header'
    ' aside plot';
}
.plot-header {
  @extend .px-6;
  grid-area: header;
}
.plot-canvas {
  @extend .px-6;
  @extend .mr-6;
  grid-area: plot;
}
.plot-nav {
  @extend .px-6;
  grid-area: nav;
}
.plot-aside {
  @extend .has-background-light;
  @extend .px-6;
  grid-area: aside;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    ' . first-center .'
    ' second second second ';
}
.plot-variables {
  grid-area: first-center;
}
.plot-container {
  grid-area: second;
}
</style>
