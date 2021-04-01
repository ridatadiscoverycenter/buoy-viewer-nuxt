<template>
  <div>
    <ChartContainer width="full">
      <template #title>Exploration Map</template>
      <template #chart>
        <div class="map-app-container">
          <DataCard />
          <Map />
          <Slider />
        </div>
      </template>
    </ChartContainer>

    <ChartContainer width="full">
      <template #title>About</template>
      <template #subtitle
        >This map on domoic acid concentrations in Narragansett Bay (NB) was
        generated from a research project carried out by the Bertin and Jenkins
        laboratories at University of Rhode Island funded by Rhode Island Sea
        Grant.</template
      >
      <template #chart>
        <div class="content columns pl-2 mx-0">
          <div class="column">
            <h3>Background</h3>
            <p>
              The project monitored species of the diatom Pseudo-nitzschia (P-n)
              and their production of the neurotoxin domoic acid at selected
              sites in NB, Rhode Island. While Pseudo-nitzschia species have
              been present in NB for over 50 years, the first Rhode Island
              shellfish closure due to high levels of domoic acid was not until
              October 2016. This event, and the continued detection of DA in the
              bay suggests that either species composition has shifted to more
              toxic-producing strains of P-n, or environmental conditions have
              changed in favor of making resident P-n more toxic. This 2016
              event sparked interest in identifying environmental drivers that
              lead to increased DA production as well as identifying P-n species
              composition in the bay.
            </p>

            <h3>Methods</h3>
            <p>
              Over a two-year period, our group has sampled NB weekly,
              collecting samples to measure various environmental factors such
              as dissolved nutrients, chlorophyll, temperature, and salinity.
              Additionally, we have monitored the P-n community (through genetic
              analysis), and particulate DA from phytoplankton samples using
              liquid chromatography-tandem mass spectrometry (LC-MS/MS). Our
              genetic means can distinguish between P-n species and our
              analytical methods are very sensitive and can detect very low
              levels of domoic acid (ng DA/L of seawater).
            </p>
          </div>

          <div class="column">
            <h3>Results</h3>
            <p>
              We have found seasonal differences in the P-n community in the
              bay, and we have found a seasonal pattern in toxic DA events. DA
              tends to be highest in the fall (September and October) and the
              late spring/early summer (June). We hypothesize that these
              distinct P-n communities are responsible for domoic acid
              production. However, we have yet to determine which environmental
              factors might be responsible for this.
            </p>

            <h3>Impact</h3>
            <p>
              We hope that this information will aid the stakeholders in Rhode
              Island by providing important data on when domoic acid neurotoxin
              is present in the NB and at what concentrations. This is very
              important as domoic can be found in shellfish that humans consume.
            </p>

            <h3>Learn More</h3>
            <p>
              The full dataset used to power this app is available on
              <a
                href="https://pricaimcit.services.brown.edu/erddap/griddap/da_4566_36f0_124a.html"
                >ERDDAP</a
              >. See our paper on the topic on <a>link to journal article</a>.
            </p>
          </div>
        </div>
      </template>
    </ChartContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ChartContainer from '@/components/base/ChartContainer.vue';
import DataCard from '@/components/da/DataCard';
import Slider from '@/components/da/Slider';
import Map from '@/components/da/Map';

export default {
  components: {
    ChartContainer,
    DataCard,
    Slider,
    Map
  },
  computed: {
    ...mapState('da', ['samples', 'dates'])
  }
};
</script>

<style scoped>
.map-app-container {
  position: relative;
}
</style>
