<template>
  <div>
    <BuoyLocations :coordinates="filterCoordinates" />

    <BuoyLineChart
      :dataset="planktonData"
      :variables="queryVariables"
      :start-dt-str="startDate.slice(0, 10)"
      :end-dt-str="endDate.slice(0, 10)"
      :compare-dataset="modelData"
      compare-name="OSOM"
      dataset-name="Plankton"
      :loading="loading"
    />

    <BuoyQueryDownload
      :variables="queryVariables"
      :buoy-ids="buoyIds"
      :start-dt-str="startDate"
      :end-dt-str="endDate"
      :dataset-id="datasetId"
    />

    <ChartContainer width="half">
      <template #title>Keep Exploring</template>
      <template #subtitle>
        Try different variables, buoys, or changing the date range!
      </template>
      <template #chart>
        <ExploreForm
          :init-variables="queryVariables"
          :init-buoys="stationNames"
          :init-date-range="[startDate, endDate]"
          :variables="variables"
          :buoys="buoys"
          :min-date="minDate"
          :max-date="maxDate"
          dataset="plankton"
          :coordinates="coordinates"
        />
      </template>
    </ChartContainer>

    <CompassLoading :manual-load="loading" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ChartContainer from '@/components/base/ChartContainer.vue';
import ExploreForm from '@/components/ExploreForm.vue';
import CompassLoading from '@/components/loading.vue';
import BuoyLocations from '@/components/buoy/Locations.vue';
import BuoyLineChart from '@/components/buoy/LineChartCard.vue';
import BuoyQueryDownload from '@/components/buoy/QueryDownload.vue';

export default {
  components: {
    ChartContainer,
    ExploreForm,
    CompassLoading,
    BuoyLocations,
    BuoyLineChart,
    BuoyQueryDownload
  },
  async fetch() {
    try {
      this.loading = true;
      const payload = {
        variables: this.$route.query.variables,
        start: this.$route.query.start,
        end: this.$route.query.end,
        ids: this.$route.query.buoyIds
      };
      await this.$store.dispatch('plankton/fetchDataGeoJson', payload);
      await this.$store.dispatch('model/fetchDataGeoJson', payload);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.$nuxt.context.error({
        statusCode: 503,
        message: 'Unable to fetch data at this time. Try again later.'
      });
    }
  },
  data() {
    return {
      sideHidden: false,
      loading: false
    };
  },
  computed: {
    ...mapState('plankton', [
      'coordinates',
      'planktonData',
      'datasetId',
      'variables',
      'minDate',
      'maxDate'
    ]),
    ...mapState('model', ['modelData']),
    buoys() {
      return this.coordinates.map((val) => val.fullName);
    },
    queryVariables() {
      return this.$route.query.variables.split(',');
    },
    startDate() {
      return this.$route.query.start;
    },
    endDate() {
      return this.$route.query.end;
    },
    buoyIds() {
      return this.$route.query.buoyIds.split(',');
    },
    stationNames() {
      return this.coordinates
        .filter((r) => this.buoyIds.includes(r.buoyId))
        .map((r) => r.fullName);
    },
    filterCoordinates() {
      return this.coordinates.filter((o) => {
        return this.buoyIds.includes(o.buoyId);
      });
    }
  },
  watch: {
    '$route.query': function(newQuery, oldQuery) { // eslint-disable-line
      this.$fetch();
    }
  }
};
</script>
