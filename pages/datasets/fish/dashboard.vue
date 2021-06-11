<template>
  <div>
    <ChartContainer width="two-thirds" :height="3">
      <template #title>{{ species }}</template>
      <template #subtitle>Details about this fish.</template>
      <template #chart>
        <FishLineChart
          id="line-chart"
          :dataset="fishData"
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
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ChartContainer from '@/components/base/ChartContainer.vue';
import BuoyLocations from '@/components/buoy/Locations.vue';
import FishExploreForm from '@/components/fish/FishExploreForm.vue';
import FishLineChart from '@/components/fish/FishLineChart.vue';

export default {
  components: {
    ChartContainer,
    BuoyLocations,
    FishExploreForm,
    FishLineChart,
  },
  data() {
    return {
      loading: false,
      species: '',
    };
  },
  fetch() {
    this.species = this.$route.query.species;
  },
  computed: {
    ...mapState('fish', ['coordinates', 'samples', 'stations']),
    fishData() {
      return this.samples.filter((s) => s.title === this.species);
    },
  },
  watchQuery: ['species'],
};
</script>
