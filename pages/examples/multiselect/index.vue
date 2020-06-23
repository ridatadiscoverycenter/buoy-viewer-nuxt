<template>
  <div>
    <main class="container">
      <form id="buoy-select-form">
        <label for="buoy-select" class="label">Select Buoys</label>
        <multiselect
          id="buoy-select"
          v-model="selectedBuoys"
          class="multiselect"
          :options="buoys"
          :multiple="true"
        ></multiselect>

        <label for="variable-select" class="label">Select Variable</label>
        <multiselect
          id="variable-select"
          v-model="selectedVariable"
          class="multiselect"
          :options="variables"
        ></multiselect>

        <nuxt-link
          class="button is-link"
          :to="{
            name: 'examples-multiselect-plot',
            query: { buoyIds: selectedBuoysString, variable: selectedVariable }
          }"
          >Submit</nuxt-link
        >
      </form>
    </main>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { mapState } from 'vuex';

export default {
  components: { Multiselect },
  data() {
    return {
      selectedBuoys: [],
      selectedVariable: ''
    };
  },
  computed: {
    ...mapState('variables', ['buoys', 'variables']),
    selectedBuoysString() {
      return this.selectedBuoys.join(',');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'bulma';
.container {
  margin-top: 5rem;
}
.multiselect {
  width: 15rem;
  li {
    margin-left: 0;
    padding-left: 0;
  }
}
.button {
  margin-top: 1rem;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
