import React, { useRef, useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import { MAP_COLORS, ALL_VIRUS } from '@/config/constants/general';

const FoiVectorLayer = ({ jsonData, distribution, time_frame, virus }) => {
  if (!jsonData) return null;

  const defaultColors = Object.keys(MAP_COLORS)
    .filter((i) => i !== 'default')
    .map((i) => [i, MAP_COLORS[i][2]])
    .flat();

  const createFilter = () => {
    if (!distribution) {
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

  return (
    <Source id='source-foi' type='geojson' data={jsonData}>
      <Layer
        id='layer-foi'
        type='circle'
        paint={{
          'circle-radius': 3,
          'circle-opacity': 0.5,
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
