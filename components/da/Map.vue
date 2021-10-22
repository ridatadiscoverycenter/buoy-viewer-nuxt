<template>
  <div class="mapboxgl-map-container">
    <div class="date is-hidden-touch">
      <span>{{ formattedDate }}</span>
    </div>
    <div class="date-mobile is-hidden-desktop">
      <span>{{ formattedDate }}</span>
    </div>
    <client-only>
      <MglMap
        :access-token="accessToken"
        :map-style="mapStyle"
        :center.sync="mapCenter"
        :zoom="9"
        :scroll-zoom="false"
      >
        <div v-for="(point, index) in activeCoordinates" :key="index">
          <MglMarker :coordinates="[point.longitude, point.latitude]">
            <BuoyMarker slot="marker" />
            <MglPopup> {{ point.station_name }}</MglPopup>
          </MglMarker>
        </div>
        <MglGeojsonLayer
          :layer="geoJsonlayer"
          :layer-id="geoJsonlayer.id"
          source-id="buoy"
          :source="selectedSamplesGeoJSON"
        />
      </MglMap>
    </client-only>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';

import BuoyMarker from '@/assets/illustrations/buoy-marker.svg?inline';

export default {
  components: {
    BuoyMarker,
  },
  data() {
    return {
      mapCenter: [-71.46, 41.5],
      accessToken: process.env.NUXT_ENV_MAPBOX_ACCESS_TOKEN, // access token. Needed if using Mapbox maps
      geoJsonlayer: {
        id: 'data',
        type: 'circle',
        paint: {
          'circle-radius': ['get', 'size'],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.8,
        },
      },
      mapStyle: 'mapbox://styles/ccv-bot/ckmxra8oi0rsw17mzcbqrktzi',
    };
  },
  computed: {
    ...mapState('da', ['selectedDate']),
    ...mapGetters('da', ['selectedSamplesGeoJSON', 'activeCoordinates']),
    formattedDate() {
      return moment(this.selectedDate).format('DD MMMM YYYY');
    },
  },
};
</script>

<style lang="sass" scoped>
.mapboxgl-map-container
  height: 70vh
  width: 100%
  position: relative

.date
  font-size: 2.5rem
  font-weight: bold
  padding: 2rem
  position: absolute
  text-align: right
  width: 100%
  z-index: 10
  box-sizing: border-box

.date-mobile
  font-size: 1.25rem
  font-weight: bold
  padding: 1rem
  position: absolute
  text-align: right
  width: 100%
  z-index: 10
  box-sizing: border-box
</style>

<style lang="sass">
.mapboxgl-marker
  height: 1.2rem
  path
    fill: hsla(0deg, 0%, 20%, 80%)
</style>
