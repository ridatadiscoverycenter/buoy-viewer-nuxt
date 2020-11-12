export const state = () => ({
  summary: [],
  loaded: null
});

export const mutations = {
  SET_SUMMARY(state, payload) {
    state.summary.push(payload);
  },
  LOADED(state, payload) {
    state.loaded = payload;
  },
  SET_MIN_DATE(state, payload) {
    state.minDate = payload;
  },
  SET_MAX_DATE(state, payload) {
    state.maxDate = payload;
  }
};

export const actions = {
  setSummary({ commit }, payload) {
    commit('SET_SUMMARY', payload);
  },
  loaded({ commit }, payload) {
    commit('LOADED', payload);
  }
};

export const getters = {
  getMinDate(state) {
    return Math.min(...state.summary.map((val) => val.date));
  },
  getMaxDate(state) {
    return Math.max(...state.summary.map((val) => val.date));
  }
};
