<template>
  <div class="is-flex-column">
    <div class="control-item control-item-first">
      <label for="variable" class="label">Variable</label>
      <multiselect
        id="variable"
        v-model="variable"
        class="multiselect"
        :options="variables"
        :custom-label="formatVariable"
      ></multiselect>
    </div>
    <Heatmap
      v-if="!(summary.length === 0)"
      id="heatmap"
      :dataset="summary"
      :min-width="400"
      :height="250"
      x="date"
      y="station_name"
      :variable="variable.name"
      :enable-darkmode="false"
    />
    <fa v-else icon="compass" spin class="compass-loading" />
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

import Heatmap from '@/components/charts/Heatmap.vue';

import { formatVariable } from '@/utils/utils.js';

export default {
  components: {
    Heatmap,
    Multiselect,
  },
  props: {
    summary: {
      type: Array,
      required: true,
    },
    variables: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      variable: this.variables[0] ?? { name: 'WaterTempSurface', units: '°C' },
    };
  },
  methods: {
    formatVariable,
  },
};
</script>
