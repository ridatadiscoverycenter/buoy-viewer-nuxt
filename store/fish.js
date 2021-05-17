import { baseMutations } from '@/utils/store_actions';

const route = 'fish';

export const state = () => ({
  coordinates: [],
  samples: [],
  temps: [],
  metrics: [],
});

export const mutations = { ...baseMutations };

export const actions = {
  async fetchCoordinates({ commit, dispatch }) {
    const coords = await this.$axios.$get(`/${route}/coordinates`);
    console.log(coords);
    commit('mutate', { property: 'coordinates', with: coords });
    dispatch(
      'updateColorMap',
      coords.map((v) => v.station_name),
      { root: true }
    );
  },
  async fetchSamples({ commit }) {
    const samples = await this.$axios.$get(`/${route}/samples`);
    console.log(samples);
    console.log(samples['Fox Island']);
    commit('mutate', { property: 'samples', with: samples });
  },
  async fetchTemps({ commit, dispatch }) {
    const temps = await this.$axios.$get(`/${route}/temps`);
    commit('mutate', { property: 'temps', with: temps });
  },
  async fetchMetrics({ commit, dispatch }) {
    const metrics = await this.$axios.$get(`/${route}/metrics`);
    commit('mutate', { property: 'metrics', with: metrics });
  },
};

export const getters = {
  // left here as a starter sample, not sure if needed
  maxFish: (state) => {
    return Math.max(...state.samples.map((s) => s.fishNum));
  },
};
