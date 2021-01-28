<template>
  <NuxtChild />
</template>

<script>
import { mapState } from 'vuex';

export default {
  layout: 'dashboard',
  computed: {
    ...mapState('buoy', ['variables', 'coordinates', 'summary'])
  },
  created() {
    if (this.coordinates.length === 0) {
      this.$store.dispatch('buoy/fetchBuoyCoordinates');
    }
    if (this.summary.length === 0) {
      this.$store.dispatch('buoy/fetchSummaryData');
    }
    if (this.variables.length === 0) {
      this.$store.dispatch('buoy/fetchBuoyVariables');
    }
  }
};
</script>
