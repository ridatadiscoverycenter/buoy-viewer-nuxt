<template>
  <Dashboard>
    <template #main-nav>
      <Breadcrumb :path="$route.path" />
    </template>
    <template #main-header
      ><span class="title"
        ><fa icon="chart-area" class="mr-2" />Plankton Time Series -
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
  if (lastPart === 'plankton') {
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
    ...mapState('plankton', ['variables', 'coordinates', 'summary'])
  },
  watch: {
    $route(val) {
      this.pageName = getPageName(val.path);
    }
  },
  created() {
    if (this.coordinates.length === 0) {
      this.$store.dispatch('plankton/fetchBuoyCoordinates');
    }
    if (this.summary.length === 0) {
      this.$store.dispatch('plankton/fetchSummaryData');
    }
    if (this.variables.length === 0) {
      this.$store.dispatch('plankton/fetchBuoyVariables');
    }
  }
};
</script>
