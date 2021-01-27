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
          name: 'datasets-historical-buoy-data-dashboard',
          query: { buoyIds: selectedBuoysString, slug }
        }"
        >Visualize</nuxt-link
      >
    </template>
  </BaseForm>
</template>

<script>
import { mapGetters } from 'vuex';
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
    }
  },
  data() {
    return {
      selectedBuoys: [...this.initBuoys],
      selectedVariable: this.initVariable,
      dateRange: this.initDateRange.map((date) => new Date(date.split('T')[0]))
    };
  },
  computed: {
    ...mapGetters('worker', ['getMinDate', 'getMaxDate']),
    slug() {
      try {
        const isoDate = this.dateRange.map((date) => date.toISOString());
        return [this.selectedVariable].concat(isoDate).join(',');
      } catch {
        return null;
      }
    },
    selectedBuoysString() {
      return this.selectedBuoys.join(',');
    }
  },
  methods: {
    disabledDate(date) {
      return date < this.getMinDate || date > this.getMaxDate;
    }
  }
};
</script>
