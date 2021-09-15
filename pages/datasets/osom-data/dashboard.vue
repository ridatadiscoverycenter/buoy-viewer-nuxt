<template>
  <LineChartDashboard
    dataset="osom-data"
    dataset-title="OSOM"
    :dataset-data="modelData"
    :dataset-line-width="0.8"
    compare-dataset-title="Historical"
    :compare-dataset-data="allBuoyData"
    :compare-line-width="1.8"
    :coordinates="coordinates"
    :dataset-id="datasetId"
    :variables="variables"
    :min-date="minDate"
    :max-date="maxDate"
    :loading="loading"
  >
    <template #summary-heatmap>
      <VariableHeatmap
        :summary="summary"
        :variables="variables"
        x-title="Year"
        x-unit="year"
      />
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
      await this.$store.dispatch('model/fetchDataGeoJson', payload);
      await this.$store.dispatch('buoy/fetchDataGeoJson', payload);
      await this.$store.dispatch('mabuoy/fetchDataGeoJson', payload);
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
    ...mapState('model', [
      'coordinates',
      'modelData',
      'datasetId',
      'variables',
      'minDate',
      'maxDate',
      'summary',
    ]),
    ...mapState('buoy', ['buoyData']),
    ...mapState('mabuoy', ['mabuoyData']),
    allBuoyData() {
      return [...this.buoyData, ...this.mabuoyData];
    },
  },
  watch: {
    '$route.query': function(newQuery, oldQuery) { // eslint-disable-line
      this.$fetch();
    },
  },
};
</script>
