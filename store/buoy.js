export const state = () => ({
  buoyData: [],
  coordinates: [],
  summary: [],
  variables: [],
  datasetId: 'combined_e784_bee5_492e',
  minDate: new Date(0),
  maxDate: new Date()
});

export const mutations = {
  SET_BUOY_DATA(state, payload) {
    state.buoyData = payload;
  },
  SET_BUOY_COORDINATES(state, payload) {
    state.coordinates = payload;
  },
  SET_SUMMARY_DATA(state, payload) {
    state.summary = payload;
  },
  SET_BUOY_VARIABLES(state, payload) {
    state.variables = payload;
  },
  SET_MIN_DATE(state, payload) {
    state.minDate = payload;
  },
  SET_MAX_DATE(state, payload) {
    state.maxDate = payload;
  }
};
export const actions = {
  fetchSummaryData({ commit }) {
    return this.$axios.$get('/buoy/summary').then((response) => {
      let minDate = new Date();
      let maxDate = new Date(0);
      const dateParsed = response.map((d) => {
        d.date = new Date(d.time);
        if (d.date < minDate) {
          minDate = d.date;
        }
        if (d.date > maxDate) {
          maxDate = d.date;
        }
        return d;
      });
      commit('SET_SUMMARY_DATA', dateParsed);
      commit('SET_MIN_DATE', minDate);
      commit('SET_MAX_DATE', maxDate);
    });
  },
  fetchDataGeoJson({ commit }, { ids, variable, start, end }) {
    const startDate = start || '2003-01-01T12:00:00Z';
    const endDate = end || '2012-12-31T12:00:00Z';
    return this.$axios
      .$get(
        `/buoy/query?ids=${ids}&variable=${variable}&start=${startDate}&end=${endDate}`
      )
      .then((response) => {
        const data = response.map((datum) => {
          const date = new Date(datum.time);
          datum.time = date;
          return datum;
        });
        commit('SET_BUOY_DATA', data);
      });
  },
  fetchBuoyCoordinates({ commit }) {
    return this.$axios.$get('/buoy/coordinates').then((response) => {
      commit('SET_BUOY_COORDINATES', response);
    });
  },
  fetchBuoyVariables({ commit }) {
    return this.$axios.$get('/buoy/variables').then((response) => {
      commit('SET_BUOY_VARIABLES', response);
    });
  }
};
