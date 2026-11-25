import { ALL_VIRUS } from '@/config/constants/general';

export const actionTypes = {
  SET_RAW_DATA: 'SET_RAW_DATA',
  CLEAN_RAW_DATA: 'CLEAN_RAW_DATA',
};

// payload: the flat layer rows from getCatalogRows() in libs/catalog.js.
export const setRawData = (payload = []) => {
  return { type: actionTypes.SET_RAW_DATA, payload: payload };
};

// One option per distinct value of `field`, sorted by key. Each option lists
// the values of the `related` fields that occur alongside it, which the
// sidebar uses to narrow the other dropdowns.
const buildOptions = (rows, field, related = []) => {
  const byKey = new Map();
  rows.forEach((row) => {
    const key = `${row[field]}`;
    if (!byKey.has(key)) {
      byKey.set(key, { key, name: row[field] });
    }
  });

  return [...byKey.values()]
    .map((option) => {
      const matching = rows.filter((row) => row[field] == option.name);
      related.forEach((rel) => {
        option[rel] = [...new Set(matching.map((row) => row[rel]))];
      });
      return option;
    })
    .sort((a, b) => a.key.localeCompare(b.key));
};

export const processRawData = (raw_data) => {
  const allVirus = [
    { key: ALL_VIRUS, name: ALL_VIRUS },
    ...buildOptions(raw_data, 'virus'),
  ].sort((a, b) => a.key.localeCompare(b.key));

  return {
    allVirus,
    allSpecies: buildOptions(raw_data, 'species', ['virus']),
    allTimeFrame: buildOptions(raw_data, 'time_frame', ['virus', 'species']),
    allModels: buildOptions(raw_data, 'model', [
      'virus',
      'species',
      'time_frame',
    ]),
  };
};
