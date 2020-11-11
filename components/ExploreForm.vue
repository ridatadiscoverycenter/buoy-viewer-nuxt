<template>
  <div class="eplore-form">
    <div class="explore-form-inputs">
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
        <date-picker id="date-select" v-model="dateRange" range></date-picker>
      </div>
    </div>

    <div class="explore-form-inputs">
      <nuxt-link
        class="button is-link"
        :to="{
          name: 'datasets-historical-buoy-data-dashboard',
          query: { buoyIds: selectedBuoysString, slug }
        }"
        >Visualize</nuxt-link
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';
import DatePicker from 'vue2-datepicker';

export default {
  components: {
    Multiselect,
    DatePicker
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
    ...mapState('variables', ['buoys', 'variables']),
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
  }
};
</script>

<style>
.explore-form-inputs {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.mx-datepicker-range {
  width: 100% !important;
}
</style>
