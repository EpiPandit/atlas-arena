import { Global } from '@emotion/react';

export function FontCss() {
  return (
    <Global
      styles={`
        @font-face {
          font-family: 'Montserrat Variable';
          font-style: normal;
          font-display: swap;
          font-weight: 100 900;
          src: url(https://cdn.jsdelivr.net/fontsource/fonts/montserrat:vf@latest/latin-wght-normal.woff2) format('woff2-variations');
          unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
        }
      `}
    />
  );
}

export default {
  body: `'Montserrat Variable', sans-serif`,
  heading: `'Montserrat Variable', sans-serif`,
};
