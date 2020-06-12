<template>
  <div>
    <BarChart id="bar-chart" :dataset="dataset" width="900" height="600" />
    <select v-model="dataset">
      <option v-for="obj in options" :key="obj.name" :value="obj.data">{{
        obj.name
      }}</option>
    </select>
  </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart.vue';
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
      ],
      options: [
        {
          name: 'd1',
          data: [
            { x: 0, y: 5.5 },
            { x: 1, y: 2.1 },
            { x: 2, y: 1.7 },
            { x: 3, y: 1.3 },
            { x: 4, y: 0.9 }
          ]
        },
        {
          name: 'd2',
          data: [
            { x: 0, y: 7.5 },
            { x: 1, y: 1.1 },
            { x: 2, y: 9.7 },
            { x: 3, y: 7.3 },
            { x: 4, y: 6.9 },
            { x: 5, y: 1.9 }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
