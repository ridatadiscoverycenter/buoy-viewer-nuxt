import axios from 'axios';

const erddapClient = axios.create({
  baseURL: 'https://pricaimcit.services.brown.edu/erddap/tabledap',
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
    const promisseArray = ids.map((id) => {
      return erddapClient.get(
        `/combined_e784_bee5_492e.geoJson?${variable},time,latitude,longitude,station_name&station_name="${id}"&time>=${startDate}&time<=${endDate}`
      );
    });
    return promisseArray;
  },
  getBuoysCoordinates({ ids }) {
    const date = '2012-05-30T04:00:00.000Z';
    const altDate4 = '2009-03-30T04:00:00.000Z';
    const altDate16 = '2005-04-30T04:00:00.000Z';

    const promisseArray = ids.map((id) => {
      let obj;
      switch (id) {
        case 'bid4':
          obj = erddapClient.get(
            `/combined_e784_bee5_492e.geoJson?latitude,longitude,station_name&station_name="${id}"&time>=${altDate4}&time<=${altDate4}`
          );
          break;
        case 'bid16':
          obj = erddapClient.get(
            `/combined_e784_bee5_492e.geoJson?latitude,longitude,station_name&station_name="${id}"&time>=${altDate16}&time<=${altDate16}`
          );
          break;
        default:
          obj = erddapClient.get(
            `/combined_e784_bee5_492e.geoJson?latitude,longitude,station_name&station_name="${id}"&time>=${date}&time<=${date}`
          );
      }
      return obj;
    });
    return promisseArray;
  }
};
