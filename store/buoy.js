import ErddapService from '@/services/ErddapService';

export const state = () => ({
  buoyData: [],
  coordinates: []
});

export const mutations = {
  SET_BUOY_DATA(state, payload) {
    state.buoyData = payload;
  },
  SET_BUOY_COORDINATES(state, payload) {
    state.coordinates = payload;
  }
};
export const actions = {
  fetchDataGeoJson({ commit }, payload) {
    return ErddapService.getMultiBuoyGeoJsonData(payload).then((response) => {
      const data = response.data.map((datum) => {
        const date = new Date(datum.time);
        datum.time = date;
        return datum;
      });
      commit('SET_BUOY_DATA', data);
    });
  },
  fetchBuoyCoordinates({ commit }, { ids }) {
    let payload;
    if (Array.isArray(ids)) {
      payload = { ids: ids.join(',') };
    } else {
      payload = { ids };
    }
    return ErddapService.getBuoysCoordinates(payload).then((response) => {
      commit('SET_BUOY_COORDINATES', response.data);
    });
  }
};
