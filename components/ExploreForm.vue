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
          >Select Variable</label
        >
        <multiselect
          id="variable-select-visualize"
          v-model="selectedVariable"
          class="multiselect"
          :options="variables"
        ></multiselect>
      </div>

      <div class="control-item">
        <label for="date-select" class="label">Select Date Range</label>
        <date-picker
          id="date-select"
          v-model="dateRange"
          :disabled-date="disabledDate"
          range
        ></date-picker>
      </div>
    </template>

    <template #buttons>
      <nuxt-link
        class="button is-link"
        :to="{
          name: datasetName,
          query: { buoyIds: selectedBuoysString, slug }
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

export default {
  components: {
    Multiselect,
    DatePicker,
    BaseForm
  },
  props: {
    initVariable: {
      type: String,
      required: false,
      default: ''
    },
    initBuoys: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    initDateRange: {
      type: Array,
      required: false,
      default() {
        return [];
      }
    },
    variables: {
      type: Array,
      required: true
    },
    buoys: {
      type: Array,
      required: true
    },
    minDate: {
      type: Date,
      required: false,
      default() {
        return new Date(0);
      }
    },
    maxDate: {
      type: Date,
      required: false,
      default() {
        return new Date();
      }
    },
    dataset: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedBuoys: [...this.initBuoys],
      selectedVariable: this.initVariable,
      dateRange: this.initDateRange.map((date) => {
        // show UTC date even though diplay is local
        const dateParts = date
          .split('T')[0]
          .split('-')
          .map((val) => parseInt(val));
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      })
    };
  },
  computed: {
    slug() {
      try {
        const isoDate = this.dateRange.map((date) => {
          // convert to UTC from Local
          return new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
          ).toISOString();
        });
        return [this.selectedVariable].concat(isoDate).join(',');
      } catch (e) {
        return null;
      }
    },
    selectedBuoysString() {
      return this.selectedBuoys.join(',');
    },
    datasetName() {
      return `datasets-${this.dataset}-dashboard`;
    }
  },
  methods: {
    disabledDate(date) {
      const utcDate = new Date(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      );
      return utcDate < this.minDate || utcDate > this.maxDate;
    }
  }
};
</script>
