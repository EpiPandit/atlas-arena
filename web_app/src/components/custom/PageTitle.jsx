import Head from 'next/head';

// Overrides the default <title> set in _app (both share key='title').
const PageTitle = ({ title }) => {
  return (
    <Head>
      <title key='title'>{title}</title>
    </Head>
  );
};

export default PageTitle;
