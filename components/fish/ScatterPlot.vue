<script>
import vegaBaseMixin from '@/mixins/vega-base-mixin.js';

export default {
  mixins: [vegaBaseMixin],
  props: {
    variable: {
      type: String,
      required: true,
    },
    station: {
      type: String,
      required: true,
    },
    x: {
      type: String,
      required: true,
    },
    xTitle: {
      type: String,
      required: false,
      default: 'Month/Year',
    },
    xUnit: {
      type: String,
      required: false,
      default: 'month',
    },
    y: {
      type: String,
      required: true,
    },
    yTitle: {
      type: String,
      required: false,
      default: 'Buoy',
    },
    height: {
      type: Number,
      required: false,
      default: 300,
    },
  },
  computed: {
    baseSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        height: this.height,
        data: [
          {
            name: 'rawData',
            values: this.dataset,
          },
          {
            name: 'data',
            source: 'rawData',
            transform: [
              { type: 'filter', expr: `datum.station == "${this.station}"` },
              { type: 'formula', as: 'loga', expr: 'log(datum.abun) / LN10' },
            ],
          },
        ],
        mark: 'circle',
        encoding: {
          x: {
            bin: { maxbins: 20 },
            field: this.x,
          },
          y: {
            bin: { maxbins: 10 },
            field: this.y,
          },
          size: { field: 'abun' },
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
