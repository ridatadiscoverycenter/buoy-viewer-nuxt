export const state = () => ({
  buoyData: [],
  coordinates: [],
  summary: []
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
  }
};
export const actions = {
  fetchSummaryData({ commit }) {
    return this.$axios.$get('/buoy/summary').then((response) => {
      const dateParsed = response.map((d) => {
        d.date = new Date(d.dt_ym);
        return d;
      });
      commit('SET_SUMMARY_DATA', dateParsed);
    });
  },
  fetchDataGeoJson({ commit }, { ids, variable, start, end }) {
    const startDate = start !== undefined ? start : '2003-01-01T12:00:00Z';
    const endDate = end !== undefined ? end : '2012-12-31T12:00:00Z';
    return this.$axios
      .$get(
        `/buoy/query?datasetId=combined_e784_bee5_492e&ids=${ids}&variable=${variable}&start=${startDate}&end=${endDate}`
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
  fetchBuoyCoordinates({ commit }, { ids }) {
    let payload;
    if (Array.isArray(ids)) {
      payload = { ids: ids.join(',') };
    } else {
      payload = { ids };
    }
    return this.$axios
      .$get(`/buoy/coordinates?ids=${payload.ids}`)
      .then((response) => {
        commit('SET_BUOY_COORDINATES', response);
      });
  }
};
