import { summaryData, buoyData } from '@/utils/store_actions';
import { constructColorMap } from '@/utils/palette';

export const state = () => ({
  modelData: [],
  coordinates: [],
  summary: [],
  variables: [],
  datasetId: 'model_data_77bb_15c2_6ab3',
  minDate: new Date(0),
  maxDate: new Date(),
  colorMap: {}
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
      const colorMap = constructColorMap(response.map((v) => v.station_name));
      commit('mutate', { property: 'colorMap', with: colorMap });
    });
  },
  fetchBuoyVariables({ commit }) {
    return this.$axios.$get('/model/variables').then((response) => {
      commit('mutate', { property: 'variables', with: response });
    });
  }
};
