import ErddapService from '@/services/ErddapService';

export const state = () => ({
  buoyData: {
    bid2: {},
    bid3: {},
    bid4: {},
    bid5: {},
    bid6: {},
    bid7: {},
    bid8: {},
    bid9: {},
    bid10: {},
    bid13: {},
    bid15: {},
    bid16: {},
    bid17: {}
  }
});

export const mutations = {
  SET_BUOY_DATA(state, payload) {
    state.buoyData[payload.id] = payload;
  }
};
export const actions = {
  fetchData({ commit }, payload) {
    return ErddapService.getBuoyData(payload).then((response) => {
      const properties = response.data.features.map((feature) => {
        const date = new Date(feature.properties.time);
        const yearMonth = `${date.getFullYear()}_${date.getMonth()}`;
        const data = {
          time: yearMonth
        };
        data[payload.variable] = parseFloat(
          feature.properties[payload.variable]
        );
        return data;
      });
      commit('SET_BUOY_DATA', { ...payload, properties });
    });
  }
};
