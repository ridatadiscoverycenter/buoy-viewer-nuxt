<template>
  <div>
    <ChartContainer width="full">
      <template #title>Fish Trawl Survey</template>
      <template #subtitle
        ><p>
          The University of Rhode Island Graduate School of Oceanography Fish
          Trawl Survey is a state funded survey of the bottom fish and
          invertebrate community in Narragansett Bay, Rhode Island. The survey
          was initiated in 1959 by Charles J. Fish, founder and director of the
          Narragansett Marine Laboratory, the precursor to the Graduate School
          of Oceanography. The Fish Trawl Survey was developed to quantify the
          seasonal occurrences of migratory fish populations, whereas scientists
          had previously relied on anecdotal information.
        </p>
        <br />
        <p>
          The heatmap below shows the abundance by year of the most commonly
          found fish in the University of Rhode Island Graduate School of
          Oceanography Fish Trawl Survey. The icons are sized and colored by
          abundance. To learn more about a species, select one from the
          "Explore" panel.
        </p></template
      >
      <template #chart>
        <div class="is-flex-column">
          <div class="control-item control-item-first">
            <label for="station" class="label">Station</label>
            <multiselect
              id="station"
              v-model="station"
              class="multiselect"
              :options="stations"
            ></multiselect>
          </div>
          <FishHeatMap
            v-if="samples.length > 0"
            id="heatmap"
            :dataset="samples"
            :min-width="800"
            :station="station"
            :enable-darkmode="false"
          />
        </div>
      </template>
    </ChartContainer>

    <BuoyLocations :coordinates="coordinates" location-type="Survey" />

    <ChartContainer width="two-thirds" :height="1">
      <template #title>Explore</template>
      <template #subtitle>Pick a species to learn more about!</template>
      <template #chart>
        <FishExploreForm />
      </template>
    </ChartContainer>

    <ChartContainer width="two-thirds" :height="1">
      <template #title>Learn More</template>
      <template #subtitle
        ><p>
          The data available on this site has been compiled from the
          <a href="https://web.uri.edu/fishtrawl/"
            >University of Rhode Island Graduate School of Oceanography Fish
            Trawl Survey</a
          >.
        </p>
        <p>
          <strong>To cite this data</strong>:
          <a href="https://web.uri.edu/fishtrawl/data/">Fish Trawl Data Page</a>
        </p>
        <br />
        <p>
          The data has also been made available on
          <a
            href="https://pricaimcit.services.brown.edu/erddap/search/index.html?page=1&itemsPerPage=1000&searchFor=Fish+Trawl"
            >ERDDAP</a
          >.
        </p>
      </template>
    </ChartContainer>

    <CompassLoading :manual-load="samples.length === 0" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

import ChartContainer from '@/components/base/ChartContainer.vue';
import BuoyLocations from '@/components/buoy/Locations.vue';
import FishHeatMap from '@/components/fish/FishHeatMap.vue';
import FishExploreForm from '@/components/fish/FishExploreForm.vue';
import CompassLoading from '@/components/loading.vue';

export default {
  components: {
    ChartContainer,
    BuoyLocations,
    FishHeatMap,
    FishExploreForm,
    Multiselect,
    CompassLoading,
  },
  data() {
    return {
      station: 'Fox Island',
    };
  },
  computed: {
    ...mapState('fish', ['coordinates', 'samples', 'stations']),
  },
};
</script>
