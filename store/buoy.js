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
  fetchDataJson({ commit }, payload) {
    return Promise.all(ErddapService.getMultiBuoyJsonData(payload)).then(
      (response) => {
        const data = response.map((datum) => {
          const cols = datum.data.table.columnNames;
          const obj = {};
          cols.forEach((col, i) => {
            if (col === 'station_name') {
              obj[col] = datum.data.table.rows
                .map((row) => row[i])
                .reduce((a, b) => b);
            } else {
              obj[col] = datum.data.table.rows.map((row) => row[i]);
            }
          });
          return obj;
        });
        commit('SET_BUOY_DATA', data);
      }
    );
  },
  fetchDataGeoJson({ commit }, payload) {
    return Promise.all(ErddapService.getMultiBuoyGeoJsonData(payload)).then(
      (response) => {
        const data = response.map((datum) => {
          return datum.data.features.map((feature) => feature.properties);
        });
        commit('SET_BUOY_DATA', data);
      }
    );
  }
};
