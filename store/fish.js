import { baseMutations } from '@/utils/store_actions';

const route = 'fish';

export const state = () => ({
  coordinates: [],
  samples: []
});

export const mutations = { ...baseMutations };

export const actions = {
  async fetchCoordinates({ commit, dispatch }) {
    const coords = await this.$axios.$get(`/${route}/coordinates`);
    commit('mutate', { property: 'coordinates', with: coords });
  },
  async fetchSamples({ commit }) {
    const samples = await this.$axios.$get(`/${route}/samples`);
    samples.forEach((s) => {
      s.date = new Date(s.date);
    });
    commit('mutate', { property: 'samples', with: samples });
  }
};

export const getters = {
  // left here as a starter sample, not sure if needed
  maxFish: (state) => {
    return Math.max(...state.samples.map((s) => s.fishNum));
  }
};
