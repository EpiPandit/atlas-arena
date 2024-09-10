import React, { useRef, useEffect, useState } from "react";
import { loadContent } from '@/libs/loadYamlContent';
import ReactMarkdown from 'react-markdown';

import StaticMap, { NavigationControl, ScaleControl } from "react-map-gl";
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const initialViewState = {
  latitude: 14.0583,
  longitude: 108.2772,
  zoom: 7,
};

export default function Home({ content }) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({ ...initialViewState });
  const [sourcesData, setSourcesData] = useState(null);
  const [sourcesDataFlag, setSourcesDataFlag] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [osmInfo, setOsmInfo] = useState(null);
  console.log(content)
  return (
    <main className="relative h-screen bg-white w-75 dark:bg-slate-800">
           <h1>{content.homepage.title}</h1>
           <ReactMarkdown>{content.homepage.body}</ReactMarkdown>
      <div className="w-screen h-screen">
        <StaticMap
          ref={mapRef}
          initialViewState={viewState}
          // onLoad={handleLoad}
          minZoom={6}
          maxZoom={15}
          mapStyle=""
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        >
          <ScaleControl position="top-left" />
          <NavigationControl position="top-left" />
        </StaticMap>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const content = loadContent("content.yaml");
  return {
    props: {
      content,
    },
  };
}
