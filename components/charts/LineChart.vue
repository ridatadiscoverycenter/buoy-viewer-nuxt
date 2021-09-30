<script>
import vegaBaseMixin from '@/mixins/vega-base-mixin.js';

export default {
  mixins: [vegaBaseMixin],
  props: {
    variables: {
      type: Array,
      required: true,
    },
    x: {
      type: String,
      required: true,
    },
    y: {
      type: String,
      required: true,
    },
    compareDataset: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    compareLineWidth: {
      type: Number,
      required: true,
    },
    compareName: {
      type: String,
      required: true,
    },
    datasetName: {
      type: String,
      required: true,
    },
    datasetLineWidth: {
      type: Number,
      required: true,
    },
    colorDomain: {
      type: Array,
      required: true,
    },
    colorRange: {
      type: Array,
      required: true,
    },
    weatherDataset: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      dashes: [
        [1, 0],
        [1, 1],
        [3, 1],
        [5, 2],
      ],
    };
  },
  computed: {
    lineDashes() {
      return this.dashes.slice(0, this.variables.length);
    },
    yTitle() {
      return this.variables.length === 1 ? this.variables[0] : 'Variables';
    },
    legends() {
      const leg = [
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
                    value: 1,
                  },
                  { value: 0.15 },
                ],
                size: { value: 64 },
              },
              hover: {
                cursor: { value: 'pointer' },
              },
            },
            labels: {
              name: 'legendLabel',
              interactive: true,
              update: {
                opacity: [
                  {
                    test: '!selected || selected === datum.value',
                    value: 1,
                  },
                  { value: 0.25 },
                ],
                fontWeight: { value: 'normal' },
              },
              hover: {
                fontWeight: { value: 'bold' },
                cursor: { value: 'pointer' },
              },
            },
          },
        },
      ];
      if (this.compareDataset.length > 0) {
        leg.push({
          title: 'Datasets',
          strokeWidth: 'lineWidth',
          orient: 'bottom-right',
          symbolType: 'stroke',
        });
      }
      if (this.variables.length > 1) {
        leg.push({
          title: 'Variables',
          strokeDash: 'lineDash',
          orient: 'bottom-right',
          symbolType: 'stroke',
        });
      }

      return leg;
    },
    baseSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description:
          'A basic line chart example, with value labels shown upon mouse hover.',
        height: 800,
        padding: 5,
        autosize: { type: 'fit-x', resize: true },

        data: [
          {
            name: 'buoy',
            values: this.dataset,
            transform: [
              { type: 'formula', as: 'dataset', expr: `'${this.datasetName}'` },
            ],
          },
          {
            name: 'compare',
            values: this.compareDataset,
            transform: [
              { type: 'formula', as: 'dataset', expr: `'${this.compareName}'` },
            ],
          },
          {
            name: 'union',
            source: ['buoy', 'compare'],
            transform: [
              {
                type: 'formula',
                expr: 'toDate(datum.time)',
                as: 'time',
              },
            ],
          },
          {
            name: 'weather',
            values: this.weatherDataset,
          },
        ],

        scales: [
          {
            name: 'xscale',
            type: 'time',
            domain: {
              data: 'weather',
              field: 'date',
            },
            range: 'width',
            padding: 0.05,
            round: true,
          },
          {
            name: 'yscale',
            type: 'linear',
            domain: {
              fields: [{ data: 'union', field: 'value' }],
            },
            nice: true,
            zero: false,
            range: [500, 0],
          },
          {
            name: 'color',
            type: 'ordinal',
            range: this.colorRange,
            domain: this.colorDomain,
          },
          {
            name: 'lineWidth',
            type: 'ordinal',
            range: [this.datasetLineWidth, this.compareLineWidth],
            domain: [this.datasetName, this.compareName],
          },
          {
            name: 'lineDash',
            type: 'ordinal',
            range: this.lineDashes,
            domain: this.variables,
          },
          {
            name: 'tempScale',
            type: 'linear',
            domain: {
              data: 'weather',
              fields: ['minTemp', 'maxTemp'],
            },
            nice: true,
            zero: false,
            range: [200, 0],
          },
          {
            name: 'precipScale',
            type: 'linear',
            domain: {
              data: 'weather',
              field: 'precipitation',
            },
            nice: true,
            zero: false,
            range: [200, 0],
          },
          {
            name: 'colorScale',
            type: 'ordinal',
            domain: ['min', 'avg', 'max'],
            range: ['cornflowerblue', 'black', 'red'],
          },
          {
            name: 'rainScale',
            type: 'ordinal',
            domain: ['precipitation'],
            range: ['grey'],
          },
        ],

        marks: [
          {
            type: 'group',

            encode: {
              enter: {
                y: { value: 0 },
                width: { signal: 'width' },
                height: { value: 500 },
              },
            },

            signals: [
              {
                name: 'selected',
                value: null,
                on: [
                  {
                    events: '@legendSymbol:click, @legendLabel:click',
                    update: 'selected === datum.value ? null : datum.value',
                    force: true,
                  },
                  {
                    events: 'mouseup[!event.item]',
                    update: 'null',
                    force: true,
                  },
                ],
              },
              {
                name: 'hovered',
                value: null,
                on: [
                  { events: '@voronoi:mouseover', update: 'datum' },
                  { events: 'mouseout', update: 'null' },
                ],
              },
            ],

            axes: [
              { orient: 'bottom', scale: 'xscale' },
              { orient: 'left', scale: 'yscale', title: this.yTitle },
            ],

            legends: this.legends,

            marks: [
              {
                type: 'symbol',
                zindex: 1,
                encode: {
                  enter: {
                    size: { value: 20 },
                  },
                  update: {
                    fill: [
                      { test: '!hovered', value: 'transparent' },
                      { value: 'black' },
                    ],
                    x: { signal: 'hovered && hovered.x' },
                    y: { signal: 'hovered && hovered.y' },
                  },
                },
              },

              {
                type: 'symbol',
                name: 'secret_symbols',
                from: { data: 'union' },
                encode: {
                  enter: {
                    fill: { value: 'transparent' },
                    x: { scale: 'xscale', field: this.x },
                    y: { scale: 'yscale', field: 'value' },
                  },
                },
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
                      signal: `{ 'Variable': datum.datum.variable, 'Value': format(datum.datum.value, '.3f'), 'Date': utcFormat(datum.datum.${this.x}, '%Y-%m-%dT%H:%M:%S.%LZ'), 'Buoy': datum.datum.${this.y}, 'Dataset': datum.datum.dataset }`,
                    },
                  },
                },
                transform: [
                  {
                    type: 'voronoi',
                    x: 'datum.x',
                    y: 'datum.y',
                    size: [{ signal: 'width' }, 500],
                  },
                ],
              },

              {
                type: 'group',
                from: {
                  facet: {
                    name: 'series',
                    data: 'union',
                    groupby: ['station_name', 'variable', 'dataset'],
                  },
                },
                marks: [
                  {
                    type: 'line',
                    name: 'lines',
                    from: { data: 'series' },
                    encode: {
                      enter: {
                        x: { scale: 'xscale', field: this.x },
                        y: { scale: 'yscale', field: 'value' },
                        stroke: { scale: 'color', field: this.y },
                        strokeWidth: { scale: 'lineWidth', field: 'dataset' },
                        strokeDash: { scale: 'lineDash', field: 'variable' },
                        interactive: false,
                      },
                      update: {
                        strokeOpacity: [
                          {
                            test: '!selected || selected === datum.station_name',
                            value: 0.85,
                          },
                          { value: 0.15 },
                        ],
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            type: 'group',
            title: { text: 'Providence Area Weather', anchor: 'start' },

            encode: {
              enter: {
                y: { value: 560 },
                width: { signal: 'width' },
                height: { value: 200 },
              },
            },

            axes: [
              { orient: 'bottom', scale: 'xscale', title: 'Time' },
              {
                orient: 'left',
                scale: 'tempScale',
                title: 'Temperature (°C)',
                grid: false,
              },
              {
                orient: 'right',
                scale: 'precipScale',
                title: 'Precipitation (in)',
                grid: false,
              },
            ],

            legends: [
              {
                stroke: 'colorScale',
                orient: 'top-left',
                direction: 'horizontal',
                title: 'Temperature',
                encode: {
                  symbols: {
                    enter: {
                      shape: { value: 'stroke' },
                    },
                  },
                },
              },
            ],

            marks: [
              {
                type: 'line',
                from: { data: 'weather' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: 'date' },
                    y: { scale: 'tempScale', field: 'minTemp' },
                    stroke: { scale: 'colorScale', value: 'min' },
                    strokeWidth: { value: 1 },
                    zindex: { value: 1 },
                  },
                },
              },
              {
                type: 'line',
                from: { data: 'weather' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: 'date' },
                    y: { scale: 'tempScale', field: 'maxTemp' },
                    stroke: { scale: 'colorScale', value: 'max' },
                    strokeWidth: { value: 1 },
                    zindex: { value: 1 },
                  },
                },
              },
              {
                type: 'line',
                from: { data: 'weather' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: 'date' },
                    y: { scale: 'tempScale', field: 'avgTemp' },
                    stroke: { scale: 'colorScale', value: 'avg' },
                    strokeWidth: { value: 1 },
                    zindex: { value: 1 },
                  },
                },
              },
              {
                type: 'rect',
                from: { data: 'weather' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: 'date' },
                    width: { value: 1 },
                    y: { scale: 'precipScale', value: 0 },
                    y2: { scale: 'precipScale', field: 'precipitation' },
                    fill: { scale: 'rainScale', value: 'precipitation' },
                    opacity: { value: 0.7 },
                  },
                },
              },
            ],
          },
        ],
      };
    },
  },
};
</script>
