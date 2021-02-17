import { summaryData, buoyData } from '@/utils/store_actions';
import { constructColorMap } from '@/utils/palette';

export const state = () => ({
  buoyData: [],
  coordinates: [],
  summary: [],
  variables: [],
  datasetId: 'combined_e784_bee5_492e',
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
    return summaryData(this.$axios, 'buoy')(context);
  },
  fetchDataGeoJson(context, payload) {
    return buoyData(this.$axios, 'buoy')(context, payload);
  },
  fetchBuoyCoordinates({ commit }) {
    return this.$axios.$get('/buoy/coordinates').then((response) => {
      const coords = response.map((r) => {
        return { fullName: `${r.station_name} (${r.buoyId})`, ...r };
      });
      commit('mutate', { property: 'coordinates', with: coords });
      const colorMap = constructColorMap(response.map((v) => v.station_name));
      commit('mutate', { property: 'colorMap', with: colorMap });
    });
  },
  fetchBuoyVariables({ commit }) {
    return this.$axios.$get('/buoy/variables').then((response) => {
      commit('mutate', { property: 'variables', with: response });
    });
  }
};
