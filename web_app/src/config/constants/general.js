// PAGE METADATA
export const PAGE_TITLE = 'AtlasArena';
export const PAGE_KEYWORDS = 'AtlasArena';
export const PAGE_DESCRIPTION = 'AtlasArena';
export const PAGE_AUTHOR = 'Developmentseed & GeoCompas';
export const HOME_PAGE_TITLE = `${PAGE_TITLE} | Predicting Arenavirus Risk`;

// Unique, descriptive <title> per route (WCAG 2.4.2)
export const buildPageTitle = (page = '') =>
  page ? `${page} | ${PAGE_TITLE}` : PAGE_TITLE;

// ATLASARENA API (atlasarena-model-infra, the CDK "ApiUrl" output). Must end in
// '/'. The default is the dev stack, which local development and staging use;
// the production build sets the prod stack's URL (.github/workflows/deploy.yaml).
// Set NEXT_PUBLIC_ATLASARENA_API_URL (e.g. in .env.local) to point elsewhere;
// set it to an empty value to hide sign-in.
export const API_URL =
  process.env.NEXT_PUBLIC_ATLASARENA_API_URL ??
  'https://epem44ggt1.execute-api.us-west-2.amazonaws.com/';

// Shared static data (atlasarena-model-infra, the CDK "DataPublicUrl" output):
// one public S3 bucket used by every environment, dev and prod alike. Must end
// in '/'. Set NEXT_PUBLIC_ATLASARENA_DATA_URL to point elsewhere.
export const DATA_URL =
  process.env.NEXT_PUBLIC_ATLASARENA_DATA_URL ??
  'https://atlasarena-data.s3.us-west-2.amazonaws.com/';

// FOI params CSV (species/virus prevalence and K), read by the Run Models tab
// at runtime so it can be updated without a deploy. The same object the API
// falls back to.
export const FOI_PARAMS_URL = `${DATA_URL}data/FOI/FOI_params_processed.csv`;

// Base URL of the explore page's COGs; a catalog layer's `path` is relative
// to it.
export const COGS_URL = `${DATA_URL}cogs/`;

// Public job outputs (atlasarena-model-infra, the CDK "JobsPublicUrl" output):
// a finished job's result.json, rasters and presence points, readable without
// signing in. Must end in '/'. Belongs to the same stack as API_URL: a job
// only resolves against the jobs bucket of the API that ran it. Set
// NEXT_PUBLIC_ATLASARENA_JOBS_URL to point elsewhere.
export const JOBS_URL =
  process.env.NEXT_PUBLIC_ATLASARENA_JOBS_URL ??
  'https://atlasarena-dev-jobs.s3.us-west-2.amazonaws.com/';

// HEADER LINKS
export const LINK_HEADER = [
  { text: 'Home', href: '' },
  { text: 'Explore', href: 'explore' },
  { text: 'About', href: 'about' },
  { text: 'Resources', href: 'resources' },
  { text: 'Methodology', href: 'methodology' },
  {
    text: 'Github',
    href: 'https://github.com/developmentseed/atlasarena',
    isExternal: true,
  },
];
export const MENU_OPEN = 'Open menu';
export const MENU_CLOSE = 'Close menu';
export const SKIP_TO_MAIN = 'Skip to main content';
export const SKIP_TO_MAP = 'Skip to map';

// INFO POPOVERS
export const INFO_BUTTON_LABEL = (name = '') =>
  name ? `More information about ${name}` : 'More information';
export const INFO_POPOVER_LABEL = (name = '') =>
  name ? `About ${name}` : 'More information';
// FOOTER

// ==============
// DATA VALUES
// ==============

// MAP_COLORS
export const MAP_COLORS = {
  default: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#059669'],
  red: ['#FED7D7', '#FC8181', '#E53E3E', '#9B2C2C', '#63171B'],
  orange: ['#FEEBC8', '#F6AD55', '#DD6B20', '#9C4221', '#652B19'],
  yellow: ['#FEFCBF', '#F6E05E', '#D69E2E', '#975A16', '#5F370E'],
  green: ['#C6F6D5', '#68D391', '#38A169', '#276749', '#1C4532'],
  teal: ['#B2F5EA', '#4FD1C5', '#319795', '#285E61', '#1D4044'],
  blue: ['#bee3f8', '#63b3ed', '#3182ce', '#2c5282', '#1A365D'],
  cyan: ['#C4F1F9', '#76E4F7', '#00B5D8', '#0987A0', '#065666'],
  purple: ['#E9D8FD', '#B794F4', '#805AD5', '#553C9A', '#322659'],
  pink: ['#FED7E2', '#F687B3', '#D53F8C', '#97266D', '#521B41'],
};
// Ramps handed out, in order, to layers shown together that have no catalog
// colour or would repeat one (see distinctColors). Neighbours differ in hue.
export const FALLBACK_COLOR_ORDER = [
  'default',
  'orange',
  'purple',
  'pink',
  'teal',
  'red',
  'blue',
  'yellow',
  'cyan',
  'green',
];
// DEFAULT VALUES
export const ALL_VIRUS = 'All (combined)';
export const DEFAULT_TIME = 'Current (year 1990-2010)';
export const DEFAULT_MODEL = 'Combined';

// DEFAULT LEGEND OPACITY
export const DEFAULT_OPACITY_SINGLE = 50;
export const DEFAULT_OPACITY_MULTIPLE = 25;

// LEGEND LABEL
export const DEFAULT_LEGEND_VALUE = ['0', '0.5', '1'];
export const LEGEND_DELTA_VALUE = ['-1', '0', '1'];

// HEIGHT HEADER
// Fallback only: the real height is measured by Header and exposed as the
// --header-h CSS variable. Use HEADER_HEIGHT_CSS in styles.
export const H_HEADER = 65;
export const HEADER_HEIGHT_CSS = `var(--header-h, ${H_HEADER}px)`;

// HEIGHT MOBILE FILTER BAR (Explore)
export const H_FILTER_BAR = 44;

// LEGEND
export const W_LEGEND = 250;

// BASEMAP (OpenFreeMap, no key needed)
export const BASEMAP_STYLE = 'https://tiles.openfreemap.org/styles/positron';

// ZOOM VALUES
export const MIN_ZOOM_MAP = 2;
export const MAX_ZOOM_MAP = 11;
