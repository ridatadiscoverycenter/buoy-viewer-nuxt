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
  getBuoyData({ id, variable }) {
    return erddapClient.get(
      `/combined_e784_bee5_492e.geoJson?${variable},time,latitude,longitude&station_name="${id}"`
    );
  }
};
