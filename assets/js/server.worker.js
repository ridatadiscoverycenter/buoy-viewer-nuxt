import _ from 'lodash';
import { state } from '@/store/variables';
import ErddapService from '@/services/ErddapService';

const fetchDataGeoJson = (payload) => {
  return ErddapService.getMultiBuoyGeoJsonData(payload).then((response) => {
    const data = response.map((datum) => {
      return datum.data.features.map((feature) => {
        const date = new Date(feature.properties.time);
        feature.properties.time = date;
        return feature.properties;
      });
    });
    return data;
  });
};

self.addEventListener('message', (event) => {
  const ids = event.data.buoys;
  const variable = state().variables.join(',');
  fetchDataGeoJson({ variable, ids }).then((response) => {
    const d = response.map((data) =>
      data.map((datum) => {
        const date = new Date(datum.time);
        datum.time = `${date.getFullYear()}_${date.getMonth() + 1}`;
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
      return Object.keys(grouped[k]).map((date) => {
        const result = grouped[k][date]
          .map((obj) => {
            const newObj = {};
            state().variables.forEach((v) => {
              newObj[v] = obj[v] ? 1 : 0;
            });
            return newObj;
          })
          .reduce((a, b) => {
            const newObj = {};
            state().variables.forEach((v) => (newObj[v] = a[v] + b[v]));
            newObj.date = new Date(date.replace('_', '/') + '/01');
            newObj.station = k;
            return newObj;
          });
        return result;
      });
    });
    const final = reduced.reduce((a, b) => a.concat(b));
    self.postMessage(final);
  });
});
