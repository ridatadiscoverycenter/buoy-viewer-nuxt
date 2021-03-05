const colors = [
  '#5a3100',
  '#fd5925',
  '#3f6f94',
  '#daa4f9',
  '#6fcf1d',
  '#801967',
  '#f1d438',
  '#1dfee1',
  '#f35c79',
  '#faa566',
  '#456fe7',
  '#9f6c3b',
  '#87c4c1',
  '#2e0d93',
  '#972b2d',
  '#1fa562',
  '#ca50d3',
  '#1d2150',
  '#7212ff',
  '#6a7d54'
];

export const constructColorMap = (curMap, vals) => {
  const map = { ...curMap };
  const curKeys = Object.keys(curMap);
  let nextColorInd = curKeys.length;
  vals.forEach((val) => {
    if (!curKeys.includes(val)) {
      map[val] = colors[nextColorInd];
      nextColorInd++;
    }
  });
  return map;
};

export const getColorRange = (vals, colorMap) => {
  return vals.map((val) => colorMap[val]);
};
