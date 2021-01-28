<script>
import { vegaBaseMixin } from '@brown-ccv/disco-vue-components';

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
    baseSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        height: 300,
        data: [
          {
            name: 'data',
            values: this.dataset
          }
        ],
        scales: [
          {
            name: 'x',
            type: 'utc',
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
            range: { scheme: 'tealblues' },
            domain: { data: 'data', field: this.variable },
            reverse: false,
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
            title: 'Buoy'
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
                height: { scale: 'y', band: 1 },
                width: {
                  signal:
                    "scale('x', timeOffset('month', now())) - scale('x', now())"
                },
                tooltip: {
                  signal: `{'Date': utcFormat(datum.${this.x}, '%B %Y'), 'Station Name': datum.${this.y}, 'Buoy ID': datum.station, 'Count': datum.${this.variable}}`
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
