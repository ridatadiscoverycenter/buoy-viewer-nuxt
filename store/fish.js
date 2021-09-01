/* eslint-disable */
import { baseMutations } from '@/utils/store_actions';

const route = 'fish';

export const state = () => ({
  coordinates: [],
  samples: [],
  temps: [],
  stations: [],
  species: [],
  info: {}
});

export const mutations = { ...baseMutations };

export const actions = {
  async fetchCoordinates({ commit, dispatch }) {
    const coords = await this.$axios.$get(`/${route}/coordinates`);
    const stations = coords.map(({ station_name }) => station_name).sort();
    commit('mutate', { property: 'stations', with: stations });
    commit('mutate', { property: 'coordinates', with: coords });
    dispatch(
      'updateColorMap',
      { ids: coords.map((v) => v.station_name), unique: false },
      { root: true }
    );
  },
  async fetchSamples({ commit }) {
    const samples = await this.$axios.$get(`/${route}/species`);
    let species = samples.map(({title}) => title).sort()
    species = species.filter((v, i, a) => a.indexOf(v) === i);
    commit('mutate', { property: 'species', with: species })
    const dataParsed = samples.map(d => {
      if (d.species.includes('crab')){
        d.animal = 'crab';
      }
      else if (d.species.toLowerCase().includes('lobster')){
        d.animal = 'lobster';
      }
      else if (d.species.toLowerCase().includes('squid')){
        d.animal = 'squid';
      }
      else if (d.species.toLowerCase().includes('sea_star')){
        d.animal = 'starfish';
      }
      else {
        d.animal = 'fish';
      }
      return d;
    });
    commit('mutate', { property: 'samples', with: dataParsed });
  },
  async fetchTemps({ commit }) {
    const temps = await this.$axios.$get(`/${route}/temps`);
    commit('mutate', { property: 'temps', with: temps });
  },
  async fetchInfo({ commit }, species) {
    const info = await this.$axios.$get(`/${route}/info/${species}`);
    commit('mutate', { property: 'info', with: info });
  }
};

export const getters = {
  // left here as a starter sample, not sure if needed
  maxFish: (state) => {
    return Math.max(...state.samples.map((s) => s.fishNum));
  },
};
