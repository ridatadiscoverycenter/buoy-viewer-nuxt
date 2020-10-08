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
          return datum.data.features.map((feature) => {
            const date = new Date(feature.properties.time);
            feature.properties.time = date;
            return feature.properties;
          });
        });
        commit('SET_BUOY_DATA', data);
      }
    );
  },
  fetchBuoyCoordinates({ commit }, payload) {
    return Promise.all(ErddapService.getBuoysCoordinates(payload)).then(
      (response) => {
        const data = response.map((buoy) => {
          return {
            latitude: buoy.data.features[0].geometry.coordinates[1],
            longitude: buoy.data.features[0].geometry.coordinates[0],
            buoyId: buoy.data.features[0].properties.station_name
          };
        });
        commit('SET_BUOY_COORDINATES', data);
      }
    );
  }
};
