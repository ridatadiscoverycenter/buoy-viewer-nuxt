<template>
  <div>
    <ChartContainer width="two-thirds">
      <template #title>Fish Trawl Heatmap</template>
      <template #subtitle> A heatmap with fish!</template>
      <template #chart>
        <div>
          A heatmap of fish goes here, use the components/charts/Heatmap.vue as
          a starting point to copy from
        </div>
      </template>
    </ChartContainer>

    <!-- TODO: does this map work/make sense here -->
    <BuoyLocations :coordinates="coordinates" />

    <ChartContainer width="half">
      <template #title>Explore</template>
      <template #subtitle>Pick a fish!</template>
      <template #chart>
        fish form, probably needs something smaller, but similar to ExploreForm
      </template>
    </ChartContainer>

    <ChartContainer width="half" :height="3">
      <template #title>Learn More</template>
      <template #subtitle
        ><p>
          UPDATE THIS: The historical data available on this site has been
          compiled from the
          <a href="https://web.uri.edu/plankton/"
            >Narragansett Bay Time Series</a
          >
          and <a href="http://www.nabats.org/">NABATS.org</a>.
        </p>
        <p>
          <strong>To cite this data</strong>:
          <a href="https://web.uri.edu/gso/research/plankton/data/"
            >Plankton Time Data Page</a
          >, and for data prior to 1999: please honor the contributions of Prof.
          Smayda by properly citing the 1959 to 1997 NABATS data as: "Smayda,
          T.J. &amp; the Bunker C community (1959-1997). Narragansett Bay
          Plankton Time Series. Graduate School of Oceanography, URI. Data
          available at: <a href="http://www.nabats.org/">NABATS.org</a>"
        </p></template
      >
    </ChartContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ChartContainer from '@/components/base/ChartContainer.vue';
import BuoyLocations from '@/components/buoy/Locations.vue';

export default {
  components: {
    ChartContainer,
    BuoyLocations
  },
  computed: {
    ...mapState('fish', ['coordinates', 'fishData'])
  }
};
</script>

<style lang="scss">
@import 'bulma';

.compass-loading {
  @extend .mt-6;
  justify-self: center;
  align-self: center;
  font-size: 20rem !important;
  color: $link;
}
</style>