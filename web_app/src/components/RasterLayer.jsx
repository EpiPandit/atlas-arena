import React, { useRef, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import { defaultMapColor } from '@/utils/mapStyle';

const RasterLayer = ({ item }) => {
  const { tileset_id } = item;
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
          'raster-opacity': 0.8,
          'raster-color': [...defaultMapColor],
        }}
        beforeId='adm_boundaries_layer'
      />
    </Source>
  );
};

export default RasterLayer;
