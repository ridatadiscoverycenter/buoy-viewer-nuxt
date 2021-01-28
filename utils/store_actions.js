export const summaryData = (axios, route) => ({ commit }) => {
  return axios.$get(`/${route}/summary`).then((response) => {
    let minDate = new Date();
    let maxDate = new Date(0);
    const dateParsed = response.map((d) => {
      d.date = new Date(d.time);
      if (d.date < minDate) {
        minDate = d.date;
      }
      if (d.date > maxDate) {
        maxDate = d.date;
      }
      return d;
    });
    commit('mutate', { property: 'summary', with: dateParsed });
    commit('mutate', { property: 'minDate', with: minDate });
    commit('mutate', { property: 'maxDate', with: maxDate });
  });
};

export const buoyData = (axios, route) => (
  { commit, state },
  { ids, variable, start, end }
) => {
  const startDate = start || state.minDate;
  const endDate = end || state.maxDate;
  return axios
    .$get(
      `/${route}/query?ids=${ids}&variable=${variable}&start=${startDate}&end=${endDate}`
    )
    .then((response) => {
      const data = response.map((datum) => {
        const date = new Date(datum.time);
        datum.time = date;
        return datum;
      });
      commit('mutate', { property: 'buoyData', with: data });
    });
};
