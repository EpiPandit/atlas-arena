import 'maplibre-gl/dist/maplibre-gl.css';

import { Provider } from '@/components/ui/provider';
import Layout from '@/components/layout';
import { AppWrapper } from '@/store/context';
import { AuthProvider } from '@/store/auth';
import Head from 'next/head';
import {
  PAGE_TITLE,
  PAGE_DESCRIPTION,
  PAGE_KEYWORDS,
  PAGE_AUTHOR,
} from '@/config/constants/general';
import { FontCss } from '@/config/fonts';

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <FontCss />
      <Head>
        <title key='title'>{PAGE_TITLE}</title>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='title' content={PAGE_TITLE} />
        <meta name='description' content={PAGE_DESCRIPTION} />
        <meta name='keywords' content={PAGE_KEYWORDS} />
        <meta name='author' content={PAGE_AUTHOR} />
      </Head>
      <AuthProvider>
        <AppWrapper>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppWrapper>
      </AuthProvider>
    </Provider>
  );
}
