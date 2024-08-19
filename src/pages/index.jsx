import React, { useRef, useEffect, useState } from 'react';

import StaticMap, { NavigationControl, ScaleControl } from 'react-map-gl';
const API_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const initialViewState = {
  latitude: 14.0583,
  longitude: 108.2772,
  zoom: 7
};

export default function Home() {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({ ...initialViewState });
  const [sourcesData, setSourcesData] = useState(null);
  const [sourcesDataFlag, setSourcesDataFlag] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [osmInfo, setOsmInfo] = useState(null);

  return (
   <main className="relative w-full h-screen bg-white dark:bg-slate-800">
      <div className="w-screen h-screen">
        <StaticMap
          ref={mapRef}
          initialViewState={viewState}
          // onLoad={handleLoad}
          minZoom={6}
          maxZoom={15}
          mapStyle=""
          mapboxAccessToken={API_TOKEN}
        >
          
          <ScaleControl position="top-left" />
          <NavigationControl position="top-left" />
        </StaticMap>
      </div>
    </main>
  );
}
