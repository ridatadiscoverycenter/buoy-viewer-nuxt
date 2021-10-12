<template>
  <BaseForm>
    <template #inputs>
      <div class="control-item">
        <label for="buoy-select" class="label">Select Buoys</label>
        <multiselect
          id="buoy-select"
          v-model="selectedBuoys"
          class="multiselect"
          :options="buoys"
          :multiple="true"
        ></multiselect>
      </div>

      <div class="control-item">
        <label for="variable-select-visualize" class="label"
          >Select Variables (up to 4)</label
        >
        <multiselect
          id="variable-select-visualize"
          v-model="selectedVariables"
          class="multiselect"
          :options="variables"
          :custom-label="formatVariable"
          track-by="name"
          :multiple="true"
        ></multiselect>
      </div>

      <div class="control-item">
        <label for="date-select" class="label">Select Date Range</label>
        <date-picker
          id="date-select"
          v-model="dateRange"
          :disabled-date="disabledDate"
          :default-value="[minDate, maxDate]"
          range
        ></date-picker>
      </div>
    </template>

    <template #buttons>
      <nuxt-link
        class="button is-link"
        tag="button"
        :disabled="disable"
        :to="{
          name: datasetName,
          query: {
            buoyIds: selectedBuoysString,
            variables: selectedVariablesString,
            ...selectedDates,
          },
        }"
        >Visualize</nuxt-link
      >
    </template>
  </BaseForm>
</template>

<script>
import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';

import BaseForm from '@/components/base/BaseForm.vue';

import { formatVariable } from '@/utils/utils.js';

export default {
  components: {
    Multiselect,
    DatePicker,
    BaseForm,
  },
  props: {
    initVariables: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    initBuoys: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    initDateRange: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    variables: {
      type: Array,
      required: true,
    },
    buoys: {
      type: Array,
      required: true,
    },
    minDate: {
      type: Date,
      required: false,
      default() {
        return new Date(0);
      },
    },
    maxDate: {
      type: Date,
      required: false,
      default() {
        return new Date();
      },
    },
    dataset: {
      type: String,
      required: true,
    },
    coordinates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedBuoys: [...this.initBuoys],
      selectedVariables: [...this.initVariables],
      dateRange: this.initDateRange.map((date) => {
        // show UTC date even though diplay is local
        const dateParts = date
          .split('T')[0]
          .split('-')
          .map((val) => parseInt(val));
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      }),
    };
  },
  computed: {
    disable() {
      return (
        this.selectedVariables.length > 4 ||
        this.selectedVariables.length === 0 ||
        this.dateRange.length !== 2 ||
        this.selectedBuoys.length === 0
      );
    },
    selectedDates() {
      try {
        const isoDate = this.dateRange.map((date) => {
          // convert to UTC from Local
          return new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
          ).toISOString();
        });
        return { start: isoDate[0], end: isoDate[1] };
      } catch (e) {
        return null;
      }
    },
    selectedVariablesString() {
      return this.selectedVariables.map((v) => v.name).join(',');
    },
    selectedBuoysString() {
      const bids = this.coordinates
        .filter((r) => this.selectedBuoys.includes(r.fullName))
        .map((r) => r.buoyId);
      return bids.join(',');
    },
    datasetName() {
      return `datasets-${this.dataset}-dashboard`;
    },
  },
  watch: {
    initBuoys(cur, old) {
      // for some reason (probably to do with computation graphs) initBuoys isn't always set
      // on initial render, so we need to watch it and set if it comes in a little later
      this.selectedBuoys = [...cur];
    },
    initVariables(cur, old) {
      // for some reason (probably to do with computation graphs) initBuoys isn't always set
      // on initial render, so we need to watch it and set if it comes in a little later
      this.selectedVariables = [...cur];
    },
  },
  methods: {
    disabledDate(date) {
      const utcDate = new Date(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      );
      return utcDate < this.minDate || utcDate > this.maxDate;
    },
    formatVariable,
  },
};
</script>
