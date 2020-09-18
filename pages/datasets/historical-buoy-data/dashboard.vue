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
          name: 'datasets-historical-buoy-data'
        }"
        ><span class="ml-4">Summary</span></nuxt-link
      >
    </template>
    <template #main-header
      ><span class="title"
        ><font-awesome-icon icon="chart-area" class="mr-2" />Historical Buoy
        Data - Dashboard</span
      >
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
            :dataset="filterCoordinates"
            :center="[-70.5, 41.5]"
        /></template>
      </ChartContainer>

      <ChartContainer width="two-thirds">
        <template #title>{{ variable }}</template>
        <template #subtitle>Subtitle</template>
        <template #chart>
          <MultiLineChart
            id="line-chart"
            :dataset="dataset"
            :variable="variable"
            x="time"
            y="station_name"
          />
        </template>
      </ChartContainer>

      <ChartContainer width="half">
        <template #title>Download Selected Data</template>
        <template #subtitle
          >Selected data includes {{ variable }} from
          {{ startDate.slice(0, 10) }} to {{ endDate.slice(0, 10) }}</template
        >
        <template #chart>
          <div class="control-item">
            <label for="file-format" class="label">File format</label>
            <multiselect
              id="file-format"
              v-model="fileFormat"
              class="multiselect"
              :options="fileFormats"
            ></multiselect>
          </div>

          <a
            v-for="buoy in buoyIds"
            :key="'download' + buoy"
            role="button"
            class="button is-link control-item-button mr-2 my-2"
            :href="downloadUrl(buoy)"
            >Download {{ buoy }} Data</a
          >
        </template>
      </ChartContainer>
    </template>
  </Dashboard>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';
import Map from '@/components/charts/Map.vue';
import MultiLineChart from '@/components/charts/MultiLineChart.vue';
import Dashboard from '@/components/base/BaseDashboard.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';

export default {
  layout: 'dashboard',
  components: {
    Multiselect,
    Map,
    MultiLineChart,
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
      sideHidden: false,
      fileFormat: 'json'
    };
  },
  computed: {
    ...mapState('buoy', ['coordinates', 'buoyData']),
    ...mapState('variables', ['baseUrl', 'fileFormats']),
    variable() {
      return this.$route.query.slug.split(',')[0];
    },
    startDate() {
      const start = this.$route.query.slug.split(',')[1];
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
    }
  },
  created() {
    if (this.coordinates.length === 0) {
      this.$store.dispatch('buoy/fetchBuoyCoordinates', {
        ids: this.buoyIds
      });
    }
  },
  methods: {
    downloadUrl(buoyId) {
      return `${this.baseUrl}${this.fileFormat}?${this.variable},time,latitude,longitude&time>=${this.startDate}&time<=${this.endDate}&station_name="${buoyId}"`;
    }
  }
};
</script>

<style lang="scss" scoped>
.map-container {
  transform: scale(0.8);
}
</style>
