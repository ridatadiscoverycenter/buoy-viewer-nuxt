import _ from 'lodash';
import { state } from '@/store/variables';
import ErddapService from '@/services/ErddapService';

const fetchDataGeoJson = (payload) => {
  return Promise.all(ErddapService.getMultiBuoyGeoJsonData(payload)).then(
    (response) => {
      const data = response.map((datum) => {
        return datum.data.features.map((feature) => {
          const date = new Date(feature.properties.time);
          feature.properties.time = date;
          return feature.properties;
        });
      });
      return data;
    }
  );
};

const variables = [
  'ChlorophyllSurface',
  'DepthBottom',
  'FSpercentSurface',
  'O2PercentSurface',
  'O2Surface',
  'SalinityBottom',
  'SalinitySurface',
  'SpCondBottom',
  'SpCondSurface',
  'TurbidityBottom',
  'WaterTempBottom',
  'WaterTempSurface',
  'depth',
  'pHBottom',
  'pHSurface',
  'depth'
];

self.addEventListener('message', (event) => {
  const ids = state().buoys.slice(1, 3);
  const variable = state().variables.join(',');
  fetchDataGeoJson({ variable, ids, year: 2012 }).then((response) => {
    const d = response.map((data) =>
      data.map((datum) => {
        const date = new Date(datum.time);
        datum.time = `${date.getFullYear()}_${date.getMonth()}`;
        return datum;
      })
    );
    const grouped = d
      .map((buoyData) => {
        const result = {
          [buoyData[0].station_name]: _.groupBy(buoyData, 'time')
        };
        return result;
      })
      .reduce((a, b) => Object.assign(a, b));
    const reduced = Object.keys(grouped).map((k) => {
      return {
        [k]: Object.keys(grouped[k]).map((date) => {
          return {
            [date]: grouped[k][date]
              .map((obj) => {
                const newObj = {};
                variables.forEach((v) => {
                  newObj[v] = obj[v] ? 1 : 0;
                });
                return newObj;
              })
              .reduce((a, b) => {
                const newObj = {};
                variables.forEach((v) => (newObj[v] = a[v] + b[v]));
                return newObj;
              })
          };
        })
      };
    });
    self.postMessage(reduced);
  });
});
