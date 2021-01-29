<template>
  <ChartContainer width="one-third">
    <template #title>Buoy Locations</template>
    <template #subtitle
      >Hover over the circles to find out the buoy locations.</template
    >
    <template #chart>
      <Map
        id="map"
        :height="400"
        :dataset="coordinates"
        :enable-darkmode="false"
      />
    </template>
  </ChartContainer>
</template>

<script>
import ChartContainer from '@/components/base/ChartContainer.vue';
import Map from '@/components/charts/Map.vue';

export default {
  components: {
    ChartContainer,
    Map
  },
  props: {
    coordinates: {
      type: Array,
      required: true
    }
  }
};
</script>
