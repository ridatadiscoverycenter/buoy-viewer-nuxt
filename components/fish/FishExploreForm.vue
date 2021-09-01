<template>
  <BaseForm>
    <template #inputs>
      <div class="control-item">
        <label for="species-select" class="label">Select Species</label>
        <multiselect
          id="species-select"
          v-model="selectedSpecies"
          class="multiselect"
          :options="species"
        ></multiselect>
      </div>
    </template>
    <template #buttons>
      <nuxt-link
        class="button is-link"
        tag="button"
        :to="{
          name: 'datasets-fish-dashboard',
          query: {
            species: selectedSpecies,
          },
        }"
        >Explore</nuxt-link
      >
    </template>
  </BaseForm>
</template>

<script>
import { mapState } from 'vuex';
import Multiselect from 'vue-multiselect';

import BaseForm from '@/components/base/BaseForm.vue';

export default {
  components: {
    BaseForm,
    Multiselect,
  },
  data() {
    return {
      selectedSpecies: '',
    };
  },
  computed: {
    ...mapState('fish', ['species']),
  },
};
</script>
