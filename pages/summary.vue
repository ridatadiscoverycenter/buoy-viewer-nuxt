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
    </template>
    <template #main-header><h1 class="title">Summary</h1></template>
    <template #main-section>
      <ChartContainer>
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
          <div class="d-flex">
            <div class="control-item control-item-first">
              <label for="variable" class="label">Variable</label>
              <multiselect
                id="variable"
                v-model="variable"
                class="multiselect"
                :options="variables"
              ></multiselect>
            </div>
            <font-awesome-icon
              v-if="summary.length < 13"
              icon="compass"
              size="2x"
              spin
            />
          </div>
          <div id="viz"></div>
        </template>
      </ChartContainer>

      <ChartContainer class="half-width">
        <template #title>Visualize</template>
        <template #subtitle
          >Here you can generate a line plot comparing one variable for multiple
          buoys over time. Just select the variable, the buoys, and the time
          range. Use the heatmap above to check what data are
          available.</template
        >
        <template #chart>
          <div class="control-item">
            <label for="buoy-select" class="label">Select Buoys</label>
            <multiselect
              id="buoy-select"
              v-model="selectedBuoys"
              class="multiselect"
              :options="buoys"
              :multiple="true"
            ></multiselect>
          </div>

          <div class="control-item">
            <label for="variable-select-visualize" class="label"
              >Select Variable</label
            >
            <multiselect
              id="variable-select-visualize"
              v-model="selectedVariable"
              class="multiselect"
              :options="variables"
            ></multiselect>
          </div>

          <div class="control-item">
            <label for="date-select" class="label">Select Date Range</label>
            <date-picker
              id="date-select"
              v-model="dateRange"
              range
            ></date-picker>
          </div>
          <nuxt-link
            class="button is-link"
            :to="{
              name: 'dashboard',
              query: { buoyIds: selectedBuoysString, slug }
            }"
            >Visualize</nuxt-link
          ></template
        >
      </ChartContainer>

      <ChartContainer>
        <template #title>Explore a few examples</template>
        <template #subtitle>
          Select one of the scenarios below and start exploring!</template
        >
        <template #chart>
          <div class="is-flex-column">
            <nuxt-link
              class="button is-link"
              :to="{
                name: 'dashboard',
                query: {
                  buoyIds: 'bid2,bid3',
                  slug:
                    'WaterTempSurface,2010-05-01T04%3A00%3A00.000Z,2011-10-31T04%3A00%3A00.000Z'
                }
              }"
              >Buoys 1 and 2, Water Temperature 2010-2011</nuxt-link
            >
            <nuxt-link
              class="button is-link"
              :to="{
                name: 'dashboard',
                query: {
                  buoyIds: 'bid15,bid17',
                  slug:
                    'depth,2008-05-01T04%3A00%3A00.000Z,2009-10-31T04%3A00%3A00.000Z'
                }
              }"
              >Buoys 115 and 17, depth 2008-2009</nuxt-link
            >
          </div>
        </template>
      </ChartContainer>

      <ChartContainer class="half-width">
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
          <!-- <div class="control-item">
          <label for="date-select" class="label">Select Date Range</label>
          <date-picker id="date-select" v-model="dateRange" range></date-picker>
        </div> -->
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
import vega from 'vega-embed';
import _ from 'lodash';
import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';
import Dashboard from '@/components/base/BaseDashboard.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';

export default {
  layout: 'dashboard',
  components: {
    Multiselect,
    DatePicker,
    Dashboard,
    ChartContainer
  },
  data() {
    return {
      variable: 'WaterTempSurface',
      selectedBuoys: [],
      selectedVariable: '',
      dateRange: null,
      fileFormat: 'json',
      downloadBuoy: '',
      downloadVariables: []
    };
  },
  computed: {
    ...mapState('worker', ['summary']),
    ...mapState('variables', ['buoys', 'variables', 'fileFormats', 'baseUrl']),
    dataArr() {
      return this.summary.reduce((a, b) => _.concat(a, b));
    },
    selectedBuoysString() {
      return this.selectedBuoys.join(',');
    },
    slug() {
      try {
        const isoDate = this.dateRange.map((date) => date.toISOString());
        return [this.selectedVariable].concat(isoDate).join(',');
      } catch {
        return null;
      }
    },
    downloadUrl() {
      return `${this.baseUrl}${this.fileFormat}?${this.downloadVariables},time,latitude,longitude&station_name="${this.downloadBuoy}"`;
    },
    spec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        width: 1000,
        height: 200,
        data: {
          name: 'buoy',
          values: this.dataArr
        },
        scales: [
          {
            name: 'x',
            type: 'time',
            domain: { data: 'buoy', field: 'date' },
            range: 'width'
          },
          {
            name: 'y',
            type: 'band',
            domain: { data: 'buoy', field: 'station' },
            range: 'height'
          },
          {
            name: 'color',
            type: 'linear',
            range: { scheme: 'Viridis' },
            domain: { data: 'buoy', field: this.variable },
            reverse: true,
            zero: false,
            nice: true
          }
        ],
        axes: [
          {
            orient: 'bottom',
            scale: 'x',
            domain: false,
            title: 'Month/Year',
            labelOverlap: 'parity'
          },
          {
            orient: 'left',
            scale: 'y',
            domain: false,
            title: 'Buoy ID'
          }
        ],
        legends: [
          {
            fill: 'color',
            type: 'gradient',
            gradientLength: { signal: 'height - 20' }
          }
        ],
        marks: [
          {
            type: 'rect',
            from: { data: 'buoy' },
            encode: {
              enter: {
                x: { scale: 'x', field: 'date' },
                y: { scale: 'y', field: 'station' },
                width: { value: 9 },
                height: { scale: 'y', band: 1 },
                tooltip: {
                  signal: `{'Date': timeFormat(datum.date, '%B %Y'), 'Station': datum.station, 'Count': datum.${this.variable}}`
                }
              },
              update: {
                fill: { scale: 'color', field: this.variable }
              }
            }
          }
        ]
      };
    }
  },
  watch: {
    summary(newVal) {
      if (newVal.length === 13 && process.browser) {
        this.addToLocalStorage();
      }
      this.update();
    }
  },
  beforeMount() {
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
  mounted() {
    vega('#viz', this.spec, { actions: true, theme: 'vox', renderer: 'svg' });
  },
  updated() {
    vega('#viz', this.spec, { actions: true, theme: 'vox', renderer: 'svg' });
  },
  methods: {
    update() {
      vega('#viz', this.spec, { actions: true, theme: 'vox', renderer: 'svg' });
    },
    addToLocalStorage() {
      localStorage.setItem('riddcBuoy', JSON.stringify(this.summary));
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'bulma';
.fa-compass {
  margin-top: 2.4rem;
  margin-left: 2rem;
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
.half-width {
  width: 48%;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue2-datepicker/index.css"></style>
