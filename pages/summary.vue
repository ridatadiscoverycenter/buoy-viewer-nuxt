<template>
  <div>
    <section class="hero is-small is-info is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title"></h1>
          <h2 class="subtitle"></h2>
        </div>
      </div>
    </section>
    <main class="container-center">
      <div class="container-main-first">
        <header class="control-group-header">
          <h1 class="title">Buoy Data Exploration</h1>
          <p class="is-size-4 mb-6">
            This dataset spans from 2003 to 2012. The heatmap below summarizes
            the number of observations collected for each month for different
            variables. Use this heatmap to help you decide what data you want to
            visualize or download. When you have an idea, go ahead and select
            the buoys, variables and dates to explore. Or download the data in
            the most appropriate format for your analyzes! To begin, select a
            variable to see what data is available.
          </p>
        </header>
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
      </div>
      <div class="container-main-second">
        <div id="viz"></div>
      </div>
      <form
        id="buoy-select-form"
        class="control-group container-main-third section-grid"
      >
        <header class="control-group-header">
          <h2 class="title ">
            <font-awesome-icon icon="chart-area" />
            Visualize
          </h2>
          <p class="is-size-4 mb-6">
            Here you can generate a line plot comparing one variable for
            multiple buoys over time. Just select the variable, the buoys, and
            the time range. Use the heatmap above to check what data are
            available.
          </p>
        </header>
        <section class="box control-box">
          <div class="control-item control-item-first">
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
            class="button is-link control-item-button"
            :to="{
              name: 'examples-multiselect-plot',
              query: { buoyIds: selectedBuoysString, slug }
            }"
            >Visualize</nuxt-link
          >
        </section>
      </form>
      <section
        id="download"
        class="control-group container-main-fourth section-grid"
      >
        <header class="control-group-header">
          <h2 class="title">
            <font-awesome-icon icon="download" />
            Download
          </h2>
          <p class="is-size-4 mb-6">
            If you prefer, we provide the raw data for you to download in
            various file formats. Just select the options below. You'll need to
            download one file for each buoy.
          </p>
        </header>
        <section class="box control-box">
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
          >
        </section>
      </section>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import vega from 'vega-embed';
import _ from 'lodash';
import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';

export default {
  components: {
    Multiselect,
    DatePicker
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

.banner {
  height: 25vh;
}

.d-flex {
  display: flex;
}
.control-group {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'header header header'
    'first second third'
    'footer . .';
}
.control-group-header {
  grid-area: header;
}
.control-box {
  grid-area: center;
}
.control-item-first {
  grid-area: first;
}
.control-item-button {
  grid-area: footer;
  @extend .my-6;
}
.control-item {
  @extend .py-2;
  @extend .pr-6;
}
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
.section-grid {
  display: grid;
  grid-template-columns: 4fr 10fr 4fr;
  grid-template-rows: auto;
  grid-template-areas:
    'header header header'
    '. center .';
}

.plot {
  margin-top: 3rem;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue2-datepicker/index.css"></style>
