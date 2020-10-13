<template>
  <Dashboard>
    <template #main-nav>
      <nuxt-link
        class="plot-nav is-size-4"
        :to="{
          name: 'index'
        }"
      >
        <span>Home</span></nuxt-link
      >
      <span class="ml-4 is-size-4">/</span>
      <nuxt-link
        class="plot-nav is-size-4"
        :to="{
          name: 'summary'
        }"
        ><span class="ml-4">Summary</span></nuxt-link
      >
    </template>
    <template #main-header
      ><span class="title"><fa icon="chart-area" />Viz</span>
    </template>
    <template #main-section>
      <ChartContainer width="one-third">
        <template #title>Buoy Locations</template>
        <template #subtitle>Subtitle</template>
        <template #chart>
          <Map
            id="map"
            :width="340"
            :height="400"
            :scale="17000"
            :points="filterCoordinates"
            :center="[-70.5, 41.5]"
        /></template>
      </ChartContainer>

      <ChartContainer width="two-thirds">
        <template #title>{{ variable }}</template>
        <template #subtitle>Subtitle</template>
        <template #chart> <div id="viz" class="plot-canvas"></div></template>
      </ChartContainer>
    </template>
  </Dashboard>
</template>

<script>
import { mapState } from 'vuex';
import vega from 'vega-embed';
import Map from '@/components/charts/Map.vue';
import Dashboard from '@/components/base/BaseDashboard.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';

export default {
  layout: 'dashboard',
  components: {
    Map,
    Dashboard,
    ChartContainer
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
  data() {
    return {
      sideHidden: false
    };
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
    this.updatePlot();
  },
  updated() {
    this.updatePlot();
  },
  methods: {
    updatePlot() {
      vega('#viz', this.spec, { actions: true, theme: 'vox' });
    }
  }
};
</script>

<style lang="scss" scoped>
.map-container {
  transform: scale(0.8);
}
</style>
