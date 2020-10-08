<template>
  <div :id="id"></div>
</template>

<script>
import vegaBaseMixin from '@/mixins/vega-base-mixin.js';
export default {
  mixins: [vegaBaseMixin],
  props: {
    variable: {
      type: String,
      required: true
    },
    x: {
      type: String,
      required: true
    },
    y: {
      type: String,
      required: true
    }
  },
  computed: {
    spec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        height: 300,
        data: {
          name: 'data',
          values: this.dataset
        },
        scales: [
          {
            name: 'x',
            type: 'time',
            domain: { data: 'data', field: this.x },
            range: 'width'
          },
          {
            name: 'y',
            type: 'band',
            domain: { data: 'data', field: this.y },
            range: 'height'
          },
          {
            name: 'color',
            type: 'linear',
            range: { scheme: 'cividis' },
            domain: { data: 'data', field: this.variable },
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
            title: ['Number of', 'Observations'],
            fill: 'color',
            type: 'gradient',
            gradientLength: { signal: 'height' }
          }
        ],
        marks: [
          {
            type: 'rect',
            from: { data: 'data' },
            encode: {
              enter: {
                x: { scale: 'x', field: this.x },
                y: { scale: 'y', field: this.y },
                width: { value: 12 },
                height: { scale: 'y', band: 1 },
                tooltip: {
                  signal: `{'Date': timeFormat(datum.${this.x}, '%B %Y'), 'Station': datum.${this.y}, 'Count': datum.${this.variable}}`
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
  }
};
</script>

<style lang="scss" scoped></style>
