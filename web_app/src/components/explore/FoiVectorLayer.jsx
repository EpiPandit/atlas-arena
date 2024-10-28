import React, { useRef, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import { MAP_COLORS, ALL_VIRUS } from '@/config/constants/general';

const FoiVectorLayer = ({
  jsonData,
  hotspot,
  time_frame,
  virus,
  opacity_filter = {},
}) => {
  if (!jsonData) return null;

  const defaultColors = Object.keys(MAP_COLORS)
    .filter((i) => i !== 'default')
    .map((i) => [i, MAP_COLORS[i][2]])
    .flat();

  const createFilter = () => {
    if (hotspot) {
      let new_time = (time_frame || []).join('').toLowerCase();
      if (new_time.includes('delta')) {
        new_time = new_time.replace('current');
      }
      if (virus === ALL_VIRUS) {
        return ['in', ['get', 'time_frame'], new_time];
      } else {
        return [
          'all',
          ['in', ['get', 'virus'], virus],
          ['in', ['get', 'time_frame'], new_time],
        ];
      }
    }
    return ['all', false];
  };

  const customOpacity = [
    'match',
    ['get', 'virus'],
    'Guanarito virus',
    (opacity_filter['Guanarito virus'] ?? 100) / 100,
    'Junin virus',
    (opacity_filter['Junin virus'] ?? 100) / 100,
    'Machupo virus',
    (opacity_filter['Machupo virus'] ?? 100) / 100,
    0,
  ];
  return (
    <Source id='source-foi' type='geojson' data={jsonData}>
      <Layer
        id='layer-foi'
        type='circle'
        paint={{
          'circle-radius': 3,
          'circle-opacity': [...customOpacity],
          'circle-color': [
            'match',
            ['get', 'color'],
            ...defaultColors,
            '#CCCCCC', //default
          ],
        }}
        filter={createFilter()}
      />
    </Source>
  );
};

export default FoiVectorLayer;
