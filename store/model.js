import { summaryData, buoyData } from '@/utils/store_actions';

export const state = () => ({
  buoyData: [],
  coordinates: [],
  summary: [],
  variables: [],
  datasetId: 'model_data_77bb_15c2_6ab3',
  minDate: new Date(0),
  maxDate: new Date()
});

export const mutations = {
  mutate(state, payload) {
    state[payload.property] = payload.with;
  }
};

export const actions = {
  fetchSummaryData(context) {
    return summaryData(this.$axios, 'model')(context);
  },
  fetchDataGeoJson(context, payload) {
    return buoyData(this.$axios, 'model')(context, payload);
  },
  fetchBuoyCoordinates({ commit }) {
    return this.$axios.$get('/model/coordinates').then((response) => {
      commit('mutate', { property: 'coordinates', with: response });
    });
  },
  fetchBuoyVariables({ commit }) {
    return this.$axios.$get('/model/variables').then((response) => {
      commit('mutate', { property: 'variables', with: response });
    });
  }
};
