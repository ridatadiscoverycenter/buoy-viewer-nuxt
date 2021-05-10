<template>
  <Dashboard>
    <template #main-nav>
      <Breadcrumb :path="$route.path" />
    </template>
    <template #main-header
      ><span class="title"
        ><fa icon="chart-area" class="mr-2" />Domoic Acid</span
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

export default {
  layout: 'dashboard',
  components: {
    Dashboard,
    Breadcrumb
  },
  computed: {
    ...mapState('da', ['coordinates', 'samples'])
  },
  created() {
    if (this.coordinates.length === 0) {
      this.$store.dispatch('da/fetchCoordinates');
    }
    if (this.samples.length === 0) {
      this.$store.dispatch('da/fetchSamples');
    }
  }
};
</script>
