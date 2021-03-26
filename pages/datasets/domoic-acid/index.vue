<template>
  <div>
    <ChartContainer width="full">
      <template #chart>
        <DataCard />
        <Map />
        <Slider />
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
