<script>
import { mapState } from 'vuex';

import vegaBaseMixin from '@/mixins/vega-base-mixin.js';

export default {
  mixins: [vegaBaseMixin],
  props: {
    temps: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapState(['colorMap']),
    ...mapState('fish', ['stations']),
    colorRange() {
      return this.stations.map((v) => this.colorMap[v]);
    },
    baseSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description:
          'Fish trawl survey line chart, with value labels shown upon mouse hover.',
        height: 700,
        padding: 5,

        signals: [
          {
            name: 'chartHeight',
            update: 'height / 2 - 20',
          },
        ],

        data: [
          {
            name: 'fish',
            values: this.dataset,
            transform: [
              { type: 'formula', as: 'time', expr: 'utc(datum.year, 0)' },
            ],
          },
          {
            name: 'temps',
            values: this.temps,
            transform: [
              {
                type: 'formula',
                as: 'utc_time',
                expr: "utcParse(datum.year_month, '%Y-%m-%dT%H:%M:%S.%LZ')",
              },
            ],
          },
        ],

        scales: [
          {
            name: 'xscale',
            type: 'utc',
            domain: { data: 'fish', field: 'time' },
            range: 'width',
            padding: 0.05,
            round: true,
          },
          {
            name: 'yfish',
            type: 'linear',
            domain: { data: 'fish', field: 'abun' },
            nice: true,
            zero: true,
            range: [{ signal: 'chartHeight' }, 0],
          },
          {
            name: 'ytemps',
            type: 'linear',
            domain: { data: 'temps', field: 'delta' },
            nice: true,
            zero: true,
            range: [{ signal: 'chartHeight / 2' }, 0],
          },
          {
            name: 'color',
            type: 'ordinal',
            range: this.colorRange,
            domain: this.stations,
          },
        ],

        marks: [
          {
            type: 'group',
            desctiption: 'Fish Abundance',
            name: 'fishplot',

            encode: {
              enter: {
                y: { value: 0 },
                width: { signal: 'width' },
                height: { signal: 'chartHeight' },
              },
            },

            signals: [
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
              { orient: 'bottom', scale: 'xscale', title: 'Year' },
              {
                orient: 'left',
                scale: 'yfish',
                title: 'Abundance',
                grid: false,
              },
            ],

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
                from: { data: 'fish' },
                encode: {
                  enter: {
                    fill: { value: 'transparent' },
                    x: { scale: 'xscale', field: 'time' },
                    y: { scale: 'yfish', field: 'abun' },
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
                      signal: `{ 'Abundance': format(datum.datum.abun, ',.3f'), 'Year': datum.datum.year, 'Station': datum.datum.station }`,
                    },
                  },
                },
                transform: [
                  {
                    type: 'voronoi',
                    x: 'datum.x',
                    y: 'datum.y',
                    size: [{ signal: 'width' }, { signal: 'chartHeight' }],
                  },
                ],
              },

              {
                type: 'group',
                from: {
                  facet: {
                    name: 'series',
                    data: 'fish',
                    groupby: ['station'],
                  },
                },
                marks: [
                  {
                    type: 'line',
                    from: { data: 'series' },
                    encode: {
                      enter: {
                        x: { scale: 'xscale', field: 'time' },
                        y: { scale: 'yfish', field: 'abun' },
                        stroke: { scale: 'color', field: 'station' },
                        interactive: false,
                      },
                    },
                  },
                ],
              },
            ],
          },
          this.locationSpec('Whale Rock', 'height / 2'),
          this.locationSpec('Fox Island', 'height * 3 / 4'),
        ],
      };
    },
  },
  methods: {
    locationSpec(location, ySpec) {
      return {
        type: 'group',
        desctiption: `${location} Water Temperature`,
        name: location.replace(' ', '_'),

        encode: {
          enter: {
            y: { signal: ySpec },
            width: { signal: 'width' },
            height: { signal: 'chartHeight / 2' },
          },
        },

        data: [
          {
            name: 'loc_temps',
            source: 'temps',
            transform: [
              { type: 'filter', expr: `datum.Station === "${location}"` },
              { type: 'filter', expr: 'datum.level === "Surface"' },
            ],
          },
        ],

        signals: [
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
          { orient: 'bottom', scale: 'xscale', title: 'Year' },
          { orient: 'left', scale: 'ytemps', title: location, grid: false },
        ],

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
            from: { data: 'loc_temps' },
            encode: {
              enter: {
                fill: { value: 'transparent' },
                x: { scale: 'xscale', field: 'utc_time' },
                y: { scale: 'ytemps', field: 'delta' },
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
                  signal: `{ 'Water Temperature': format(datum.datum.delta, ',.3f'), 'Level': datum.datum.level, 'Year': datum.datum.utc_time, 'Station': datum.datum.Station }`,
                },
              },
            },
            transform: [
              {
                type: 'voronoi',
                x: 'datum.x',
                y: 'datum.y',
                size: [{ signal: 'width' }, { signal: 'chartHeight / 2' }],
              },
            ],
          },

          {
            type: 'group',
            from: {
              facet: {
                name: 'series',
                data: 'loc_temps',
                groupby: ['key'],
              },
            },
            marks: [
              {
                type: 'line',
                from: { data: 'series' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: 'utc_time' },
                    y: { scale: 'ytemps', field: 'delta' },
                    stroke: { signal: `scale("color", "${location}")` },
                    interactive: false,
                    defined: { signal: 'datum.delta != null' },
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
