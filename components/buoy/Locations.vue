<template>
  <ChartContainer width="one-third" :height="height">
    <template #title>{{ locationType }} Locations</template>
    <template #subtitle
      >Hover over the circles to find out the buoy locations.</template
    >
    <template #chart>
      <Map
        id="map"
        :height="400"
        :dataset="coordinates"
        :enable-darkmode="false"
        :color-domain="colorDomain"
        :color-range="colorRange"
      />
    </template>
  </ChartContainer>
</template>

<script>
import { mapState } from 'vuex';
import * as aq from 'arquero';

import ChartContainer from '@/components/base/ChartContainer.vue';
import Map from '@/components/charts/Map.vue';

export default {
  components: {
    ChartContainer,
    Map,
  },
  props: {
    coordinates: {
      type: Array,
      required: true,
    },
    height: {
      type: Number,
      required: false,
      default: 2,
    },
    locationType: {
      type: String,
      default: 'Buoy',
    },
  },
  computed: {
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
    },
  },
};
</script>
