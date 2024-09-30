export const PAGE_TITLE = 'arena atlas';
export const PAGE_KEYWORDS = 'arena atlas';
export const PAGE_DESCRIPTION = 'arena atlas';
export const PAGE_AUTHOR = 'Developmentseed & GeoCompas';

// HEADER
export const LINK_HEADER = [
  { text: 'Explore', href: 'explore' },
  { text: 'About', href: 'about' },
  { text: 'Resources', href: 'resources' },
  { text: 'Publications', href: 'publications' },
  {
    text: 'Github',
    href: 'https://github.com/developmentseed/atlasarena',
    isExternal: true,
  },
];

// DATA
export const DATA_EQUIVALENCE = {
  'Guanarito virus': {
    short: 'g',
    spreadsheet: 'Guanarito virus',
    folder_name: 'Guanarito_virus',
  },
  'Junin virus': {
    short: 'j',
    spreadsheet: 'Junin virus',
    folder_name: 'Junin_virus',
  },
  'Machupo virus': {
    short: 'm',
    spreadsheet: 'Machupo virus',
    folder_name: 'Machupo_virus',
  },
  'Zygodontomys brevicauda': {
    short: 'zb',
    spreadsheet: 'Zygodontomys brevicauda',
    folder_name: 'Zygodontomys_brevicauda',
  },
  'Sigmodon alstoni': {
    short: 'sa',
    spreadsheet: 'Sigmodon alstoni',
    folder_name: 'Sigmodon_alstoni',
  },
  'Calomys callosus': {
    short: 'cc',
    spreadsheet: 'Calomys callosus',
    folder_name: 'Calomys_callosus',
  },
  'Calomys musculinus': {
    short: 'cm',
    spreadsheet: 'Calomys musculinus',
    folder_name: 'Calomys_musculinus',
  },
  'Calomys laucha': {
    short: 'cl',
    spreadsheet: 'Calomys laucha',
    folder_name: 'Calomys_laucha',
  },
  'Oligoryzomys flavescens': {
    short: 'of',
    spreadsheet: 'Oligoryzomys flavescens',
    folder_name: 'Oligoryzomys_flavescens',
  },
  'Current (year 1990-2010)': {
    short: 'cu',
    spreadsheet: 'Current (year 1990-2010)',
    folder_name: 'current_1990-2010',
  },
  'SSP 2 (years 2041-2060)': {
    short: 's2',
    spreadsheet: 'SSP 2 (years 2041-2060)',
    folder_name: 'SSP2_2041-2060',
  },
  'SSP 5 (years 2041-2060)': {
    short: 's5',
    spreadsheet: 'SSP 5 (years 2041-2060)',
    folder_name: 'SSP5_2041-2060',
  },
  'Delta SSP 2 - current': {
    short: 'ds2',
    spreadsheet: 'Delta SSP 2 - current',
    folder_name: 'delta_SSP2',
  },
  'Delta SSP 5 - current': {
    short: 'ds5',
    spreadsheet: 'Delta SSP 5 - current',
    folder_name: 'delta_SSP5',
  },
  Combined: {
    short: 'co',
    spreadsheet: 'Combined',
    folder_name: 'combined',
  },
  'Random Forest': {
    short: 'rf',
    spreadsheet: 'Random Forest',
    folder_name: 'rf',
  },
  'Extra Trees': {
    short: 'et',
    spreadsheet: 'Extra Trees',
    folder_name: 'et',
  },
  'Extra Gradient Boost': {
    short: 'xgb',
    spreadsheet: 'Extra Gradient Boost',
    folder_name: 'xgb',
  },
  'Light GBM': {
    short: 'lgbm',
    spreadsheet: 'Light GBM',
    folder_name: 'lgbm',
  },
  'Difference in probabilities.tif': {
    short: 'dp',
    spreadsheet: 'Difference in probabilities.tif',
    folder_name: 'diff_in_probabilities.tif',
  },
  'Probability_presence.tif': {
    short: 'pp',
    spreadsheet: 'Probability_presence.tif',
    folder_name: 'probability_presence.tif',
  },
  'Force of Infection.tif': {
    short: 'foi',
    spreadsheet: 'Force of Infection.tif',
    folder_name: 'force_of_infection.tif',
  },
};

export const MAP_COLORS = {
  default: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#059669'],
  red: ['#FED7D7', '#FC8181', '#E53E3E', '#9B2C2C', '#63171B'],
  orange: ['FEEBC8', '#F6AD55', '#DD6B20', '#9C4221', '#652B19'],
  yellow: ['#FEFCBF', '#F6E05E', '#D69E2E', '#975A16', '#5F370E'],
  green: ['#C6F6D5', '#68D391', '#38A169', '#276749', '#1C4532'],
  teal: ['#B2F5EA', '#4FD1C5', '#319795', '#285E61', '#1D4044'],
  blue: ['#bee3f8', '#63b3ed', '#3182ce', '#2c5282', '#1A365D'],
  cyan: ['#C4F1F9', '#76E4F7', '#00B5D8', '#0987A0', '#065666'],
  purple: ['#E9D8FD', '#B794F4', '#805AD5', '#553C9A', '#322659'],
  pink: ['#FED7E2', '#F687B3', '#D53F8C', '#97266D', '#521B41'],
};
// default values
export const ALL_VIRUS = 'All (combined)';
export const DEFAULT_TIME = 'Current (year 1990-2010)';
export const DEFAULT_MODEL = 'Combined';
