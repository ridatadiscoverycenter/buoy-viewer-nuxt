<script>
import vegaBaseMixin from '@/mixins/vega-base-mixin.js';

import coastlines from '@/static/ri_coast.json';
import ripoly from '@/static/ri.json';

export default {
  mixins: [vegaBaseMixin],
  props: {
    legend: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      default: 720,
    },
    background: {
      type: String,
      default: 'transparent',
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
      legendSpec: {
        legends: [
          {
            title: 'Buoys',
            orient: 'bottom-left',
            type: 'symbol',
            symbolType: 'circle',
            fill: 'color',
            columns: 2,
          },
        ],
      },
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
            values: coastlines,
          },
          {
            name: 'ri',
            values: ripoly,
            format: { type: 'topojson', mesh: 'ri' },
          },
          {
            name: 'points',
            values: this.dataset,
            format: { type: 'json', parse: 'auto' },
            transform: [
              {
                type: 'geopoint',
                projection: 'projection',
                fields: ['longitude', 'latitude'],
              },
            ],
          },
        ],
        projections: [
          {
            name: 'projection',
            type: 'mercator',
            size: { signal: '[width, height]' },
            fit: { signal: '[data("ri"), data("outlines")]' },
          },
        ],
        scales: [
          {
            name: 'color',
            type: 'ordinal',
            range: this.colorRange,
            domain: this.colorDomain,
          },
        ],
        marks: [
          {
            type: 'shape',
            from: { data: 'outlines' },
            encode: {
              enter: {
                strokeWidth: { value: 1 },
                stroke: { value: '#d3d3d3' },
              },
            },
            transform: [{ type: 'geoshape', projection: 'projection' }],
          },
          {
            type: 'shape',
            from: { data: 'ri' },
            encode: {
              enter: {
                strokeWidth: { value: 1 },
                stroke: { value: '#d3d3d3' },
                fill: { value: 'whitesmoke' },
              },
            },
            transform: [{ type: 'geoshape', projection: 'projection' }],
          },
          {
            type: 'symbol',
            from: { data: 'points' },
            encode: {
              enter: {
                size: { value: 100 },
                stroke: { scale: 'color', field: 'station_name' },
                fill: { scale: 'color', field: 'station_name' },
                tooltip: {
                  signal:
                    '{"Buoy ID": datum.buoyId, "Station Name": datum.station_name, "Latitude": format(datum.latitude, ".4f"), "Longitude": format(datum.longitude, ".4f")}',
                },
              },
              update: {
                x: { field: 'x' },
                y: { field: 'y' },
              },
            },
          },
        ],
      };
    },
    baseSpec() {
      return this.legend
        ? { ...this.basicSpec, ...this.legendSpec }
        : this.basicSpec;
    },
  },
};
</script>
