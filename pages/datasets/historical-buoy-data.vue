<template>
  <Dashboard>
    <template #main-nav>
      <Breadcrumb :path="$route.path" />
    </template>
    <template #main-header
      ><span class="title"
        ><fa icon="chart-area" class="mr-2" />Historical Buoy Data -
        {{ pageName }}</span
      >
    </template>
    <template #main-section>
      <NuxtChild />
    </template>
  </Dashboard>
</template>

<script>
import { mapState } from 'vuex';
import Dashboard from '@/components/base/BaseDashboard.vue';
import Breadcrumb from '@/components/base/Breadcrumb.vue';

const getPageName = (path) => {
  const pathParts = path.split('/').filter((part) => part.length > 0);
  const lastPart = pathParts.pop();
  if (lastPart === 'historical-buoy-data') {
    return 'Summary';
  } else {
    return lastPart.substring(0, 1).toUpperCase() + lastPart.substring(1);
  }
};

export default {
  layout: 'dashboard',
  components: {
    Dashboard,
    Breadcrumb
  },
  data() {
    return {
      pageName: getPageName(this.$route.path)
    };
  },
  computed: {
    ...mapState('buoy', ['variables', 'coordinates', 'summary'])
  },
  watch: {
    $route(val) {
      this.pageName = getPageName(val.path);
    }
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
