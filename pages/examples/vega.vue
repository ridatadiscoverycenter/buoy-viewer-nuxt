<template>
  <div>
    <div id="viz"></div>
    <select v-model="dataset">
      <option v-for="obj in options" :key="obj.name" :value="obj.data">{{
        obj.name
      }}</option>
    </select>
  </div>
</template>

<script>
import vega from 'vega-embed';
export default {
  data() {
    return {
      dataset: [
        { x: 0, y: 5.5 },
        { x: 1, y: 2.1 },
        { x: 2, y: 1.7 },
        { x: 3, y: 1.3 },
        { x: 4, y: 0.9 }
      ],
      options: [
        {
          name: 'd1',
          data: [
            { x: 0, y: 5.5 },
            { x: 1, y: 2.1 },
            { x: 2, y: 1.7 },
            { x: 3, y: 1.3 },
            { x: 4, y: 0.9 }
          ]
        },
        {
          name: 'd2',
          data: [
            { x: 0, y: 7.5 },
            { x: 1, y: 1.1 },
            { x: 2, y: 9.7 },
            { x: 3, y: 7.3 },
            { x: 4, y: 6.9 },
            { x: 5, y: 1.9 }
          ]
        }
      ]
    };
  },
  computed: {
    spec() {
      return {
        $schema: 'https://vega.github.io/schema/vega/v5.json',
        description:
          'A basic bar chart example, with value labels shown upon mouse hover.',
        width: 400,
        height: 200,
        padding: 5,

        data: [
          {
            name: 'table',
            values: this.dataset
          }
        ],

        signals: [
          {
            name: 'tooltip',
            value: {},
            on: [
              { events: 'rect:mouseover', update: 'datum' },
              { events: 'rect:mouseout', update: '{}' }
            ]
          }
        ],

        scales: [
          {
            name: 'xscale',
            type: 'band',
            domain: { data: 'table', field: 'x' },
            range: 'width',
            padding: 0.05,
            round: true
          },
          {
            name: 'yscale',
            domain: { data: 'table', field: 'y' },
            nice: true,
            range: 'height'
          }
        ],

        axes: [
          { orient: 'bottom', scale: 'xscale' },
          { orient: 'left', scale: 'yscale' }
        ],

        marks: [
          {
            type: 'rect',
            from: { data: 'table' },
            encode: {
              enter: {
                x: { scale: 'xscale', field: 'x' },
                width: { scale: 'xscale', band: 1 },
                y: { scale: 'yscale', field: 'y' },
                y2: { scale: 'yscale', value: 0 }
              },
              update: {
                fill: { value: 'steelblue' }
              },
              hover: {
                fill: { value: 'red' }
              }
            }
          },
          {
            type: 'text',
            encode: {
              enter: {
                align: { value: 'center' },
                baseline: { value: 'bottom' },
                fill: { value: '#333' }
              },
              update: {
                x: { scale: 'xscale', signal: 'tooltip.x', band: 0.5 },
                y: { scale: 'yscale', signal: 'tooltip.y', offset: -2 },
                text: { signal: 'tooltip.y' },
                fillOpacity: [
                  { test: 'datum === tooltip', value: 0 },
                  { value: 1 }
                ]
              }
            }
          }
        ]
      };
    }
  },
  created() {
    vega('#viz', this.spec, { actions: false });
  },
  updated() {
    vega('#viz', this.spec, { actions: false });
  }
};
</script>

<style lang="scss" scoped></style>
