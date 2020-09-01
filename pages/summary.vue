<template>
  <div class="plot-container">
    <BaseSelect
      id="variable"
      v-model="variable"
      class="control-item"
      label="Variable"
      :options="variables"
    />
    <div class="plot">
      <div id="viz"></div>
    </div>
    <div>
      <form id="buoy-select-form">
        <label for="buoy-select" class="label">Select Buoys</label>
        <multiselect
          id="buoy-select"
          v-model="selectedBuoys"
          class="multiselect"
          :options="buoys"
          :multiple="true"
        ></multiselect>

        <label for="variable-select" class="label">Select Variable</label>
        <multiselect
          id="variable-select"
          v-model="selectedVariable"
          class="multiselect"
          :options="variables"
        ></multiselect>
        <label for="date-select" class="label">Select Date Range</label>
        <date-picker id="date-select" v-model="dateRange" range></date-picker>
        <nuxt-link
          class="button is-link"
          :to="{
            name: 'examples-multiselect-plot',
            query: { buoyIds: selectedBuoysString, slug }
          }"
          >Submit</nuxt-link
        >
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import vega from 'vega-embed';
import _ from 'lodash';
import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';
import BaseSelect from '@/components/base/BaseSelect';

export default {
  components: {
    BaseSelect,
    Multiselect,
    DatePicker
  },
  data() {
    return {
      variable: 'WaterTempSurface',
      selectedBuoys: [],
      selectedVariable: '',
      dateRange: null
    };
  },
  computed: {
    ...mapState('worker', ['summary']),
    ...mapState('variables', ['buoys', 'variables']),
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
  mounted() {
    vega('#viz', this.spec, { actions: true, theme: 'vox', renderer: 'svg' });
  },
  updated() {
    vega('#viz', this.spec, { actions: true, theme: 'vox', renderer: 'svg' });
  }
};
</script>

<style lang="scss" scoped>
@import 'bulma';
.plot-container {
  margin-top: 3rem;
  display: grid;
  justify-content: center;
}
.plot {
  margin-top: 3rem;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="vue2-datepicker/index.css"></style>
