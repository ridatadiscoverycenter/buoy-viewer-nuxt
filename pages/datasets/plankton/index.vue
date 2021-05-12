<template>
  <div>
    <ChartContainer width="two-thirds">
      <template #title>Available Data</template>
      <template #subtitle>
        Narragansett Bay Long-Term Plankton Time Series is one of the world’s
        longest-running plankton surveys. Beginning in 1957, weekly samples have
        been collected to assess the phytoplankton community and characterize
        the physical parameters of Narragansett Bay. The heatmap below
        summarizes the number of observations collected for each month for
        different variables. Use this heatmap to help you decide what data you
        want to visualize or download. When you have an idea, go ahead and
        select the variables and dates to explore. Or download the data in the
        most appropriate format for your analyses!</template
      >
      <template #chart>
        <div class="is-flex-column">
          <VariableHeatmap :summary="summary" :variables="variables" />
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
          :init-buoys="buoys"
          :min-date="minDate"
          :max-date="maxDate"
          dataset="plankton"
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
              name: 'datasets-plankton-dashboard',
              query: {
                buoyIds: 'bid21',
                variables: 'WaterTempSurface,WaterTempBottom',
                start: '2017-01-01T04%3A00%3A00.000Z',
                end: '2018-12-31T04%3A00%3A00.000Z',
              },
            }"
            >Water Temperature, 2017-2018</nuxt-link
          >
          <nuxt-link
            class="button is-link mb-2"
            :to="{
              name: 'datasets-plankton-dashboard',
              query: {
                buoyIds: 'bid21',
                variables: 'SilicaBottom,SilicaSurface',
                start: '2003-01-01T04%3A00%3A00.000Z',
                end: '2009-12-31T04%3A00%3A00.000Z',
              },
            }"
            >Silica, 2003-2009</nuxt-link
          >
        </div>
      </template>
    </ChartContainer>

    <ChartContainer width="half" :height="2">
      <template #title>Download</template>
      <template #subtitle
        >If you prefer, we provide the raw data for you to download in various
        file formats. Just select from the options below.</template
      >
      <template #chart>
        <DownloadForm
          :variables="variables"
          :buoys="buoys"
          :init-buoys="buoys"
          :dataset-id="datasetId"
          :coordinates="coordinates"
        />
      </template>
    </ChartContainer>

    <ChartContainer width="half" :height="3">
      <template #title>Learn More</template>
      <template #subtitle
        ><p>
          The historical data available on this site has been compiled from the
          <a href="https://web.uri.edu/plankton/"
            >Narragansett Bay Time Series</a
          >
          and <a href="http://www.nabats.org/">NABATS.org</a>.
        </p>
        <p>
          <strong>To cite this data</strong>:
          <a href="https://web.uri.edu/gso/research/plankton/data/"
            >Plankton Time Data Page</a
          >, and for data prior to 1999: please honor the contributions of Prof.
          Smayda by properly citing the 1959 to 1997 NABATS data as: "Smayda,
          T.J. &amp; the Bunker C community (1959-1997). Narragansett Bay
          Plankton Time Series. Graduate School of Oceanography, URI. Data
          available at: <a href="http://www.nabats.org/">NABATS.org</a>"
        </p></template
      >
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
    ...mapState('plankton', [
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
