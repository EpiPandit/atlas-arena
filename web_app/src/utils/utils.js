import { ALL_VIRUS, MAP_COLORS } from '@/config/constants/general';
export const dynamicFilter = (dataList, filterObj) => {
  if (!filterObj || Object.keys(filterObj).length === 0) return [];

  return dataList.filter((item) => {
    try {
      if (!filterObj.virus) {
        return false;
      }
      if (filterObj.virus !== ALL_VIRUS && item.virus !== filterObj.virus) {
        return false;
      }
      if (!filterObj.species && !Array.isArray(filterObj.species)) {
        return false;
      }
      if (!filterObj.species.includes(item.species)) {
        return false;
      }

      // time
      if (filterObj.time_frame && Array.isArray(filterObj.time_frame)) {
        if (
          filterObj.time_frame.length &&
          !filterObj.time_frame.includes(item.time_frame)
        ) {
          return false;
        }
      }

      // model
      if (filterObj.model && item.model !== filterObj.model) {
        return false;
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  });
};

export const getUniqueCombinations = (data, key1, key2) => {
  const seen = new Set();
  return data.filter((item) => {
    const combo = `${item[key1]}-${item[key2]}`;
    if (seen.has(combo)) {
      return false;
    } else {
      seen.add(combo);
      return true;
    }
  });
};

export const sortList = (data, field = 'title') => {
  if (!data || !data.length) return [];

  data.sort((a, b) => a[field].localeCompare(b[field]));
  return data;
};
export const buildColorLayer = (color) => {
  let colors = MAP_COLORS[color];
  if (!color) {
    colors = [...MAP_COLORS.default];
  }
  return [
    'interpolate',
    ['linear'],
    ['raster-value'],
    0,
    colors[0],
    0.25,
    colors[1],
    0.5,
    colors[2],
    0.75,
    colors[3],
    1,
    colors[4],
  ];
};
