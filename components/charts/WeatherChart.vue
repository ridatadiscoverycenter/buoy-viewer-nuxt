<script>
import vegaBaseMixin from '@/mixins/vega-base-mixin.js';

export default {
  mixins: [vegaBaseMixin],
  props: {
    dataset: {
      type: Array,
      required: true,
    },
  },
  computed: {
    baseSpec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        height: 200,
        autosize: { type: 'fit', resize: true },
        padding: { right: 10 },

        data: [
          {
            name: 'weather',
            values: this.dataset,
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
            name: 'tempScale',
            type: 'linear',
            domain: {
              data: 'weather',
              fields: ['minTemp', 'maxTemp'],
            },
            nice: true,
            zero: false,
            range: 'height',
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
            range: 'height',
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
      };
    },
  },
};
</script>
