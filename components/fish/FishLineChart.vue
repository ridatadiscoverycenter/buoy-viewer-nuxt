<script>
import { mapState } from 'vuex';

import vegaBaseMixin from '@/mixins/vega-base-mixin.js';

export default {
  mixins: [vegaBaseMixin],
  computed: {
    ...mapState(['colorMap']),
    ...mapState('fish', ['stations', 'temps']),
    colorRange() {
      return this.stations.map((v) => this.colorMap[v]);
    },
    baseSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description:
          'Fish trawl survey line chart, with value labels shown upon mouse hover.',
        height: 500,
        padding: 5,

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

        data: [
          {
            name: 'fish',
            values: this.dataset,
            transform: [
              { type: 'formula', as: 'time', expr: 'utc(datum.year, 6)' },
            ],
          },
          {
            name: 'temps',
            values: this.temps,
            transform: [
              {
                type: 'formula',
                as: 'utc_time',
                expr: "utcParse(datum.time, '%Y-%m-%dT%H:%M:%SZ')",
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
            name: 'yscale',
            type: 'linear',
            domain: { data: 'fish', field: 'abun' },
            nice: true,
            zero: true,
            range: 'height',
          },
          {
            name: 'tempscale',
            type: 'linear',
            domain: {
              fields: [
                { data: 'temps', field: 'Bottom_Temperature' },
                { data: 'temps', field: 'Surface_Temperature' },
              ],
            },
            nice: true,
            range: 'height',
          },
          {
            name: 'color',
            type: 'ordinal',
            range: this.colorRange,
            domain: this.stations,
          },
        ],

        axes: [
          { orient: 'bottom', scale: 'xscale', title: 'Year' },
          { orient: 'left', scale: 'yscale', title: 'Abundance', grid: false },
          {
            orient: 'right',
            scale: 'tempscale',
            title: 'Water Temperature (C)',
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
                y: { scale: 'yscale', field: 'abun' },
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
                size: [{ signal: 'width' }, { signal: 'height' }],
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
                    y: { scale: 'yscale', field: 'abun' },
                    stroke: { scale: 'color', field: 'station' },
                    interactive: false,
                  },
                },
              },
            ],
          },

          {
            type: 'group',
            from: {
              facet: {
                name: 'temp_data',
                data: 'temps',
                groupby: ['Station'],
              },
            },
            marks: [
              {
                type: 'line',
                from: { data: 'temp_data' },
                encode: {
                  enter: {
                    x: { scale: 'xscale', field: 'utc_time' },
                    y: { scale: 'tempscale', field: 'Surface_Temperature' },
                    stroke: { scale: 'color', field: 'Station' },
                    interactive: false,
                    strokeWidth: { value: 1 },
                    opacity: { value: 0.5 },
                    defined: { signal: 'datum.Surface_Temperature != null' },
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
