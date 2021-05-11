<template>
  <LineChartDashboard
    dataset="historical-buoy-data"
    dataset-title="Historical"
    :dataset-data="buoyData"
    compare-dataset-title="OSOM"
    :compare-dataset-data="modelData"
    :coordinates="coordinates"
    :dataset-id="datasetId"
    :variables="variables"
    :min-date="minDate"
    :max-date="maxDate"
    :loading="loading"
  >
    <template #summary-heatmap>
      <div class="is-flex-column">
        <div class="control-item control-item-first">
          <label for="variable" class="label">Variable</label>
          <multiselect
            id="variable"
            v-model="variable"
            class="multiselect"
            :options="variables"
          ></multiselect>
        </div>
        <Heatmap
          v-if="!(summary.length === 0)"
          id="heatmap"
          :dataset="summary"
          :min-width="400"
          :height="250"
          x="date"
          y="station_name"
          :variable="variable"
          :enable-darkmode="false"
        />
        <fa v-else icon="compass" spin class="compass-loading" />
      </div>
    </template>
  </LineChartDashboard>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

import LineChartDashboard from '@/components/buoy/LineChartDashboard.vue';
import Heatmap from '@/components/charts/Heatmap.vue';

export default {
  components: {
    LineChartDashboard,
    Heatmap,
    Multiselect,
  },
  data() {
    return {
      variable: 'WaterTempSurface',
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
      await this.$store.dispatch('buoy/fetchDataGeoJson', payload);
      await this.$store.dispatch('model/fetchDataGeoJson', payload);
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
    ...mapState('buoy', [
      'coordinates',
      'buoyData',
      'datasetId',
      'variables',
      'minDate',
      'maxDate',
      'summary',
    ]),
    ...mapState('model', ['modelData']),
  },
  watch: {
    '$route.query': function(newQuery, oldQuery) { // eslint-disable-line
      this.$fetch();
    },
  },
};
</script>
