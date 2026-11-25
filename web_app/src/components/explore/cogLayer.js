import { COGLayer } from '@developmentseed/deck.gl-geotiff';
import {
  Colormap,
  CreateTexture,
  LinearRescale,
  createColormapTexture,
} from '@developmentseed/deck.gl-raster/gpu-modules';
import { epsgResolver, parseWkt } from '@developmentseed/proj';
import { MAP_COLORS } from '@/config/constants/general';
import wgs84 from '@/config/epsg-4326.json';

// Rasters sit under the basemap's boundaries and labels.
export const RASTER_BEFORE_ID = 'boundary_3';

// All our COGs are EPSG:4326; resolve it locally instead of asking epsg.io.
const WGS84 = parseWkt(wgs84);
const resolveEpsg = (epsg) =>
  epsg === 4326 ? Promise.resolve(WGS84) : epsgResolver(epsg);

// One colormap row per MAP_COLORS entry, linearly interpolated across its
// five stops, so a layer picks its ramp by row index.
const COLORMAP_NAMES = Object.keys(MAP_COLORS);

const hexToRgb = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const buildColormapImage = () => {
  const pixels = new Uint8ClampedArray(256 * COLORMAP_NAMES.length * 4);
  COLORMAP_NAMES.forEach((name, row) => {
    const stops = MAP_COLORS[name].map(hexToRgb);
    for (let x = 0; x < 256; x++) {
      const t = (x / 255) * (stops.length - 1);
      const i = Math.min(Math.floor(t), stops.length - 2);
      const f = t - i;
      const offset = (row * 256 + x) * 4;
      for (let c = 0; c < 3; c++) {
        pixels[offset + c] = stops[i][c] + (stops[i + 1][c] - stops[i][c]) * f;
      }
      pixels[offset + 3] = 255;
    }
  });
  return new ImageData(pixels, 256, COLORMAP_NAMES.length);
};

const colormapTextures = new WeakMap();
const getColormapTexture = (device) => {
  if (!colormapTextures.has(device)) {
    colormapTextures.set(
      device,
      createColormapTexture(device, buildColormapImage())
    );
  }
  return colormapTextures.get(device);
};

// Keeps only values in (minValue, maxValue], discarding nodata (NaN) and
// everything else. NaN fails every comparison, so it is always discarded.
const FilterRange = {
  name: 'filterRange',
  fs: `\
uniform filterRangeUniforms {
  float minValue;
  float maxValue;
} filterRange;
`,
  inject: {
    'fs:DECKGL_FILTER_COLOR': /* glsl */ `
    if (!(color.r > filterRange.minValue && color.r <= filterRange.maxValue)) {
      discard;
    }
    `,
  },
  uniformTypes: { minValue: 'f32', maxValue: 'f32' },
  getUniforms: (props) => ({
    minValue: props.minValue,
    maxValue: props.maxValue,
  }),
};

const getTileData = async (image, { device, x, y, signal, pool }) => {
  const { array } = await image.fetchTile(x, y, {
    boundless: false,
    pool,
    signal,
  });
  const band = array.layout === 'band-separate' ? array.bands[0] : array.data;
  // Integer rasters go through the same float path.
  const data = band instanceof Float32Array ? band : Float32Array.from(band);
  const texture = device.createTexture({
    data,
    format: 'r32float',
    width: array.width,
    height: array.height,
    // Float textures aren't filterable in WebGL2; this also keeps cell edges crisp.
    sampler: { magFilter: 'nearest', minFilter: 'nearest' },
  });
  return {
    texture,
    colormapTexture: getColormapTexture(device),
    byteLength: data.byteLength,
    width: array.width,
    height: array.height,
  };
};

const onTileUnload = (tile) => tile.content?.texture?.destroy();

/**
 * A COG layer for one catalog row, coloured with the species' MAP_COLORS ramp
 * across the variable's value range. `onGeoTIFFLoad` gets the raster's
 * `geographicBounds` once its header is parsed.
 */
export const buildCogLayer = ({ item, opacity, onGeoTIFFLoad }) => {
  const [rangeMin, rangeMax] = item.range;
  // Zero probability is transparent; ranges that go
  // negative (differences) only hide nodata, which is NaN or out of range
  // (model runs write -9999).
  const minValue = rangeMin < 0 ? rangeMin - 0.000001 : 0.000001;
  const maxValue = 3.0e38;
  const colormapIndex = Math.max(
    COLORMAP_NAMES.indexOf(item.color || 'default'),
    0
  );

  return new COGLayer({
    id: `cog-${item.url}`,
    geotiff: item.url,
    epsgResolver: resolveEpsg,
    beforeId: RASTER_BEFORE_ID,
    opacity,
    onGeoTIFFLoad,
    getTileData,
    onTileUnload,
    renderTile: (tile) => ({
      renderPipeline: [
        { module: CreateTexture, props: { textureName: tile.texture } },
        { module: FilterRange, props: { minValue, maxValue } },
        {
          module: LinearRescale,
          props: { rescaleMin: rangeMin, rescaleMax: rangeMax },
        },
        {
          module: Colormap,
          props: {
            colormapTexture: tile.colormapTexture,
            colormapIndex,
            reversed: 0,
          },
        },
      ],
    }),
  });
};
