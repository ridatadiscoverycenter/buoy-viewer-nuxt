<template>
  <LineChartDashboard
    dataset="plankton"
    dataset-title="Plankton"
    :dataset-data="planktonData"
    compare-dataset-title="OSOM"
    :compare-dataset-data="modelData"
    compare-dataset-path="/datasets/osom-data"
    :coordinates="coordinates"
    :dataset-id="datasetId"
    :variables="variables"
    :min-date="minDate"
    :max-date="maxDate"
    :loading="loading"
    :weather-data="weather"
    :downsampled="downsampled"
  >
    <template #summary-heatmap>
      <VariableHeatmap :summary="summary" :variables="variables" />
    </template>
  </LineChartDashboard>
</template>

<script>
import { mapState } from 'vuex';

import LineChartDashboard from '@/components/buoy/LineChartDashboard.vue';
import VariableHeatmap from '@/components/buoy/VariableHeatmap.vue';

export default {
  components: {
    LineChartDashboard,
    VariableHeatmap,
  },
  data() {
    return {
      loading: false,
    };
  },
  async fetch() {
    try {
      this.loading = true;
      const payload = {
        variables: this.$route.query.variables,
        start: this.$route.query.start,
        end: this.$route.query.end,
        ids: this.$route.query.buoyIds,
      };
      await Promise.all([
        this.$store.dispatch('plankton/fetchDataGeoJson', payload),
        this.$store.dispatch('model/fetchDataGeoJson', payload),
        this.$store.dispatch('weather/fetchWeather', {
          startDate: payload.start.slice(0, 10),
          endDate: payload.end.slice(0, 10),
        }),
      ]);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.$nuxt.context.error({
        statusCode: 503,
        message: 'Unable to fetch data at this time. Try again later.',
      });
    }
  },
  computed: {
    ...mapState('plankton', [
      'coordinates',
      'planktonData',
      'datasetId',
      'variables',
      'minDate',
      'maxDate',
      'summary',
      'downsampled',
    ]),
    ...mapState('model', ['modelData']),
    ...mapState('weather', ['weather']),
  },
  watch: {
    '$route.query': function(newQuery, oldQuery) { // eslint-disable-line
      this.$fetch();
    },
  },
};
</script>
