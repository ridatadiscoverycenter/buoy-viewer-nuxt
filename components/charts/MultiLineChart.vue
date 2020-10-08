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
        description:
          'A basic line chart example, with value labels shown upon mouse hover.',
        height: 500,
        padding: 5,

        signals: [
          {
            name: 'clear',
            value: true,
            on: [
              {
                events: 'mouseup[!event.item]',
                update: 'true',
                force: true
              }
            ]
          },
          {
            name: 'shift',
            value: false,
            on: [
              {
                events: '@legendSymbol:click, @legendLabel:click',
                update: 'event.shiftKey',
                force: true
              }
            ]
          },
          {
            name: 'clicked',
            value: null,
            on: [
              {
                events: '@legendSymbol:click, @legendLabel:click',
                update: '{value: datum.value}',
                force: true
              }
            ]
          },
          {
            name: 'brush',
            value: 0,
            on: [
              {
                events: { signal: 'clear' },
                update: 'clear ? [0, 0] : brush'
              },
              {
                events: '@xaxis:mousedown',
                update: '[x(), x()]'
              },
              {
                events:
                  '[@xaxis:mousedown, window:mouseup] > window:mousemove!',
                update: '[brush[0], clamp(x(), 0, width)]'
              },
              {
                events: { signal: 'delta' },
                update:
                  'clampRange([anchor[0] + delta, anchor[1] + delta], 0, width)'
              }
            ]
          },
          {
            name: 'anchor',
            value: null,
            on: [{ events: '@brush:mousedown', update: 'slice(brush)' }]
          },
          {
            name: 'xdown',
            value: 0,
            on: [{ events: '@brush:mousedown', update: 'x()' }]
          },
          {
            name: 'delta',
            value: 0,
            on: [
              {
                events:
                  '[@brush:mousedown, window:mouseup] > window:mousemove!',
                update: 'x() - xdown'
              }
            ]
          },
          {
            name: 'domain',
            on: [
              {
                events: { signal: 'brush' },
                update: "span(brush) ? invert('x', brush) : null"
              }
            ]
          }
        ],
        data: [
          {
            name: 'buoy',
            values: this.dataset
          },
          {
            name: 'selected',
            on: [
              { trigger: 'clear', remove: true },
              { trigger: '!shift', remove: true },
              { trigger: '!shift && clicked', insert: 'clicked' },
              { trigger: 'shift && clicked', toggle: 'clicked' }
            ]
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
            zero: true,
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
                      test:
                        "!length(data('selected')) || indata('selected', 'value', datum.value)",
                      value: 1
                    },
                    { value: 0.15 }
                  ],
                  size: { value: 64 }
                }
              },
              labels: {
                name: 'legendLabel',
                interactive: true,
                update: {
                  opacity: [
                    {
                      test:
                        "!length(data('selected')) || indata('selected', 'value', datum.value)",
                      value: 1
                    },
                    { value: 0.25 }
                  ]
                }
              }
            }
          }
        ],
        marks: [
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
                from: { data: 'series' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: this.x },
                    y: { scale: 'yscale', field: this.variable },
                    stroke: { scale: 'color', field: this.y },
                    strokeWidth: { value: 1 },
                    tooltip: {
                      signal: 'datum'
                    }
                  },
                  update: {
                    interpolate: 'linear',
                    strokeOpacity: [
                      {
                        test: `(!domain || inrange(datum.${this.variable}, domain)) && (!length(data('selected')) || indata('selected', 'value', datum.station_name))`,
                        value: 1
                      },
                      { value: 0.15 }
                    ]
                  },
                  hover: {
                    strokeOpacity: { value: 0.7 }
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
