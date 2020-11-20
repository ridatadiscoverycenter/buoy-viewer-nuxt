import axios from 'axios';

const erddapClient = axios.create({
  baseURL: 'http://localhost:3004/erddap',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getMultiBuoyGeoJsonData({ ids, variable, start, end }) {
    const startDate = start ?? '2003-01-01T12:00:00Z';
    const endDate = end ?? '2012-12-31T12:00:00Z';
    return erddapClient.get(
      `/buoy/query?datasetId=combined_e784_bee5_492e&ids=${ids}&variable=${variable}&start=${startDate}&end=${endDate}`
    );
  },
  getBuoysCoordinates({ ids }) {
    return erddapClient.get(`/buoy/coordinates?ids=${ids}`);
  }
};
