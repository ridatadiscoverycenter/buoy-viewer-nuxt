<template>
  <div :id="id"></div>
</template>

<script>
import topojson from '@/static/ri.json';
import vegaBaseMixin from '@/mixins/vega-base-mixin.js';

export default {
  mixins: [vegaBaseMixin],
  props: {
    legend: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 720
    },
    background: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      topo: topojson,
      legendSpec: {
        legends: [
          {
            title: 'Buoys',
            orient: 'bottom-right',
            type: 'symbol',
            symbolType: 'circle',
            fill: 'color',
            columns: 2
          }
        ]
      }
    };
  },
  computed: {
    basicSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        height: this.height,
        background: this.background,
        data: [
          {
            name: 'outlines',
            values: this.topo,
            format: { type: 'topojson', mesh: 'ri' }
          },
          {
            name: 'points',
            values: this.dataset,
            format: { type: 'json', parse: 'auto' },
            transform: [
              {
                type: 'geopoint',
                projection: 'projection',
                fields: ['longitude', 'latitude']
              }
            ]
          }
        ],
        projections: [
          {
            name: 'projection',
            type: 'mercator',
            size: { signal: '[width, height]' },
            fit: { signal: 'data("outlines")' }
          }
        ],
        scales: [
          {
            name: 'color',
            type: 'ordinal',
            domain: { data: 'points', field: 'buoyId' },
            range: { scheme: 'tableau20' }
          }
        ],
        marks: [
          {
            type: 'shape',
            from: { data: 'outlines' },
            encode: {
              enter: {
                strokeWidth: { value: 1 },
                stroke: { value: 'slategray' },
                fill: { value: 'whitesmoke' }
              }
            },
            transform: [{ type: 'geoshape', projection: 'projection' }]
          },
          {
            type: 'symbol',
            from: { data: 'points' },
            encode: {
              enter: {
                size: { value: 100 },
                stroke: { value: 'steelblue' },
                fill: { scale: 'color', field: 'buoyId' },
                tooltip: {
                  signal: 'datum'
                }
              },
              update: {
                x: { field: 'x' },
                y: { field: 'y' }
              }
            }
          }
        ]
      };
    },
    spec() {
      return this.legend
        ? { ...this.basicSpec, ...this.legendSpec }
        : this.basicSpec;
    }
  }
};
</script>
