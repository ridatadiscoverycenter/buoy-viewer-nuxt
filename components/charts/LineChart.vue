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
        ],

        scales: [
          {
            name: 'xscale',
            type: 'time',
            domain: {
              fields: [{ data: 'union', field: this.x }],
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
            range: 'height',
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
        ],

        axes: [
          { orient: 'bottom', scale: 'xscale', labelAngle: 15, title: 'Time' },
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
                  signal: `{ 'Variable': datum.datum.variable, 'Value': datum.datum.value, 'Date': utcFormat(datum.datum.${this.x}, '%Y-%m-%dT%H:%M:%S.%LZ'), 'Buoy': datum.datum.${this.y}, 'Dataset': datum.datum.dataset }`,
                },
              },
            },
            transform: [
              {
                type: 'voronoi',
                x: 'datum.x',
                y: 'datum.y',
                size: [{ signal: 'width' }, { signal: 'height' }],
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
                        test: `!selected || selected === datum.station_name`,
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
      };
    },
  },
};
</script>
