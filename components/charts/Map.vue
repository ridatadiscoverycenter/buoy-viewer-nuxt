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
    dataset: {
      type: Array,
      required: true
    },
    width: {
      type: Number,
      default: 550
    },
    height: {
      type: Number,
      default: 720
    },
    scale: {
      type: Number,
      default: 30000
    },
    background: {
      type: String,
      default: 'transparent'
    },
    center: {
      type: Array,
      default: () => [-71.1774, 41.8]
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
            fill: 'color'
          }
        ]
      }
    };
  },
  computed: {
    basicSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        width: this.width,
        height: this.height,
        autosize: 'none',
        background: this.background,
        data: [
          {
            name: 'outlines',
            values: this.topo,
            format: { type: 'topojson', feature: 'ri' }
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
            scale: this.scale,
            center: this.center
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
  },
  watch: {
    scale(newValue, oldValue) {
      this.updatePlot();
    }
  }
};
</script>
