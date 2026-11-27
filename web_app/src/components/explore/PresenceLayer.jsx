import { Source, Layer } from 'react-map-gl/maplibre';

// Uploaded presence points. Added without a beforeId, so they draw above the
// COG rasters (inserted before RASTER_BEFORE_ID) and the basemap labels.
const PresenceLayer = ({ data }) => {
  if (!data) return null;

  return (
    <Source id='source-presence' type='geojson' data={data}>
      <Layer
        id='layer-presence'
        type='circle'
        paint={{
          'circle-radius': 4,
          'circle-color': '#2C3F85',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFFFFF',
        }}
      />
    </Source>
  );
};

export default PresenceLayer;
