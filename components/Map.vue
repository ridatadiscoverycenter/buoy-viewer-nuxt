<template>
  <div class="plot-container">
    <div :id="id"></div>
  </div>
</template>

<script>
import vega from 'vega-embed';
import topojson from '@/static/ri.json';

export default {
  props: {
    points: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      default: 'viz'
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 800
    },
    scale: {
      type: Number,
      default: 30000
    },
    background: {
      type: String,
      default: 'white'
    },
    center: {
      type: Array,
      default: () => [-71.1774, 41.6801]
    }
  },
  data() {
    return {
      topo: topojson
    };
  },
  computed: {
    spec() {
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
            values: this.points,
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
        marks: [
          {
            type: 'shape',
            from: { data: 'outlines' },
            encode: {
              enter: {
                strokeWidth: { value: 1 },
                stroke: { value: '#bbb' }
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
                fill: { value: 'steelblue' },
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
    }
  },
  watch: {
    points(newValue, oldValue) {
      this.updatePlot();
    }
  },
  mounted() {
    this.updatePlot();
  },
  updated() {
    this.updatePlot();
  },
  methods: {
    updatePlot() {
      vega(`#${this.id}`, this.spec, {
        actions: true,
        theme: 'vox',
        renderer: 'svg'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.plot-container {
  margin-top: 5rem;
}
</style>
