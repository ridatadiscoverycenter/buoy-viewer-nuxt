<template>
  <div>
    {{ averages }}
    <!-- <MultiLineChart
      id="line-chart"
      :dataset="averages"
      x="year"
      y="average"
      width="900"
      height="600"
    /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
// import MultiLineChart from '@/components/charts/MultiLineChart.vue';

export default {
  watchQuery: true,
  // components: { MultiLineChart },
  async fetch({ store, error, query }) {
    try {
      const ids = query.buoyIds.split(',');
      await ids.map((id) => {
        const payload = {
          variable: query.variable,
          id,
          year: 2011
        };
        store.dispatch('erddap/fetchData', payload);
      });
    } catch (e) {
      error({
        statusCode: 503,
        message: 'Unable to fetch data at this time. Try again later.'
      });
    }
  },
  computed: {
    ...mapState('erddap', ['buoyData']),
    cleaned() {
      const obj = this.buoyData;
      Object.keys(obj).forEach(
        (key) => obj[key].properties === undefined && delete obj[key]
      );
      return Object.keys(obj).map((key) => obj[key]);
    },
    grouped() {
      return this.cleaned.map((dataset) => {
        const grouped = _.groupBy(dataset.properties, 'time');
        dataset.properties = grouped;
        return dataset;
      });
    },
    averages() {
      return this.grouped.map((dataset) => {
        const averages = this.average(dataset.properties);
        dataset.properties = averages;
        return dataset;
      });
    }
  },
  methods: {
    average(data) {
      const variable = this.$route.query.variable;
      const result = [];
      for (const [k, v] of Object.entries(data)) {
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

<style lang="scss" scoped></style>
