const colors = [
  { code: '#2e0d93', assigned: false },
  { code: '#fd5925', assigned: false },
  { code: '#3f6f94', assigned: false },
  { code: '#daa4f9', assigned: false },
  { code: '#6fcf1d', assigned: false },
  { code: '#801967', assigned: false },
  { code: '#f1d438', assigned: false },
  { code: '#1dfee1', assigned: false },
  { code: '#f35c79', assigned: false },
  { code: '#faa566', assigned: false },
  { code: '#456fe7', assigned: false },
  { code: '#9f6c3b', assigned: false },
  { code: '#87c4c1', assigned: false },
  { code: '#5a3100', assigned: false },
  { code: '#972b2d', assigned: false },
  { code: '#1fa562', assigned: false },
  { code: '#ca50d3', assigned: false },
  { code: '#1d2150', assigned: false },
  { code: '#7212ff', assigned: false },
  { code: '#6a7d54', assigned: false },
];

export const constructColorMap = (curMap, vals, unique) => {
  const map = { ...curMap };
  const curKeys = Object.keys(curMap);
  let nextColorInd = unique ? colors.findIndex((c) => !c.assigned) : 0;
  vals.forEach((val) => {
    if (!curKeys.includes(val)) {
      map[val] = colors[nextColorInd].code;
      if (unique) {
        colors[nextColorInd].assigned = true;
      }
      nextColorInd++;
    }
  });
  return map;
};

export const getColorRange = (vals, colorMap) => {
  return vals.map((val) => colorMap[val]);
};
