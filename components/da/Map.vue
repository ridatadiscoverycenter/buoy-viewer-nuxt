<template>
  <div class="mapboxgl-map-container">
    <div class="date">
      <span>{{ formattedDate }}</span>
    </div>
    <MglMap
      :access-token="accessToken"
      :map-style="mapStyle"
      :center.sync="mapCenter"
      :zoom="9"
      :scroll-zoom="false"
    >
      <div v-for="(point, index) in coordinates" :key="index">
        <MglMarker :coordinates="[point.longitude, point.latitude]">
          <BuoyMarker slot="marker" />
          <MglPopup> {{ point.station_name }}</MglPopup>
        </MglMarker>
      </div>
      <MglGeojsonLayer
        :layer="geoJsonlayer"
        :layer-id="geoJsonlayer.id"
        source-id="buoy"
        :source="selectedSamples"
      />
    </MglMap>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';

import BuoyMarker from '@/assets/illustrations/buoy-marker.svg';

export default {
  components: {
    BuoyMarker
  },
  data() {
    return {
      mapCenter: [-71.374022, 41.577553],
      accessToken: process.env.VUE_APP_MAPBOX_ACCESS_TOKEN, // access token. Needed if you using Mapbox maps
      geoJsonlayer: {
        id: 'data',
        type: 'circle',
        paint: {
          'circle-radius': ['get', 'size'],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.8
        }
      },
      mapStyle: process.env.VUE_APP_MAP_STYLE_LIGHT
    };
  },
  computed: {
    ...mapState('da', ['selectedDate', 'coordinates']),
    ...mapGetters('da', ['selectedSamples']),
    formattedDate() {
      return moment(this.selectedDate).format('DD MMMM YYYY');
    }
  }
};
</script>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>
<style src="vue-mapbox/dist/vue-mapbox.css"></style>

<style lang="sass" scoped>
.mapboxgl-map-container
  height: 70vh
  width: 100%
  position: relative

.mapboxgl-marker
  height: 1.2rem
  path
    fill: rgba(255,255,255,0.8)

.date
  font-size: 2.5rem
  font-weight: bold
  padding: 2rem
  position: absolute
  text-align: right
  width: 100%
  z-index: 10
  box-sizing: border-box
</style>
