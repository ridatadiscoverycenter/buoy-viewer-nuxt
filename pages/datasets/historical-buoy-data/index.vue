<template>
  <Dashboard>
    <template #main-nav>
      <nuxt-link
        class="plot-nav is-size-5 py-5"
        :to="{
          name: 'index'
        }"
        ><span>Home</span></nuxt-link
      >
      <span class="ml-4 is-size-5">/</span>
      <span class="ml-4 plot-nav is-size-5">Summary</span>
    </template>
    <template #main-header
      ><h1 class="title">Historical Buoy Data - Summary</h1></template
    >
    <template #main-section>
      <ChartContainer width="two-thirds">
        <template #title>Available Data</template>
        <template #subtitle>
          This dataset spans from 2003 to 2012. The heatmap below summarizes the
          number of observations collected for each month for different
          variables. Use this heatmap to help you decide what data you want to
          visualize or download. When you have an idea, go ahead and select the
          buoys, variables and dates to explore. Or download the data in the
          most appropriate format for your analyzes! To begin, select a variable
          to see what data is available.</template
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
            <fa
              v-if="summary.length < 13"
              icon="compass"
              spin
              class="compass-loading"
            />
            <Heatmap
              v-if="!(summary.length === 0)"
              id="heatmap"
              :dataset="dataArr"
              :min-width="400"
              x="date"
              y="station"
              :variable="variable"
              :enable-darkmode="false"
            />
          </div>
        </template>
      </ChartContainer>
      <ChartContainer width="one-third">
        <template #title>Buoy Locations</template>
        <template #subtitle
          >Hover over the circles to find out the buoy locations.</template
        >
        <template #chart>
          <Map
            id="map"
            :height="400"
            :dataset="coordinates"
            :enable-darkmode="false"
          />
        </template>
      </ChartContainer>

      <ChartContainer width="half">
        <template #title>Explore</template>
        <template #subtitle
          >Here you can generate a line plot comparing one variable for multiple
          buoys over time. Just select the variable, the buoys, and the time
          range. Use the heatmap above to check what data are
          available.</template
        >
        <template #chart>
          <ExploreForm />
        </template>
      </ChartContainer>

      <ChartContainer width="half">
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
                  slug:
                    'WaterTempSurface,2010-05-01T04%3A00%3A00.000Z,2011-10-31T04%3A00%3A00.000Z'
                }
              }"
              >Buoys 1 and 2, Water Temperature 2010-2011</nuxt-link
            >
            <nuxt-link
              class="button is-link mb-2"
              :to="{
                name: 'datasets-historical-buoy-data-dashboard',
                query: {
                  buoyIds: 'bid15,bid17',
                  slug:
                    'depth,2008-05-01T04%3A00%3A00.000Z,2009-10-31T04%3A00%3A00.000Z'
                }
              }"
              >Buoys 15 and 17, depth 2008-2009</nuxt-link
            >
          </div>
        </template>
      </ChartContainer>

      <ChartContainer width="one-third">
        <template #title>Download</template>
        <template #subtitle
          >If you prefer, we provide the raw data for you to download in various
          file formats. Just select the options below. You'll need to download
          one file for each buoy.</template
        >
        <template #chart>
          <div class="control-item">
            <label for="file-format" class="label">File format</label>
            <multiselect
              id="file-format"
              v-model="fileFormat"
              class="multiselect"
              :options="fileFormats"
            ></multiselect>
          </div>

          <div class="control-item">
            <label for="buoy-id" class="label">Buoy ID</label>
            <multiselect
              id="buoy-id"
              v-model="downloadBuoy"
              class="multiselect"
              :options="buoys"
            ></multiselect>
          </div>

          <div class="control-item">
            <label for="variable-select-download" class="label"
              >Select Variable</label
            >
            <multiselect
              id="variable-select-download"
              v-model="downloadVariables"
              class="multiselect"
              :options="variables"
              :multiple="true"
            ></multiselect>
          </div>
          <a
            role="button"
            class="button is-link control-item-button"
            :href="downloadUrl"
            >Download Data</a
          ></template
        >
      </ChartContainer>
    </template>
  </Dashboard>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import Multiselect from 'vue-multiselect';

import Map from '@/components/charts/Map.vue';
import Heatmap from '@/components/charts/Heatmap.vue';
import Dashboard from '@/components/base/BaseDashboard.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';
import ExploreForm from '@/components/ExploreForm.vue';

export default {
  layout: 'dashboard',
  components: {
    Map,
    Heatmap,
    Multiselect,
    Dashboard,
    ChartContainer,
    ExploreForm
  },
  data() {
    return {
      variable: 'WaterTempSurface',
      dateRange: null,
      fileFormat: 'json',
      downloadBuoy: '',
      downloadVariables: []
    };
  },
  computed: {
    ...mapState('worker', ['summary']),
    ...mapState('variables', ['buoys', 'variables', 'fileFormats', 'baseUrl']),
    ...mapState('buoy', ['coordinates']),
    dataArr() {
      return this.summary.reduce((a, b) => _.concat(a, b));
    },
    downloadUrl() {
      return `${this.baseUrl}${this.fileFormat}?${this.downloadVariables},time,latitude,longitude&station_name="${this.downloadBuoy}"`;
    }
  },
  watch: {
    summary(newVal) {
      if (newVal.length === 13 && process.browser) {
        this.addToLocalStorage();
      }
    }
  },
  created() {
    if (this.coordinates.length === 0) {
      this.$store.dispatch('buoy/fetchBuoyCoordinates', {
        ids: this.buoys
      });
    }
    if (process.browser && this.summary.length < 13) {
      try {
        const summary = JSON.parse(localStorage.getItem('riddcBuoy'));
        summary
          .reduce((a, b) => a.concat(b))
          .forEach((datum) => {
            datum.date = new Date(datum.date);
            this.$store.dispatch('worker/setSummary', datum);
          });
        this.$store.dispatch('worker/loaded', true);
      } catch {
        this.$store.dispatch('worker/loaded', false);
      }
    }
  },

  methods: {
    addToLocalStorage() {
      localStorage.setItem('riddcBuoy', JSON.stringify(this.summary));
    }
  }
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
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue2-datepicker/index.css"></style>
