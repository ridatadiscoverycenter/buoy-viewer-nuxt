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
    xTitle: {
      type: String,
      required: false,
      default: 'Month/Year'
    },
    xUnit: {
      type: String,
      required: false,
      default: 'month'
    },
    y: {
      type: String,
      required: true
    },
    yTitle: {
      type: String,
      required: false,
      default: 'Buoy'
    }
  },
  computed: {
    baseSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        height: 300,
        data: [
          {
            name: 'rawData',
            values: this.dataset
          },
          {
            name: 'data',
            source: 'rawData',
            transform: [{ type: 'filter', expr: `datum.${this.variable} > 1` }]
          }
        ],
        scales: [
          {
            name: 'x',
            type: 'utc',
            domain: { data: 'rawData', field: this.x },
            range: 'width'
          },
          {
            name: 'y',
            type: 'band',
            domain: { data: 'data', field: this.y },
            range: 'height',
            padding: 0.02
          },
          {
            name: 'color',
            type: 'linear',
            range: { scheme: 'tealblues' },
            domain: { data: 'rawData', field: this.variable },
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
            title: this.xTitle,
            labelOverlap: 'parity'
          },
          {
            orient: 'left',
            scale: 'y',
            domain: false,
            title: this.yTitle
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
                  signal: `scale('x', timeOffset('${this.xUnit}', now())) - scale('x', now())`
                },
                tooltip: {
                  signal: `{'Date': utcFormat(datum.${this.x}, '%B %Y'), '${this.yTitle}': datum.${this.y}, 'Buoy ID': datum.station, 'Count': datum.${this.variable}}`
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
