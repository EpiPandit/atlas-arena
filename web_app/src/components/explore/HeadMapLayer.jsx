import React from 'react';
import { Source, Layer } from 'react-map-gl';
import {
  MAP_COLORS,
  ALL_VIRUS,
  MIN_ZOOM_HOTSPOT_HEADMAP,
  MAX_ZOOM_HOTSPOT_HEADMAP,
} from '@/config/constants/general';

const HeadLayer = ({ filter, data, color, virus, opacity_filter }) => {
  if (!data) return null;

  const headMapColor = [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(255, 255, 255, 0)',
    0.001,
    MAP_COLORS[color][0],
    0.25,
    MAP_COLORS[color][1],
    0.5,
    MAP_COLORS[color][2],
    0.75,
    MAP_COLORS[color][3],
    1,
    MAP_COLORS[color][4],
  ];
  let max_opacity = 0.8;
  let min_opacity = 0.2;
  if (opacity_filter && opacity_filter[virus] != null) {
    max_opacity = (opacity_filter[virus] + 0.01) / 100;
    min_opacity = max_opacity * 0.1;
  }

  return (
    <Source id={`${virus}-source-foi`} type='geojson' data={data}>
      <Layer
        id={`${virus}-layer-foi`}
        type='heatmap'
        filter={filter}
        minzoom={MIN_ZOOM_HOTSPOT_HEADMAP}
        maxzoom={MAX_ZOOM_HOTSPOT_HEADMAP}
        beforeId='layer-foi'
        paint={{
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            MIN_ZOOM_HOTSPOT_HEADMAP,
            2,
            MAX_ZOOM_HOTSPOT_HEADMAP,
            1,
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            MIN_ZOOM_HOTSPOT_HEADMAP,
            6,
            MAX_ZOOM_HOTSPOT_HEADMAP,
            2,
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            MIN_ZOOM_HOTSPOT_HEADMAP,
            max_opacity,
            MAX_ZOOM_HOTSPOT_HEADMAP,
            min_opacity,
          ],
          'heatmap-color': [...headMapColor],
        }}
      />
    </Source>
  );
};

const HeadMapLayer = ({
  dataVirusSplit,
  hotspot,
  time_frame,
  virus,
  opacity_filter,
}) => {
  if (!dataVirusSplit || !dataVirusSplit.length) return null;

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

  return (
    <>
      {dataVirusSplit.map((item) => (
        <HeadLayer
          key={item.virus}
          {...item}
          opacity_filter={opacity_filter}
          filter={createFilter()}
        />
      ))}
    </>
  );
};

export default HeadMapLayer;
