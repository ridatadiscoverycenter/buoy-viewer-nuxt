<template>
  <Dashboard>
    <template #main-nav>
      <Breadcrumb :path="$route.path" />
    </template>
    <template #main-header
      ><span class="title"
        ><fa icon="chart-area" class="mr-2" />Fish Trawl Survey -
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
  if (lastPart === 'fish') {
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
    ...mapState('fish', ['coordinates', 'samples'])
  },
  watch: {
    $route(val) {
      this.pageName = getPageName(val.path);
    }
  },
  created() {
    // TODO: review if these are the right/all data that should be loaded on navigation to any fish trawl page
    if (this.coordinates.length === 0) {
      this.$store.dispatch('fish/fetchCoordinates');
    }
    if (this.summary.length === 0) {
      this.$store.dispatch('fish/fetchSamples');
    }
  }
};
</script>
