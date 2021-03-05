<template>
  <Heatmap
    v-if="!(summary.length === 0)"
    id="heatmap"
    :dataset="heatmapSummary"
    :min-width="400"
    x="date"
    y="variable"
    y-title="Variable"
    variable="count"
    :enable-darkmode="false"
  />
</template>

<script>
import * as aq from 'arquero';

import Heatmap from '@/components/charts/Heatmap.vue';

export default {
  comoonents: {
    Heatmap
  },
  props: {
    summary: {
      type: Array,
      required: true
    },
    variables: {
      type: Array,
      required: true
    }
  },
  computed: {
    heatmapSummary() {
      return aq
        .from(this.summary)
        .fold(this.variables, { as: ['variable', 'count'] })
        .objects();
    }
  }
};
</script>
