import { scaleSqrt, scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import { baseMutations } from '@/utils/store_actions';

const route = 'da';

export const state = () => ({
  coordinates: [],
  samples: [],
  dates: [],
  selectedDate: new Date()
});

export const mutations = { ...baseMutations };

export const actions = {
  async fetchCoordinates({ commit, dispatch }) {
    const coords = await this.$axios.$get(`/${route}/coordinates`);
    commit('mutate', { property: 'coordinates', with: coords });
    // dispatch('updateColorMap', coords.map((v) => v.station_name), { root: true })
  },
  async fetchSamples({ commit }) {
    const samples = await this.$axios.$get(`/${route}/samples`);
    samples.forEach((s) => {
      s.date = new Date(s.date);
    });
    commit('mutate', { property: 'samples', with: samples });
    const dates = [...new Set(samples.map((s) => s.date))];
    dates.sort((f, s) => f - s);
    commit('mutate', { property: 'dates', with: dates });
    commit('mutate', { property: 'selectedDate', with: dates[0] });
  },
  setSelectedDate({ commit }, payload) {
    commit('mutate', {
      property: 'selectedDate',
      with: payload
    });
  }
};

export const getters = {
  maxDA: (state) => {
    return Math.max(...state.samples.map((s) => s.pDA));
  },
  siteCoordinates: (state) => (site) => {
    const match = state.coordinates.find((c) => c.station_name === site);
    return [match.longitude, match.latitude];
  },
  selectedSamples: (state, getters) => {
    const daySamples = state.samples.filter(
      (sample) => sample.date - state.selectedDate === 0
    );
    const domain = [0, getters.maxDA];
    const range = [10, 50];
    const sqrtScale = scaleSqrt()
      .domain(domain)
      .range(range);

    const colorScale = scaleSequential()
      .domain(domain)
      .interpolator(interpolateYlOrRd)
      .clamp(true);

    const rows = daySamples.map((row) => {
      return {
        type: 'Feature',
        properties: {
          date: row.date,
          site: row.station_name,
          da: row.pDA,
          norm_da: row.normDA,
          color: colorScale(row.pDA),
          size: sqrtScale(row.pDA)
        },
        geometry: {
          type: 'Point',
          coordinates: getters.siteCoordinates(row.station_name)
        }
      };
    });
    return {
      type: 'geojson',
      data: {
        id: 'buoy',
        type: 'FeatureCollection',
        features: rows
      }
    };
  },
  dateLength: (state) => {
    return state.dates.length;
  }
};
