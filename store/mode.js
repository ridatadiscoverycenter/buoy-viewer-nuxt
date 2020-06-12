export const state = () => ({
  mode: ''
});

export const mutations = {
  SET_MODE(state, payload) {
    state.mode = payload;
  }
};

export const actions = {
  setMode({ commit }, payload) {
    commit('SET_MODE', payload);
  }
};
