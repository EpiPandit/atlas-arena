import featureConfig from '@/config/features.json';

const { groups, features } = featureConfig;

const FALLBACK_COLOR = 'gray.400';

// A model feature code from the job outputs (e.g. 'bio_12', 'lu_past') as
// { label, name, units, source, group, groupLabel, color }. A code missing from
// features.json falls back to itself, so a new feature still shows.
export const findFeature = (code) => {
  const feature = features[code];
  if (!feature) {
    return { label: code, name: code, group: null, color: FALLBACK_COLOR };
  }
  const group = groups[feature.group];
  return {
    ...feature,
    groupLabel: group?.label,
    color: group?.color || FALLBACK_COLOR,
  };
};

// The feature groups (in features.json order) used by any of the codes, as
// [{ key, label, color }], for a legend.
export const featureGroups = (codes) => {
  const used = new Set(codes.map((code) => features[code]?.group));
  return Object.entries(groups)
    .filter(([key]) => used.has(key))
    .map(([key, { label, color }]) => ({ key, label, color }));
};
