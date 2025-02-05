// icons
import VirusIcon from '@/assets/images/virus';
import ClimateIcon from '@/assets/images/climate';
import PatientIcon from '@/assets/images/patient';
// logos
import wellcomeLogo from '@/assets/images/wellcome.png';
import ucdavisLogo from '@/assets/images/expanded_logo_blue.png';
import devseedLogo from '@/assets/images/devseed.png';
import geocompasLogo from '@/assets/images/geocompas.webp';

export const CLIMATE_ICON = ClimateIcon;

export const CLIMATE_TITLE = 'Climate';
export const CLIMATE_TEXT =
  'Changing climate impacts the dynamics of zoonotic dieases spread. The relationship between climate change and disease transmission is complex and driven by changes in ecological, social and behavioral patterns of both humans and animals.';

export const PATIENT_ICON = PatientIcon;
export const PATIENT_TITLE = 'Human Risk';
export const PATIENT_TEXT =
  'Predicting the risk of zoonotic transmission of neglected arenaviruses before they infect humans is a big challenge yet clearly an important objective for pandemic preparedness. ';

export const VIRUS_ICON = VirusIcon;
export const VIRUS_TITLE = 'Virus';
export const VIRUS_TEXT =
  'The outbreaks of several New World arenaviruses in agricultural settings has been shown to be affected by changes in rodent and human populations.';

export const PRESENTED_BY = 'Presented by:';

export const LOGOS = [
  {
    id: 'wellcome',
    href: 'https://wellcome.org/',
    image: wellcomeLogo.src,
    alt: 'Wellcome logo',
    boxSize: { base: '35px', md: '55px' },
    w: {},
  },
  {
    id: 'ucdavis',
    href: 'https://www.ucdavis.edu/',
    image: ucdavisLogo.src,
    alt: 'UC Davis logo',
    boxSize: {},
    w: { base: '130px', md: '175px' },
  },
  {
    id: 'developmentseed',
    href: 'https://developmentseed.org/',
    image: devseedLogo.src,
    alt: 'Development Seed logo',
    boxSize: {},
    w: { base: '150px', md: '235px' },
  },
  {
    id: 'geocompas',
    href: 'https://geocompas.ai/',
    image: geocompasLogo.src,
    alt: 'Geocompas logo',
    boxSize: {},
    w: { base: '150px', md: '230px' },
  },
];
