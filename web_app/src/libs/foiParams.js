import { useEffect, useState } from 'react';
import { FOI_PARAMS_URL } from '@/config/constants/general';
import { parseRows, toNumber } from '@/libs/csv';

// Force-of-infection parameters per species/virus pair, from the FOI params
// CSV on S3 (FOI_PARAMS_URL; columns Species, Virus, Prevalence, Test, K_min,
// K_max; one row per study, prevalence in percent). Fetched at runtime so it
// can be updated without a deploy. Model runs send the averaged values for the
// chosen pathogens, so the API never reads the table itself. Values the table
// has no estimate for ('NA') are entered by the user instead.

const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;

// [min, max] of the values, or null when there are none.
const extent = (values) =>
  values.length ? [Math.min(...values), Math.max(...values)] : null;

const displayName = (key) => key.charAt(0).toUpperCase() + key.slice(1);

export const speciesKey = (name) => (name || '').trim().toLowerCase();

// The CSV text as lookups for the Run Models form.
export const parseFoiParams = (text) => {
  // { [species key]: { k_min, k_max, viruses: { [virus]: [percent] } } }.
  // K is per species, so the first row stands for all of them; it and the
  // prevalence list are null/empty where the table has no estimate.
  const index = {};
  parseRows(text).forEach(({ Species, Virus, Prevalence, K_min, K_max }) => {
    const key = speciesKey(Species);
    if (!key || key === 'unknown' || !Virus) return;
    const entry = (index[key] = index[key] || {
      k_min: toNumber(K_min),
      k_max: toNumber(K_max),
      viruses: {},
    });
    const prevalences = (entry.viruses[Virus] = entry.viruses[Virus] || []);
    const prevalence = toNumber(Prevalence);
    if (prevalence != null) prevalences.push(prevalence);
  });

  const hasK = (entry) => entry.k_min != null && entry.k_max != null;
  const known = Object.values(index);

  return {
    // [{ key: 'abrothrix longipilis', name: 'Abrothrix longipilis' }], sorted.
    species: Object.keys(index)
      .sort()
      .map((key) => ({ key, name: displayName(key) })),

    virusesFor: (species) =>
      Object.keys(index[speciesKey(species)]?.viruses || {}).sort(),

    // What the user has to enter for the given viruses of a species:
    // { k: whether its K range is unknown, prevalence: [viruses without one] }.
    missingFor: (species, viruses) => {
      const entry = index[speciesKey(species)];
      if (!entry) return { k: false, prevalence: [] };
      const ours = viruses.filter((virus) => entry.viruses[virus]);
      return {
        k: ours.length > 0 && !hasK(entry),
        prevalence: ours.filter((virus) => !entry.viruses[virus].length),
      };
    },

    // The observed ranges across the table, as hints for entered values:
    // { k_min: [lo, hi], k_max: [lo, hi], prevalence: [lo, hi] (percent, of
    // the per-pair means) }; each null if the table has none.
    ranges: {
      k_min: extent(known.filter(hasK).map((entry) => entry.k_min)),
      k_max: extent(known.filter(hasK).map((entry) => entry.k_max)),
      prevalence: extent(
        known.flatMap((entry) =>
          Object.values(entry.viruses)
            .filter((prevalences) => prevalences.length)
            .map(mean)
        )
      ),
    },

    // The API's foi.pathogens for a species: mean prevalence (as a
    // proportion) and K range for each of the given viruses it has
    // parameters for. `entered` ({ k_min, k_max, prevalence: { [virus]:
    // percent } }) fills in what the table lacks (see missingFor).
    pathogens: (species, viruses, entered = {}) => {
      const entry = index[speciesKey(species)];
      if (!entry) return [];
      const [k_min, k_max] = hasK(entry)
        ? [entry.k_min, entry.k_max]
        : [entered.k_min, entered.k_max];
      return viruses
        .filter((virus) => entry.viruses[virus])
        .map((virus) => {
          const prevalences = entry.viruses[virus];
          const percent = prevalences.length
            ? mean(prevalences)
            : entered.prevalence?.[virus];
          return { virus, prevalence: percent / 100, k_min, k_max };
        });
    },

    // The species key for a presence layer name such as
    // 'abrothrix_longipilis_(waterhouse_1837)_presence', or null.
    match: (layerName) => {
      if (!layerName) return null;
      const key = speciesKey(
        String(layerName).split('_').slice(0, 2).join(' ')
      );
      return index[key] ? key : null;
    },
  };
};

// One request per page load, shared by every caller. `no-cache` revalidates
// against S3's ETag, so an updated CSV shows up on the next load (a cheap 304
// otherwise) without adding a header that would need a CORS preflight.
let pending = null;

export const loadFoiParams = () => {
  if (!pending) {
    pending = fetch(FOI_PARAMS_URL, { cache: 'no-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`FOI params: HTTP ${res.status}`);
        return res.text();
      })
      .then(parseFoiParams)
      .catch((error) => {
        pending = null; // let a later mount retry
        throw error;
      });
  }
  return pending;
};

// { foiParams, error }: foiParams is null until the CSV has loaded.
export const useFoiParams = () => {
  const [state, setState] = useState({ foiParams: null, error: null });
  useEffect(() => {
    let active = true;
    loadFoiParams().then(
      (foiParams) => active && setState({ foiParams, error: null }),
      (error) => {
        console.error(error);
        if (active) setState({ foiParams: null, error });
      }
    );
    return () => {
      active = false;
    };
  }, []);
  return state;
};
