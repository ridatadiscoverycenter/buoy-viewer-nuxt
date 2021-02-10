<template>
  <ChartContainer width="two-thirds" :height="3">
    <template #title>{{ variable }}</template>
    <template #subtitle
      >This plot shows {{ variable }} over the period between
      {{ startDtStr }} and {{ endDtStr }}. You can hover over the lines to see
      more specific data.</template
    >
    <template #chart>
      <div
        v-if="compareDataset.length > 0"
        class="notification is-info is-light mx-4 px-4 py-2"
      >
        <fa :icon="['fas', 'info-circle']" class="mr-1" />
        <span class="is-size-6 mr-4">
          {{ compareName }} data is available which matches your query
        </span>
        <button class="button is-info is-small" @click="toggleCompare">
          {{ compareText }}
        </button>
      </div>

      <div
        v-if="dataset.length === 0"
        class="notification is-danger is-light mx-4 px-4 py-2 has-text-centered"
      >
        <p><strong>No Data Matches the Query</strong></p>
      </div>

      <LineChart
        v-else
        id="line-chart"
        :dataset="dataset"
        :dataset-name="datasetName"
        :dataset-line-width="datasetLineWidth"
        :compare-dataset="compare ? compareDataset : []"
        :compare-name="compareName"
        :compare-line-width="compareLineWidth"
        :variable="variable"
        :color-domain="colorDomain"
        :color-range="colorRange"
        x="time"
        y="station_name"
        :enable-darkmode="false"
      />
    </template>
  </ChartContainer>
</template>

<script>
import * as aq from 'arquero';

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
    colorMap: {
      type: Object,
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
    datasetName: {
      type: String,
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
    },
    compareLineWidth: {
      type: Number,
      required: false,
      default: 0.8
    },
    datasetLineWidth: {
      type: Number,
      required: false,
      default: 2.2
    }
  },
  data() {
    return {
      compare: false,
      compareText: 'Add To Plot'
    };
  },
  computed: {
    colorDomain() {
      const stations = aq
        .from(this.dataset)
        .groupby('station_name')
        .count()
        .objects();
      return stations.map((v) => v.station_name);
    },
    colorRange() {
      return this.colorDomain.map((v) => this.colorMap[v]);
    }
  },
  methods: {
    toggleCompare() {
      this.compare = !this.compare;
      if (this.compare) {
        this.compareText = 'Remove From Plot';
      } else {
        this.compareText = 'Add To Plot';
      }
    }
  }
};
</script>
