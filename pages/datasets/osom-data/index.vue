<template>
  <div>
    <ChartContainer width="two-thirds">
      <template #title>Available Data</template>
      <template #subtitle>
        The Ocean State Ocean Model (OSOM) is an application of the Regional
        Ocean Modeling System spanning the Rhode Island waterways, including
        Narragansett Bay, Mt. Hope Bay, larger rivers, and the Block Island
        Shelf circulation from Long Island to Nantucket. Data is available by
        the year at 1.5 hour increments. As the model covers the entire
        Narragansett Bay, data is always available at all buoy locations.
      </template>
      <template #chart>
        <div class="is-flex-column">
          <VariableHeatmap
            :summary="summary"
            :variables="variables"
            x-title="Year"
            x-unit="year"
          />
          <fa
            v-if="summary.length === 0"
            icon="compass"
            spin
            class="compass-loading"
          />
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
          dataset="osom-data"
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
              name: 'datasets-osom-data-dashboard',
              query: {
                buoyIds: 'bid2,bid3',
                variables: 'WaterTempSurface,WaterTempBottom',
                start: '2006-01-01T04%3A00%3A00.000Z',
                end: '2007-01-01T04%3A00%3A00.000Z',
              },
            }"
            >N. Prudence and Conimicut Pt, Water Temperature, 2006</nuxt-link
          >
          <nuxt-link
            class="button is-link mb-2"
            :to="{
              name: 'datasets-osom-data-dashboard',
              query: {
                buoyIds: 'bid15,bid17',
                variables: 'SalinitySurface',
                start: '2018-01-01T04%3A00%3A00.000Z',
                end: '2019-01-01T04%3A00%3A00.000Z',
              },
            }"
            >Greenwich Bay and GSO Dock, Surface Salinity, 2018</nuxt-link
          >
        </div>
      </template>
    </ChartContainer>

    <ChartContainer width="half" :height="1">
      <template #title>Learn More</template>
      <template #subtitle
        >The Ocean State Ocean Model is an ongoing project, learn more about its
        history, current status, publications, and how to use the data with the
        <a
          href="https://riddc-jupyter-book.web.app/notebooks/fox-kemper/osom_intro.html"
          >RIDDC Data Articles</a
        ></template
      >
    </ChartContainer>

    <ChartContainer width="half">
      <template #title>Download</template>
      <template #subtitle
        >If you prefer, we provide the raw data for you to download in various
        file formats. Just select from the options below. If you would like to
        download data for the full model geography (not just at buoy locations),
        visit
        <a
          href="https://pricaimcit.services.brown.edu/erddap/griddap/model_data_57db_4a85_81d9.html"
          >ERDDAP</a
        >.</template
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
  </div>
</template>

<script>
import { mapState } from 'vuex';

import VariableHeatmap from '@/components/buoy/VariableHeatmap.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';
import ExploreForm from '@/components/ExploreForm.vue';
import DownloadForm from '@/components/DownloadForm.vue';
import BuoyLocations from '@/components/buoy/Locations.vue';

export default {
  components: {
    VariableHeatmap,
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
    ...mapState('model', [
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
