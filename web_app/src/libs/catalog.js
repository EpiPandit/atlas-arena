import catalog from '@/config/catalog.json';
import {
  ALL_VIRUS,
  DEFAULT_MODEL,
  DEFAULT_TIME,
  FALLBACK_COLOR_ORDER,
} from '@/config/constants/general';

// Flatten the catalog into the row shape the store and filters already use
// (display names for virus/species/time_frame/model, plus colours).
// FOI scales differ by ~50x between viruses, so a virus may carry its own
// `foi_range`; everything else uses the variable's range.
const layerRange = (layer) =>
  (layer.variable === 'foi' && catalog.viruses[layer.virus].foi_range) ||
  catalog.variables[layer.variable].range;

export const getCatalogRows = () => {
  const { cog_base_url, viruses, species, time_frames, models, variables } =
    catalog;

  return catalog.layers
    .filter((layer) => layer.enabled !== false)
    .map((layer) => ({
      virus: viruses[layer.virus].name,
      species: species[layer.species].name,
      time_frame: time_frames[layer.time_frame].name,
      model: models[layer.model].name,
      variable: layer.variable,
      range: layerRange(layer),
      url: `${cog_base_url}${layer.path}`,
      color: species[layer.species].color,
      color_virus: viruses[layer.virus].color,
    }));
};

// time_frames keys ('current', 'ssp2', ...) are the stable ids used in URLs;
// the rest of the app works with their display names.
export const timeFrameName = (key) => catalog.time_frames[key]?.name;
export const timeFrameKey = (name) =>
  Object.keys(catalog.time_frames).find(
    (key) => catalog.time_frames[key].name === name
  );

// A virus named in model outputs (a slug like 'junin' or 'junin_virus') as its
// catalog name and colour, falling back to a readable name and default colour.
export const findVirus = (slug) => {
  const key = [slug, `${slug}_virus`].find((k) => catalog.viruses[k]);
  if (key) return catalog.viruses[key];
  const name = slug.replace(/_/g, ' ');
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    color: 'default',
  };
};

// A species display name's catalog colour; undefined outside the catalog.
export const findSpeciesColor = (name) =>
  Object.values(catalog.species).find(
    (species) => species.name.toLowerCase() === `${name}`.toLowerCase()
  )?.color;

// One MAP_COLORS ramp per requested colour name, no two alike, for layers
// shown together. The first request for a catalog colour keeps it; repeats and
// missing ('default', null) ones get the next unused FALLBACK_COLOR_ORDER
// ramp, cycling once all are used.
export const distinctColors = (requested) => {
  const used = new Set();
  const kept = requested.map((color) => {
    if (!color || color === 'default' || used.has(color)) return null;
    used.add(color);
    return color;
  });
  return kept.map((color, i) => {
    if (color) return color;
    const next =
      FALLBACK_COLOR_ORDER.find((c) => !used.has(c)) ||
      FALLBACK_COLOR_ORDER[i % FALLBACK_COLOR_ORDER.length];
    used.add(next);
    return next;
  });
};

export const FOI_RANGE = catalog.variables.foi.range;

// The Explore tab's initial selection, from catalog.json's `defaults` block, as
// display names. Edit that block to change what loads first: `virus` null means
// all viruses; `species` are catalog keys (unknown ones are ignored, and an
// empty list selects every species).
export const getCatalogDefaults = () => {
  const defaults = catalog.defaults || {};
  const species = (defaults.species || [])
    .map((key) => catalog.species[key]?.name)
    .filter(Boolean);
  return {
    virus: catalog.viruses[defaults.virus]?.name || ALL_VIRUS,
    species: species.length ? species : null,
    // Not configurable: FormControlRadioTime always starts on DEFAULT_TIME.
    time_frame: DEFAULT_TIME,
    model: catalog.models[defaults.model]?.name || DEFAULT_MODEL,
    showSdm: defaults.show_sdm ?? true,
    showFoi: defaults.show_foi ?? true,
  };
};
