const tableau20 = [
  '#4c78a8',
  '#9ecae9',
  '#f58518',
  '#ffbf79',
  '#54a24b',
  '#88d27a',
  '#b79a20',
  '#f2cf5b',
  '#439894',
  '#83bcb6',
  '#e45756',
  '#ff9d98',
  '#79706e',
  '#bab0ac',
  '#d67195',
  '#fcbfd2',
  '#b279a2',
  '#d6a5c9',
  '#9e765f',
  '#d8b5a5'
];

export const constructColorMap = (vals) => {
  const map = {};
  for (const [i, val] of vals.entries()) {
    map[val] = tableau20[i];
  }
  return map;
};

export const getColorRange = (vals, colorMap) => {
  return vals.map((val) => colorMap[val]);
};
