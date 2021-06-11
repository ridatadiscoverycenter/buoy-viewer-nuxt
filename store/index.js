import { constructColorMap } from '@/utils/palette';

export const state = () => ({
  colorMap: {},
});

export const mutations = {
  mutate(state, payload) {
    state[payload.property] = payload.with;
  },
};

export const actions = {
  updateColorMap({ state, commit }, { ids, unique }) {
    const colorMap = constructColorMap(state.colorMap, ids, unique);
    commit('mutate', { property: 'colorMap', with: colorMap });
  },
};
