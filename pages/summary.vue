<template>
  <div class="container">
    <BaseSelect
      id="variable"
      v-model="variable"
      class="control-item"
      label="Variable"
      :options="variables.variables"
    />
    <div class="plot-container">
      <div id="viz"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import vega from 'vega-embed';
import BaseSelect from '@/components/BaseSelect';

export default {
  components: {
    BaseSelect
  },
  data() {
    return {
      variable: 'WaterTempSurface'
    };
  },
  computed: {
    ...mapState('worker', ['summary']),
    ...mapState(['variables']),
    spec() {
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        width: 1000,
        height: 200,
        data: {
          values: this.summary
        },
        selection: {
          highlight: { type: 'single' }
        },
        mark: { type: 'rect', strokeWidth: 2, tooltip: true },
        encoding: {
          y: {
            field: 'station',
            type: 'nominal'
          },
          x: {
            field: 'date',
            type: 'nominal'
          },
          fill: {
            field: this.variable,
            type: 'quantitative'
          },
          stroke: {
            condition: {
              test: {
                and: [
                  { selection: 'highlight' },
                  'length(data("highlight_store"))'
                ]
              },
              value: 'black'
            },
            value: null
          },
          opacity: {
            condition: { selection: 'highlight', value: 1 },
            value: 0.5
          },
          order: { condition: { selection: 'highlight', value: 1 }, value: 0 }
        },
        config: {
          scale: {
            bandPaddingInner: 0,
            bandPaddingOuter: 0
          },
          view: { step: 40 },
          range: {
            ramp: {
              scheme: 'YellowGreenBlue'
            }
          },
          axis: {
            domain: false
          }
        }
      };
    }
  },
  mounted() {
    vega('#viz', this.spec, { actions: true, theme: 'vox' });
  },
  updated() {
    vega('#viz', this.spec, { actions: true, theme: 'vox' });
  }
};
</script>

<style lang="scss" scoped>
@import 'bulma';
.container {
  margin-top: 3rem;
}
.plot-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  overflow-x: scroll;
  padding: 5rem;
}
</style>
