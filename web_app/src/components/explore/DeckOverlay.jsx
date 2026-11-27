import { useControl } from 'react-map-gl/maplibre';
import { MapboxOverlay } from '@deck.gl/mapbox';

// Renders deck.gl layers inside MapLibre's own WebGL context, so each layer's
// `beforeId` slots it into the basemap's layer stack.
//
// `_reuseDevices` lets the second Deck from StrictMode's dev-only double mount
// reuse the luma.gl device already attached to MapLibre's context instead of
// throwing "WebGL context already attached to device". Same fix as upstream:
// https://github.com/developmentseed/deck.gl-raster/pull/668
const withOverlayProps = (props) => ({
  ...props,
  interleaved: true,
  deviceProps: { _reuseDevices: true, ...props.deviceProps },
});

const DeckOverlay = (props) => {
  const overlay = useControl(() => new MapboxOverlay(withOverlayProps(props)));
  overlay.setProps(withOverlayProps(props));
  return null;
};

export default DeckOverlay;
