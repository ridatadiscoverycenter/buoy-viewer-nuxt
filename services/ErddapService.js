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
  getBuoyData({ id, variable, year }) {
    const yearStart = year ? year.toString() : '2003';
    const yearEnd = year ? year.toString() : '2012';
    return erddapClient.get(
      `/combined_e784_bee5_492e.geoJson?${variable},time,latitude,longitude&station_name="${id}"&time>=${yearStart}-01-01T12:00:00Z&time<=${yearEnd}-12-31T12:00:00Z`
    );
  }
};
