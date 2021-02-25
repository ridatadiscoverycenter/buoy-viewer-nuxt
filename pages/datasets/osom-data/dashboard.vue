<template>
  <div>
    <BuoyLocations :coordinates="filterCoordinates" />

    <BuoyLineChart
      :dataset="modelData"
      dataset-name="OSOM"
      :dataset-line-width="0.8"
      :variable="variable"
      :compare-line-width="2.2"
      :start-dt-str="startDate.slice(0, 10)"
      :end-dt-str="endDate.slice(0, 10)"
      :compare-dataset="buoyData"
      compare-name="Historical"
      :loading="loading"
    />

    <BuoyQueryDownload
      :variable="variable"
      :buoy-ids="buoyIds"
      :start-dt-str="startDate"
      :end-dt-str="endDate"
      :dataset-id="datasetId"
    />

    <ChartContainer width="half">
      <template #title>Keep Exploring</template>
      <template #subtitle>
        Try a different variable, adding or removing buoys, or changing the date
        range!
      </template>
      <template #chart>
        <ExploreForm
          :init-variable="variable"
          :init-buoys="stationNames"
          :init-date-range="[startDate, endDate]"
          :variables="variables"
          :buoys="buoys"
          :min-date="minDate"
          :max-date="maxDate"
          dataset="osom-data"
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
        variable: this.$route.query.slug.split(',')[0],
        start: this.$route.query.slug.split(',')[1],
        end: this.$route.query.slug.split(',')[2],
        ids: this.$route.query.buoyIds
      };
      await this.$store.dispatch('model/fetchDataGeoJson', payload);
      await this.$store.dispatch('buoy/fetchDataGeoJson', payload);
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
    ...mapState('model', [
      'coordinates',
      'modelData',
      'datasetId',
      'variables',
      'minDate',
      'maxDate'
    ]),
    ...mapState('buoy', ['buoyData']),
    buoys() {
      return this.coordinates.map((val) => val.fullName);
    },
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
