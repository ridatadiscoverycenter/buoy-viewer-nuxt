<template>
  <div>
    <ChartContainer width="two-thirds">
      <template #title>Available Data</template>
      <template #subtitle>
        <p>
          This dataset spans from {{ minDate.getUTCFullYear() }} to
          {{ maxDate.getUTCFullYear() }}. The heatmap below summarizes the
          number of observations collected for each month for different
          variables. Use this heatmap to help you decide what data you want to
          visualize or download. When you have an idea, go ahead and select the
          buoys, variables and dates to explore. Or download the data in the
          most appropriate format for your analyses! To begin, select a variable
          to see what data is available.
        </p>
        <br />
        <p>
          <small
            ><i>Note:</i> The variables with "Qualifier" in the name provide
            annotations for the corresponding variable without "Qualifier". The
            qualifers are not plottable, but can be downloaded for analysis
            offline.</small
          >
        </p>
      </template>
      <template #chart>
        <StationHeatmap :summary="summary" :variables="variables" />
      </template>
    </ChartContainer>

    <BuoyLocations :coordinates="coordinates" />

    <ChartContainer width="half">
      <template #title>Explore</template>
      <template #subtitle
        >Here you can generate a line plot comparing one variable for multiple
        buoys over time. Just select the variable, the buoys, and the time
        range. Use the heatmap above to check what data are available.</template
      >
      <template #chart>
        <ExploreForm
          :variables="variables"
          :buoys="buoys"
          :min-date="minDate"
          :max-date="maxDate"
          dataset="ma-buoy-data"
          :coordinates="coordinates"
        />
      </template>
    </ChartContainer>

    <ChartContainer width="half" :height="1">
      <template #title>Not sure what to explore?</template>
      <template #subtitle>
        Here are a few pre-selected scenarios for you. Just pick one and start
        exploring.</template
      >
      <template #chart>
        <div class="is-flex-column">
          <nuxt-link
            class="button is-link mb-2"
            :to="{
              name: 'datasets-ma-buoy-data-dashboard',
              query: {
                buoyIds: 'bid101,bid102',
                variables: 'depth',
                start: '2017-05-01T04%3A00%3A00.000Z',
                end: '2017-11-30T04%3A00%3A00.000Z',
              },
            }"
            >Cole and Taunton, Depth, 2017</nuxt-link
          >
          <nuxt-link
            class="button is-link mb-2"
            :to="{
              name: 'datasets-ma-buoy-data-dashboard',
              query: {
                buoyIds: 'bid101,bid102',
                variables: 'WaterTempSurface,WaterTempBottom',
                start: '2018-05-01T04%3A00%3A00.000Z',
                end: '2018-11-30T04%3A00%3A00.000Z',
              },
            }"
            >Cole and Taunton, Water Temperature, 2018</nuxt-link
          >
        </div>
      </template>
    </ChartContainer>

    <ChartContainer width="half">
      <template #title>Download</template>
      <template #subtitle
        >If you prefer, we provide the raw data for you to download in various
        file formats. Just select from the options below.</template
      >
      <template #chart>
        <DownloadForm
          :variables="variables"
          :buoys="buoys"
          :dataset-id="datasetId"
          :coordinates="coordinates"
        />
      </template>
    </ChartContainer>

    <ChartContainer width="half" :height="1">
      <template #title>Learn More</template>
      <template #subtitle
        ><p>
          The historical data available on this site has been compiled from the
          <a
            href="https://www.mass.gov/info-details/mount-hope-bay-marine-buoy-continuous-probe-data#data-files-for-mount-hope-bay-marine-buoys"
            >Massachusetts Department of Environmental Protection</a
          >. The seasonal monitoring program is part of the Narragansett Bay
          Fixed-Site Monitoring Network.
        </p>
        <br />
        <p>
          Each data column in this dataset has a matching
          <em>Qualifiers</em> column with notes on the data collection and
          adjustments made. See
          <a
            href="https://pricaimcit.services.brown.edu/erddap/tabledap/ma_buoy_data_a6c9_12eb_1ec5.html"
            >ERDDAP</a
          >
          for the full dataset with qualifiers.
        </p></template
      >
    </ChartContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import StationHeatmap from '@/components/buoy/StationHeatmap.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';
import ExploreForm from '@/components/ExploreForm.vue';
import DownloadForm from '@/components/DownloadForm.vue';
import BuoyLocations from '@/components/buoy/Locations.vue';

import { formatVariable } from '@/utils/utils.js';

export default {
  components: {
    StationHeatmap,
    ChartContainer,
    ExploreForm,
    DownloadForm,
    BuoyLocations,
  },
  data() {
    return {
      variable: { name: 'WaterTempSurface', units: '°C' },
      dateRange: null,
    };
  },
  computed: {
    ...mapState('mabuoy', [
      'variables',
      'coordinates',
      'summary',
      'datasetId',
      'minDate',
      'maxDate',
    ]),
    buoys() {
      return this.coordinates.map((val) => val.fullName);
    },
  },
  methods: {
    formatVariable,
  },
};
</script>

<style lang="scss">
@import 'bulma';
.is-flex-column {
  @extend .is-flex;
  flex-direction: column;
}
.container-center {
  display: grid;
  grid-template-columns: 4fr 10fr 4fr;
  grid-template-rows: auto;
  grid-template-areas:
    '. main-first .'
    '. main-second .'
    '. main-third .'
    '. main-fourth .';
}
.control-item {
  @extend .py-2;
  @extend .px-2;
  flex-grow: 1;
  min-width: 250px;
}
.container-main-first {
  @extend .my-6;
  grid-area: main-first;
}
.container-main-second {
  @extend .my-6;
  grid-area: main-second;
}
.container-main-third {
  @extend .my-6;
  grid-area: main-third;
}
.container-main-fourth {
  @extend .my-6;
  grid-area: main-fourth;
}
.plot {
  margin-top: 3rem;
}

.mx-datepicker-range {
  width: 100% !important;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue2-datepicker/index.css"></style>
