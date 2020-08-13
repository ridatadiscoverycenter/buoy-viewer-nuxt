export const state = () => ({
  summary: [],
  loaded: null
});

export const mutations = {
  SET_SUMMARY(state, payload) {
    state.summary = payload;
  },
  LOADED(state, payload) {
    state.loaded = payload;
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
