import React from 'react';
import { Source, Layer } from 'react-map-gl';
import { buildColorLayer } from '@/utils/utils';

const RasterLayer = ({ item, opacity_filter = {}, has_many = true }) => {
  const { tileset_id, species, color } = item;

  let opacity =
    species in opacity_filter ? opacity_filter[species] : has_many ? 50 : 100;
  const rasterColor = buildColorLayer(color);
  return (
    <Source
      key={tileset_id}
      id={`raster-source-${tileset_id}`}
      type='raster'
      url={`mapbox://${tileset_id}`}
      tileSize={256}
      rasterNoData={0}
    >
      <Layer
        id={`raster-layer-${tileset_id}`}
        type='raster'
        source={`raster-source-${tileset_id}`}
        paint={{
          'raster-resampling': 'nearest',
          'raster-fade-duration': 0,
          'raster-opacity': opacity / 100,
          'raster-color': [
            'case',
            ['<=', ['raster-value'], 0.009],
            'rgba(0, 0, 0, 0)',
            [...rasterColor],
          ],
        }}
        beforeId='adm_boundaries_layer'
      />
    </Source>
  );
};

export default RasterLayer;
