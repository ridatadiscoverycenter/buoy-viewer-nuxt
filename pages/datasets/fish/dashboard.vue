<template>
  <div>
    <ChartContainer width="two-thirds" :height="3">
      <template #title>{{ species }}</template>
      <template #subtitle>Details about this fish.</template>
      <template #chart>
        <FishLineChart
          v-if="fishData.length > 0 && temps.length > 0"
          id="line-chart"
          :dataset="fishData"
          :temps="temps"
          :enable-darkmode="false"
        />
      </template>
    </ChartContainer>

    <BuoyLocations :coordinates="coordinates" location-type="Survey" />

    <ChartContainer width="one-third" :height="2">
      <template #title>Keep Exploring</template>
      <template #subtitle>Pick another species to learn more about!</template>
      <template #chart>
        <FishExploreForm />
      </template>
    </ChartContainer>

    <CompassLoading :manual-load="loading" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ChartContainer from '@/components/base/ChartContainer.vue';
import BuoyLocations from '@/components/buoy/Locations.vue';
import FishExploreForm from '@/components/fish/FishExploreForm.vue';
import FishLineChart from '@/components/fish/FishLineChart.vue';
import CompassLoading from '@/components/loading.vue';

export default {
  components: {
    ChartContainer,
    BuoyLocations,
    FishExploreForm,
    FishLineChart,
    CompassLoading,
  },
  data() {
    return {
      species: '',
      loading: true,
    };
  },
  fetch() {
    this.loading = true;
    this.species = this.$route.query.species;
  },
  computed: {
    ...mapState('fish', ['coordinates', 'samples', 'stations', 'temps']),
    fishData() {
      return this.samples.filter((s) => s.title === this.species);
    },
  },
  watch: {
    '$route.query': '$fetch',
    fishData(newData, oldData) {
      if (newData.length > 0 && newData[0].title === this.species) {
        this.loading = false;
      }
    },
  },
};
</script>
