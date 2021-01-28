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
        description:
          'A basic line chart example, with value labels shown upon mouse hover.',
        height: 500,
        padding: 5,

        signals: [
          {
            name: 'selected',
            value: null,
            on: [
              {
                events: '@legendSymbol:click, @legendLabel:click',
                update: 'selected === datum.value ? null : datum.value',
                force: true
              },
              {
                events: 'mouseup[!event.item]',
                update: 'null',
                force: true
              }
            ]
          },
          {
            name: 'hovered',
            value: null,
            on: [
              { events: '@voronoi:mouseover', update: 'datum' },
              { events: 'mouseout', update: 'null' }
            ]
          }
        ],
        data: [
          {
            name: 'buoy',
            values: this.dataset
          }
        ],
        scales: [
          {
            name: 'xscale',
            type: 'time',
            domain: { data: 'buoy', field: this.x },
            range: 'width',
            padding: 0.05,
            round: true
          },
          {
            name: 'yscale',
            type: 'linear',
            domain: { data: 'buoy', field: this.variable },
            nice: true,
            zero: false,
            range: 'height'
          },
          {
            name: 'color',
            type: 'ordinal',
            range: { scheme: 'tableau20' },
            domain: { data: 'buoy', field: this.y }
          }
        ],
        axes: [
          { orient: 'bottom', scale: 'xscale', labelAngle: 15, title: 'Time' },
          { orient: 'left', scale: 'yscale', title: this.variable }
        ],
        legends: [
          {
            title: 'Buoys',
            fill: 'color',
            orient: 'bottom-right',
            encode: {
              symbols: {
                name: 'legendSymbol',
                interactive: true,
                update: {
                  strokeWidth: { value: 2 },
                  opacity: [
                    {
                      test: '!selected || selected === datum.value',
                      value: 1
                    },
                    { value: 0.15 }
                  ],
                  size: { value: 64 }
                },
                hover: {
                  cursor: { value: 'pointer' }
                }
              },
              labels: {
                name: 'legendLabel',
                interactive: true,
                update: {
                  opacity: [
                    {
                      test: '!selected || selected === datum.value',
                      value: 1
                    },
                    { value: 0.25 }
                  ],
                  fontWeight: { value: 'normal' }
                },
                hover: {
                  fontWeight: { value: 'bold' },
                  cursor: { value: 'pointer' }
                }
              }
            }
          }
        ],
        marks: [
          {
            type: 'symbol',
            zindex: 1,
            encode: {
              enter: {
                size: { value: 20 }
              },
              update: {
                fill: [
                  { test: '!hovered', value: 'transparent' },
                  { value: 'black' }
                ],
                x: { signal: 'hovered && hovered.x' },
                y: { signal: 'hovered && hovered.y' }
              }
            }
          },
          {
            type: 'symbol',
            name: 'secret_symbols',
            from: { data: 'buoy' },
            encode: {
              enter: {
                fill: { value: 'transparent' },
                x: { scale: 'xscale', field: this.x },
                y: { scale: 'yscale', field: this.variable }
              }
            }
          },
          {
            type: 'path',
            name: 'voronoi',
            from: { data: 'secret_symbols' },
            encode: {
              enter: {
                stroke: { value: 'transparent' },
                fill: { value: 'transparent' },
                tooltip: {
                  signal: `{ '${this.variable}': datum.datum.${this.variable}, 'Date': utcFormat(datum.datum.${this.x}, '%Y-%m-%dT%H:%M:%S.%LZ'), 'Buoy ID': datum.datum.${this.y} }`
                }
              }
            },
            transform: [
              {
                type: 'voronoi',
                x: 'datum.x',
                y: 'datum.y',
                size: [{ signal: 'width' }, { signal: 'height' }]
              }
            ]
          },
          {
            type: 'group',
            from: {
              facet: {
                name: 'series',
                data: 'buoy',
                groupby: 'station_name'
              }
            },
            marks: [
              {
                type: 'line',
                name: 'lines',
                from: { data: 'series' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: this.x },
                    y: { scale: 'yscale', field: this.variable },
                    stroke: { scale: 'color', field: this.y },
                    strokeWidth: { value: 1 },
                    interactive: false
                  },
                  update: {
                    defined: { signal: `isValid(datum.${this.variable})` },
                    strokeOpacity: [
                      {
                        test: `!selected || selected === datum.station_name`,
                        value: 0.7
                      },
                      { value: 0.15 }
                    ]
                  }
                }
              }
            ]
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped></style>
