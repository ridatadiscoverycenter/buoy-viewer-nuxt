import { baseMutations } from '@/utils/store_actions';

export const state = () => ({
  weather: [],
});

export const mutations = { ...baseMutations };

export const actions = {
  fetchWeather({ commit }, { startDate, endDate }) {
    // clear the old weather data
    commit('mutate', { property: 'weather', with: [] });

    // then fetch the new
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      sid: 'PVDthr 9',
      sdate: startDate,
      edate: endDate,
      elems: [
        { name: 'maxt', interval: 'dly' },
        { name: 'mint', interval: 'dly' },
        { name: 'avgt', interval: 'dly' },
        { name: 'pcpn', interval: 'dly' },
      ],
    };
    return this.$axios
      .$post('http://data.rcc-acis.org/StnData', data, {
        headers,
      })
      .then((response) => {
        const weather = response.data.map((d) => ({
          date: new Date(d[0]),
          maxTemp: fToC(d[1]),
          minTemp: fToC(d[2]),
          avgTemp: fToC(d[3]),
          precipitation: d[4],
        }));
        commit('mutate', { property: 'weather', with: weather });
      });
  },
};

// farenheit to celsius converter
const fToC = (temp) => ((temp - 32) * 5) / 9;
