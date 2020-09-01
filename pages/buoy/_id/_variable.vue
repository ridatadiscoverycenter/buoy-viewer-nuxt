<template>
  <section class="container">
    <div class="dashboard content">
      <nuxt-link class="button is-grey-darker is-outlined control-item" to="/">
        <span class="icon is-small">
          <font-awesome-icon icon="angle-left" />
        </span>
        <span>Back</span></nuxt-link
      >

      <h1 class="title">
        <code>{{ this.$route.params.variable }}</code> by year
      </h1>
      <p class="subtitle">
        <font-awesome-icon class="icon" icon="map-marker-alt" />Location:
        {{ buoyName }}
      </p>
      <p class="subtitle">
        <font-awesome-icon class="icon" icon="calendar-alt" />
        Date Range:
        {{ counts[0].year }} -
        {{ counts.slice(-1)[0].year }}
      </p>
      <div v-if="hasData" class="plots">
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
      <div v-else class="no-data">
        <h1>
          There's no <code>{{ this.$route.params.variable }}</code> data for
          {{ buoyName }}
        </h1>
      </div>
    </div>
  </section>
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
    ...mapState('variables', ['buoyNames']),
    buoyName() {
      return this.buoyNames[this.$route.params.id];
    },
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
    },
    hasData() {
      return this.counts[0].count > 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'bulma';
.no-data {
  @extend .has-background-light;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20rem;
}
.container {
  margin-top: 5rem;
}
.dashboard {
  overflow-x: scroll;
}
.plots {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.title {
  margin-bottom: 4rem;
}
.icon {
  margin-right: 1rem;
  color: rgb(53, 53, 125);
}
</style>
