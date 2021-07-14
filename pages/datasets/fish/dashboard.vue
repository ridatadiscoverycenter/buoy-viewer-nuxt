<template>
  <div>
    <ChartContainer width="two-thirds" :height="5">
      <template #title>{{ species }}</template>
      <template #chart>
        <div v-if="info.sciName" class="message is-info is-light mx-4">
          <div class="message-header">
            <p>Species Info</p>
            <a
              v-if="info.href"
              :href="info.href"
              class="is-size-7 has-text-weight-light"
              >Source: FishBase</a
            >
          </div>
          <div class="message-body">
            <figure v-if="info.photoUrl" class="image is-128x128 fish-image">
              <img :src="info.photoUrl" :alt="'Photo of ' + species" />
            </figure>
            <div>
              <p><strong>Scientific Name:</strong> {{ info.sciName }}</p>
              <p v-if="info.sectionData">
                <strong>IUCN Status:</strong> {{ info.sectionData.IUCN }}
              </p>
              <p v-if="info.sectionData">
                <strong>Classification:</strong>
                {{ info.sectionData.Classification.Classification }}
              </p>
            </div>
          </div>
        </div>
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
  async fetch() {
    this.loading = true;
    this.species = this.$route.query.species;
    await this.$store.dispatch('fish/fetchInfo', this.species);
  },
  computed: {
    ...mapState('fish', [
      'coordinates',
      'samples',
      'stations',
      'temps',
      'info',
    ]),
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

<style lang="scss" scoped>
.fish-image {
  float: right;
}
</style>