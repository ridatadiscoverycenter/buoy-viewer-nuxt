<template>
  <div>
    <BuoyLineChart
      :dataset="datasetData"
      :dataset-line-width="datasetLineWidth"
      :variables="queryVariables"
      :start-dt-str="startDate.slice(0, 10)"
      :end-dt-str="endDate.slice(0, 10)"
      :compare-dataset="compareDatasetData"
      :compare-name="compareDatasetTitle"
      :compare-line-width="compareLineWidth"
      :dataset-name="datasetTitle"
      :loading="loading"
    />

    <BuoyLocations :coordinates="filterCoordinates" :height="4" />

    <ChartContainer width="one-third" :height="4">
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
          :dataset="dataset"
          :coordinates="coordinates"
        />
      </template>
    </ChartContainer>

    <ChartContainer width="two-thirds" :height="4">
      <template #title>Available Data</template>
      <template #subtitle
        >Use this heatmap to help you decide what data you want to visualize.
        When you have an idea, go ahead and select the variables and dates to
        explore.</template
      >
      <template #chart>
        <slot name="summary-heatmap"></slot>
      </template>
    </ChartContainer>

    <BuoyQueryDownload
      :variables="queryVariables"
      :buoy-ids="buoyIds"
      :start-dt-str="startDate"
      :end-dt-str="endDate"
      :dataset-id="datasetId"
    />

    <CompassLoading :manual-load="loading" />
  </div>
</template>

<script>
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
    BuoyQueryDownload,
  },
  props: {
    dataset: {
      type: String,
      required: true,
    },
    datasetTitle: {
      type: String,
      required: true,
    },
    datasetData: {
      type: Array,
      required: true,
    },
    compareDatasetTitle: {
      type: String,
      required: true,
    },
    compareDatasetData: {
      type: Array,
      required: true,
    },
    coordinates: {
      type: Array,
      required: true,
    },
    variables: {
      type: Array,
      required: true,
    },
    minDate: {
      type: Date,
      required: true,
    },
    maxDate: {
      type: Date,
      required: true,
    },
    datasetId: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      require: true,
    },
    compareLineWidth: {
      type: Number,
      required: false,
      default: 0.8,
    },
    datasetLineWidth: {
      type: Number,
      required: false,
      default: 1.8,
    },
  },
  computed: {
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
    },
  },
};
</script>
