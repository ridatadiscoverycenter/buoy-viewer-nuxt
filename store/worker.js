export const state = () => ({
  summary: []
});

export const mutations = {
  SET_SUMMARY(state, payload) {
    state.summary = payload;
  }
};

export const actions = {
  setSummary({ commit }, payload) {
    commit('SET_SUMMARY', payload);
  }
};
