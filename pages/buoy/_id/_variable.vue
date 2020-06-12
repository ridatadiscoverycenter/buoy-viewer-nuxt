<template>
  <div>
    <BarChart
      id="bar-chart"
      :dataset="counts"
      x="year"
      y="count"
      width="900"
      height="600"
    />
    <LineChart
      id="line-chart"
      :dataset="averages"
      x="year"
      y="average"
      width="900"
      height="600"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart.vue';

export default {
  components: {
    BarChart,
    LineChart
  },
  async fetch({ store, error, params }) {
    try {
      await store.dispatch('erddap/fetchData', params);
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch data at this time. Try again later.'
      });
    }
  },
  computed: {
    ...mapState('erddap', ['buoyData']),
    ...mapState('mode', ['mode']),
    grouped() {
      const data = this.buoyData;
      const grouped = _.groupBy(data, 'time');
      return grouped;
    },
    counts() {
      const variable = this.$route.params.variable;
      const result = [];
      for (const [k, v] of Object.entries(this.grouped)) {
        const filtered = v.filter((entry) => {
          return !isNaN(parseFloat(entry[variable]));
        });
        result.push({ year: k, count: filtered.length });
      }
      return result;
    },
    averages() {
      const variable = this.$route.params.variable;
      const result = [];
      for (const [k, v] of Object.entries(this.grouped)) {
        const filtered = v.filter((entry) => {
          return !isNaN(parseFloat(entry[variable]));
        });
        let variableArray;
        try {
          variableArray =
            filtered.map((obj) => obj[variable]).reduce((a, b) => a + b) /
            filtered.length;
        } catch {
          variableArray = [];
        }
        result.push({
          year: k,
          average: variableArray
        });
      }
      return result;
    }
  }
};
</script>
