<template>
  <NuxtChild />
</template>

<script>
import { mapState } from 'vuex';

export default {
  layout: 'dashboard',
  computed: {
    ...mapState('model', ['variables', 'coordinates', 'summary'])
  },
  created() {
    if (this.coordinates.length === 0) {
      this.$store.dispatch('model/fetchBuoyCoordinates');
    }
    if (this.summary.length === 0) {
      this.$store.dispatch('model/fetchSummaryData');
    }
    if (this.variables.length === 0) {
      this.$store.dispatch('model/fetchBuoyVariables');
    }
  }
};
</script>
