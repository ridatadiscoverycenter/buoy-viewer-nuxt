<template>
  <ChartContainer width="two-thirds">
    <template #title>{{ variable }}</template>
    <template #subtitle
      >This plot shows {{ variable }} over the period between
      {{ startDtStr }} and {{ endDtStr }}. You can hover over the lines to see
      more specific data.</template
    >
    <template #chart>
      <div v-if="compareDataset.length > 0">
        <input id="compare-checkbox" v-model="compare" type="checkbox" />
        <label for="compare-checkbox"
          >{{ compareName }} data availble - compare?</label
        >
      </div>

      <p v-if="dataset.length === 0">No Data Matches the Query</p>

      <LineChart
        v-else
        id="line-chart"
        :dataset="dataset"
        :compare-dataset="compare ? compareDataset : []"
        :variable="variable"
        x="time"
        y="station_name"
        :enable-darkmode="false"
      />
    </template>
  </ChartContainer>
</template>

<script>
import LineChart from '@/components/charts/LineChart.vue';
import ChartContainer from '@/components/base/ChartContainer.vue';

export default {
  components: {
    LineChart,
    ChartContainer
  },
  props: {
    variable: {
      type: String,
      required: true
    },
    startDtStr: {
      type: String,
      required: true
    },
    endDtStr: {
      type: String,
      required: true
    },
    dataset: {
      type: Array,
      required: true
    },
    compareDataset: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    compareName: {
      type: String,
      required: false,
      default: 'Other'
    }
  },
  data() {
    return {
      compare: false
    };
  }
};
</script>
