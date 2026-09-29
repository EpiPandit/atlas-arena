import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Build-time aggregation of the viral hotspot points into per-country counts,
// used as the Explore map's text alternative (WCAG 1.1.1). Runs in
// getStaticProps only (Node APIs).

const DATA_DIR = ['public', 'assets', 'data'];
const OUTSIDE_COUNTRIES = 'Outside mapped countries';

const readGzJson = (filename) => {
  const filePath = path.join(process.cwd(), ...DATA_DIR, filename);
  return JSON.parse(zlib.gunzipSync(fs.readFileSync(filePath)).toString());
};

// Ray-casting point-in-ring test.
const inRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

// Polygon = [outerRing, ...holes]
const inPolygon = (x, y, polygon) =>
  inRing(x, y, polygon[0]) &&
  !polygon.slice(1).some((hole) => inRing(x, y, hole));

const buildCountries = (geojson) =>
  geojson.features.map((feature) => {
    const { type, coordinates } = feature.geometry;
    const polygons = type === 'MultiPolygon' ? coordinates : [coordinates];
    const bbox = [Infinity, Infinity, -Infinity, -Infinity];
    polygons.forEach((polygon) =>
      polygon[0].forEach(([x, y]) => {
        bbox[0] = Math.min(bbox[0], x);
        bbox[1] = Math.min(bbox[1], y);
        bbox[2] = Math.max(bbox[2], x);
        bbox[3] = Math.max(bbox[3], y);
      })
    );
    return { name: feature.properties.name, polygons, bbox };
  });

const findCountry = (x, y, countries) => {
  const match = countries.find(
    ({ bbox, polygons }) =>
      x >= bbox[0] &&
      x <= bbox[2] &&
      y >= bbox[1] &&
      y <= bbox[3] &&
      polygons.some((polygon) => inPolygon(x, y, polygon))
  );
  return match ? match.name : OUTSIDE_COUNTRIES;
};

let cache = null;

// Returns { [virus]: { [time_frame]: { total, countries: [{ name, count }] } } }
// with countries sorted by count, descending. time_frame keys match the
// hotspot data ('current', 'ssp 2', 'ssp 5').
export const getHotspotSummary = () => {
  if (cache) return cache;
  try {
    const hotspots = readGzJson('hotspots.geojson.gz');
    const countries = buildCountries(readGzJson('filter_sa.geojson.gz'));

    const counts = {};
    hotspots.features.forEach(({ geometry, properties }) => {
      const { virus, time_frame } = properties;
      const [x, y] = geometry.coordinates;
      const country = findCountry(x, y, countries);
      counts[virus] = counts[virus] || {};
      counts[virus][time_frame] = counts[virus][time_frame] || {};
      counts[virus][time_frame][country] =
        (counts[virus][time_frame][country] || 0) + 1;
    });

    cache = Object.fromEntries(
      Object.entries(counts).map(([virus, byTime]) => [
        virus,
        Object.fromEntries(
          Object.entries(byTime).map(([timeFrame, byCountry]) => {
            const list = Object.entries(byCountry)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count);
            return [
              timeFrame,
              {
                total: list.reduce((acc, i) => acc + i.count, 0),
                countries: list,
              },
            ];
          })
        ),
      ])
    );
    return cache;
  } catch (error) {
    console.error(error);
    return {};
  }
};
