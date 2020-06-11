import ErddapService from '@/services/ErddapService';

export const state = () => ({
  buoyData: []
});

export const mutations = {
  SET_BUOY_DATA(state, payload) {
    state.buoyData = payload;
  }
};

export const actions = {
  fetchData({ commit }, payload) {
    return ErddapService.getBuoyData(payload).then((response) => {
      const properties = response.data.features.map((feature) => {
        const date = new Date(feature.properties.time);
        const yearMonth = `${date.getFullYear()}`;
        const data = {
          time: yearMonth
        };
        data[payload.variable] = parseFloat(
          feature.properties[payload.variable]
        );

        return data;
      });
      commit('SET_BUOY_DATA', properties);
    });
  }
};
