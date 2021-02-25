<template>
  <div>
    <main class="hero grid-container">
      <div class="item1 pt-4">
        <div class="center">
          <h1 class="home-title pb-4">Narragansett Bay Data Explorer</h1>
          <h2 class="home-subtitle pb-4">
            Explore historical data collected from multiple buoys in the
            Narragansett Bay
          </h2>
          <nuxt-link
            class="button is-large cfa-button is-link"
            :to="{
              name: 'datasets-historical-buoy-data'
            }"
          >
            <span class="action-button">Start Exploring</span>
            <fa class="ml-3 action-button" :icon="['fas', 'compass']" />
          </nuxt-link>
        </div>
      </div>
      <div class="item2 chart">
        <Map
          id="map"
          :min-width="300"
          :dataset="coordinates"
          :legend="false"
          :include-actions="false"
          :enable-darkmode="false"
          :color-domain="colorDomain"
          :color-range="colorRange"
        />
      </div>
    </main>
    <figure>
      <img
        class="waves"
        src="@/assets/illustrations/waves-small.png"
        alt="Waves Art"
        style="width:100%"
      />
    </figure>
  </div>
</template>

<script>
import * as aq from 'arquero';
import { mapState } from 'vuex';

import Map from '@/components/charts/Map.vue';
export default {
  components: {
    Map
  },
  computed: {
    ...mapState('buoy', ['coordinates']),
    ...mapState(['colorMap']),
    colorDomain() {
      if (this.coordinates.length > 0) {
        const stations = aq
          .from(this.coordinates)
          .groupby('station_name')
          .count()
          .objects();
        return stations.map((v) => v.station_name);
      } else {
        return [];
      }
    },
    colorRange() {
      return this.colorDomain.map((v) => this.colorMap[v]);
    }
  },
  created() {
    if (this.coordinates.length === 0) {
      this.$store.dispatch('buoy/fetchBuoyCoordinates');
    }
  }
};
</script>

<style lang="scss">
@import 'bulma';
$gradient1: #598daf;
$gradient2: #fdbc89;
$gradient3: #f8eade;
.is-link {
  background-color: rgb(89, 81, 139) !important;
}
.cfa-button {
  @extend .has-text-light;
}
.brand-title {
  @extend .mb-0;
  @extend .mr-2;
  font-weight: bold;
  font-size: 1.2rem;
}
.home-title {
  @extend .title;
  font-size: $size-1 * 1.4;
}
.home-subtitle {
  @extend .subtitle;
  font-size: $size-4 * 1.4;
}
.action-button {
  font-size: $size-3;
}
.disabled {
  background-color: #efefef !important;
  color: $grey !important;
  cursor: not-allowed;
  svg {
    margin-left: 1rem;
  }
}
.grid-container {
  background-image: linear-gradient($gradient1, $gradient2, $gradient3);
  display: grid !important;
  grid-template-columns: 1fr 4fr minmax(300px, 5fr) 1fr;
  grid-template-rows: 2rem auto;
  grid-template-areas:
    '. . . . '
    '. area1 area2 .';
  @include mobile {
    grid-template-rows: auto 0px;
    grid-template-columns: 1fr 20fr 1fr;
    grid-template-areas:
      '. area1 .'
      '. area2 .';
  }
}

.item1 {
  display: grid;
  grid-area: area1;
  align-content: start;
  justify-items: start;
  grid-template-columns: 1fr 9fr 1fr;
  grid-template-rows: 8rem auto 5rem;
  grid-template-areas:
    '. top .'
    '. center .'
    '. bottom .';
}
.center {
  grid-area: center;
}
.item2 {
  grid-area: area2;
  display: grid;
  justify-content: center;
  align-content: center;
  max-width: 100vw;
  @include mobile {
    display: none;
    visibility: hidden;
  }
}
.waves {
  margin-top: -10rem;
  @include mobile {
    visibility: hidden;
  }
}
</style>
