<template>
  <div>
    <Dashboard>
      <template #main-nav>
        <nuxt-link
          class="plot-nav is-size-5"
          :to="{
            name: 'index'
          }"
        >
          <span>Home</span></nuxt-link
        >
        <span class="ml-4 is-size-5">/</span>
        <nuxt-link
          class="plot-nav is-size-5"
          :to="{
            name: 'datasets-osom-data'
          }"
          ><span class="ml-4">Summary</span></nuxt-link
        >
        <span class="ml-4 is-size-5">/</span>
        <span class="ml-4 plot-nav is-size-5">Explore</span>
      </template>
      <template #main-header
        ><span class="title"
          ><fa icon="chart-area" class="mr-2" />Historical Buoy Data -
          Dashboard</span
        >
      </template>
      <template #main-section>
        <ChartContainer width="one-third">
          <template #title>Buoy Locations</template>
          <template #subtitle
            >Hover over the circles to find out the buoy locations.</template
          >
          <template #chart>
            <Map
              id="map"
              :height="400"
              :dataset="filterCoordinates"
              :enable-darkmode="false"
            />
          </template>
        </ChartContainer>

        <ChartContainer width="two-thirds">
          <template #title>{{ variable }}</template>
          <template #subtitle
            >This plot shows {{ variable }} over the period between
            {{ startDate.slice(0, 10) }} and {{ endDate.slice(0, 10) }}. You can
            hover over the lines to see more specific data.</template
          >
          <template #chart>
            <LineChart
              id="line-chart"
              :dataset="buoyData"
              :variable="variable"
              x="time"
              y="station_name"
              :enable-darkmode="false"
            />
          </template>
        </ChartContainer>

        <ChartContainer width="half">
          <template #title>Download Selected Data</template>
          <template #subtitle
            >Selected data includes {{ variable }} from
            {{ startDate.slice(0, 10) }} to {{ endDate.slice(0, 10) }}</template
          >
          <template #chart>
            <BaseForm>
              <template #inputs>
                <div class="control-item">
                  <label for="file-format" class="label">File format</label>
                  <multiselect
                    id="file-format"
                    v-model="fileFormat"
                    class="multiselect"
                    :options="fileFormats"
                  ></multiselect>
                </div>
              </template>

              <template #buttons>
                <a
                  role="button"
                  class="button is-link control-item-button mr-2 my-2"
                  :href="downloadUrl()"
                  >Download Data</a
                >
              </template>
            </BaseForm>
          </template>
        </ChartContainer>
        <ChartContainer width="half">
          <template #title>Keep Exploring</template>
          <template #subtitle>
            Try a different variable, adding or removing buoys, or changing the
            date range!
          </template>
          <template #chart>
            <ExploreForm
              :init-variable="variable"
              :init-buoys="buoyIds"
              :init-date-range="[startDate, endDate]"
              :variables="variables"
              :buoys="buoys"
              :min-date="minDate"
              :max-date="maxDate"
              dataset="osom-data"
            />
          </template>
        </ChartContainer>
      </template>
    </Dashboard>
    <CompassLoading :manual-load="loading" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

import Map from '@/components/charts/Map.vue';
import LineChart from '@/components/charts/LineChart.vue';
import Dashboard from '@/components/base/BaseDashboard.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';
import ExploreForm from '@/components/ExploreForm.vue';
import BaseForm from '@/components/base/BaseForm.vue';
import CompassLoading from '@/components/loading.vue';

export default {
  layout: 'dashboard',
  components: {
    Multiselect,
    Map,
    LineChart,
    Dashboard,
    ChartContainer,
    ExploreForm,
    BaseForm,
    CompassLoading
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
      fileFormat: 'json',
      loading: false
    };
  },
  computed: {
    ...mapState('model', [
      'coordinates',
      'buoyData',
      'datasetId',
      'variables',
      'minDate',
      'maxDate'
    ]),
    ...mapState('variables', ['baseUrl', 'fileFormats']),
    buoys() {
      return this.coordinates.map((val) => val.buoyId);
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
  },
  methods: {
    downloadUrl() {
      return `${this.baseUrl}/tabledap/${this.datasetId}.${this.fileFormat}?${
        this.variable
      },station_name,time,latitude,longitude&time>=${this.startDate}&time<=${
        this.endDate
      }&station_name=~"(${this.buoyIds.join('|')})"`;
    }
  }
};
</script>
