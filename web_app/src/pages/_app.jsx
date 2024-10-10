import '@/assets/css/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@fontsource-variable/montserrat';
import '@fontsource-variable/eb-garamond/wght-italic.css';

import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/config/theme';
import Layout from '@/components/Layout';
import { AppWrapper } from '@/store/context';
import Head from 'next/head';
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  PAGE_KEYWORDS,
  PAGE_AUTHOR,
} from '@/config/constants/general';

export default function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='title' content={PAGE_TITLE} />
        <meta name='description' content={PAGE_DESCRIPTION} />
        <meta name='keywords' content={PAGE_KEYWORDS} />
        <meta name='author' content={PAGE_AUTHOR} />
      </Head>
      <AppWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppWrapper>
    </ChakraProvider>
  );
}
