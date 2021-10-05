export const baseMutations = {
  mutate(state, payload) {
    state[payload.property] = payload.with;
  },
};

export const initState = (route, datasetId) => {
  const baseState = {
    coordinates: [],
    summary: [],
    variables: [],
    datasetId,
    minDate: new Date(0),
    maxDate: new Date(),
  };
  baseState[`${route}Data`] = [];
  return baseState;
};

// not a fat arrow function so the `this` will refer to the vue instance
export function baseActions(route) {
  return {
    fetchSummaryData(context) {
      return summaryData(this.$axios, route)(context);
    },
    fetchDataGeoJson(context, payload) {
      return buoyData(this.$axios, route)(context, payload);
    },
    fetchBuoyCoordinates({ commit, dispatch }) {
      return this.$axios.$get(`/${route}/coordinates`).then((response) => {
        const coords = response.map((r) => {
          return { fullName: `${r.station_name} (${r.buoyId})`, ...r };
        });
        commit('mutate', { property: 'coordinates', with: coords });
        dispatch(
          'updateColorMap',
          { ids: response.map((v) => v.station_name), unique: true },
          { root: true }
        );
      });
    },
    fetchBuoyVariables({ commit }) {
      return this.$axios
        .$get(`/${route}/variables?units=true`)
        .then((response) => {
          commit('mutate', { property: 'variables', with: response });
        });
    },
  };
}

// =========== UTILITIES ============

export const summaryData =
  (axios, route) =>
  ({ commit }) => {
    return axios.$get(`/${route}/summary`).then((response) => {
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
      commit('mutate', { property: 'summary', with: dateParsed });
      commit('mutate', { property: 'minDate', with: minDate });
      commit('mutate', { property: 'maxDate', with: maxDate });
    });
  };

export const buoyData =
  (axios, route) =>
  ({ commit, state }, { ids, variables, start, end }) => {
    const startDate = start || state.minDate;
    const endDate = end || state.maxDate;
    return axios
      .$get(
        `/${route}/query?ids=${ids}&variables=${variables}&start=${startDate}&end=${endDate}&units=true`
      )
      .then((data) => {
        commit('mutate', { property: `${route}Data`, with: data });
      });
  };
