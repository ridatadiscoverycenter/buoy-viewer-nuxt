<template>
  <div><BarChart :dataset="dataset" /></div>
</template>

<script>
import BarChart from '@/components/charts/BarChart';
export default {
  components: {
    BarChart
  },
  data() {
    return {
      dataset: [
        { x: 0, y: 5.5 },
        { x: 1, y: 2.1 },
        { x: 2, y: 1.7 },
        { x: 3, y: 1.3 },
        { x: 4, y: 0.9 }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
