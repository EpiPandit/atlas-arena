import React, { useRef, useEffect, useState } from 'react';
import { loadContent } from '@/libs/loadYamlContent';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '@/store/context';

import StaticMap, { NavigationControl, ScaleControl } from 'react-map-gl';
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = process.env.NEXT_PUBLIC_MAPBOX_STYLE;

const initialViewState = {
  latitude: 14.0583,
  longitude: 108.2772,
  zoom: 7,
};

export default function Home({ content }) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({ ...initialViewState });

  const { count } = useAppContext();
  return (
    <div className='w-75 relative h-96 bg-white dark:bg-slate-800'>
      <h1 className='text-white'>
        {content.homepage.title} {count}
      </h1>
      <ReactMarkdown>{content.homepage.body}</ReactMarkdown>
      <div className='h-3/6 w-screen'>
        <StaticMap
          ref={mapRef}
          initialViewState={viewState}
          // onLoad={handleLoad}
          minZoom={6}
          maxZoom={15}
          mapStyle={MAPBOX_STYLE}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        >
          <ScaleControl position='top-left' />
          <NavigationControl position='top-left' />
        </StaticMap>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const content = loadContent('config.yaml');

  return {
    props: {
      content,
    },
  };
}
