<template>
  <div class="container">
    <BaseSelect
      id="variable"
      v-model="variable"
      class="control-item"
      label="Variable"
      :options="variables.variables"
    />
    <div class="plot-container">
      <div id="viz"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import vega from 'vega-embed';
import BaseSelect from '@/components/BaseSelect';

export default {
  components: {
    BaseSelect
  },
  data() {
    return {
      variable: 'WaterTempSurface'
    };
  },
  computed: {
    ...mapState('worker', ['summary']),
    ...mapState(['variables']),
    spec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        width: 1000,
        height: 200,
        data: {
          name: 'buoy',
          values: this.summary
        },
        scales: [
          {
            name: 'x',
            type: 'band',
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
                width: { scale: 'x', band: 1 },
                height: { scale: 'y', band: 1 },
                tooltip: {
                  signal: `datum.date + datum.station`
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
.container {
  margin-top: 3rem;
}
.plot-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  overflow-x: scroll;
  padding: 5rem;
}
</style>
