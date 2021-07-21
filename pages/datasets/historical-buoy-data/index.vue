<template>
  <div>
    <ChartContainer width="two-thirds">
      <template #title>Available Data</template>
      <template #subtitle>
        This dataset spans from {{ minDate.getUTCFullYear() }} to
        {{ maxDate.getUTCFullYear() }}. The heatmap below summarizes the number
        of observations collected for each month for different variables. Use
        this heatmap to help you decide what data you want to visualize or
        download. When you have an idea, go ahead and select the buoys,
        variables and dates to explore. Or download the data in the most
        appropriate format for your analyses! To begin, select a variable to see
        what data is available.</template
      >
      <template #chart>
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
            :min-width="600"
            :height="250"
            x="date"
            y="station_name"
            :variable="variable"
            :enable-darkmode="false"
          />
          <fa v-else icon="compass" spin class="compass-loading" />
        </div>
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
          dataset="historical-buoy-data"
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
              name: 'datasets-historical-buoy-data-dashboard',
              query: {
                buoyIds: 'bid2,bid3',
                variables: 'WaterTempSurface,WaterTempBottom',
                start: '2010-05-01T04%3A00%3A00.000Z',
                end: '2011-10-31T04%3A00%3A00.000Z',
              },
            }"
            >N. Prudence and Conimicut Pt, Water Temperature,
            2010-2011</nuxt-link
          >
          <nuxt-link
            class="button is-link mb-2"
            :to="{
              name: 'datasets-historical-buoy-data-dashboard',
              query: {
                buoyIds: 'bid15,bid17',
                variables: 'depth',
                start: '2008-05-01T04%3A00%3A00.000Z',
                end: '2009-10-31T04%3A00%3A00.000Z',
              },
            }"
            >Greenwich Bay and GSO Dock, Depth, 2008-2009</nuxt-link
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
        >The historical data available on this site has been compiled from the
        <a
          href="http://www.dem.ri.gov/programs/emergencyresponse/bart/stations.php"
          >Narragansett Bay Fixed-Site Monitoring Network</a
        >. See <a href="nbfsmn_disclaimer.pdf">the disclaimer</a> for more
        information on the data as well as how to cite it.</template
      >
    </ChartContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

import Heatmap from '@/components/charts/Heatmap.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';
import ExploreForm from '@/components/ExploreForm.vue';
import DownloadForm from '@/components/DownloadForm.vue';
import BuoyLocations from '@/components/buoy/Locations.vue';

export default {
  components: {
    Heatmap,
    Multiselect,
    ChartContainer,
    ExploreForm,
    DownloadForm,
    BuoyLocations,
  },
  data() {
    return {
      variable: 'WaterTempSurface',
      dateRange: null,
    };
  },
  computed: {
    ...mapState('buoy', [
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
.button {
  white-space: normal !important;
  overflow-wrap: break-word !important;
}
.compass-loading {
  @extend .mt-6;
  justify-self: center;
  align-self: center;
  font-size: 20rem !important;
  color: $link;
}

.mx-datepicker-range {
  width: 100% !important;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue2-datepicker/index.css"></style>
