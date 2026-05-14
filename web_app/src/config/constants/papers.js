// Featured research papers configuration
export const FEATURED_PAPERS = [
  {
    id: 'kulkarni2026',
    title: 'Climate-driven changes in zoonotic risk of arenaviral hemorrhagic fevers in South America',
    authors: [
      'Kulkarni, Pranav S',
      'Flores-Pérez, Nuri Y',
      'Jian, Andie H',
      'Bird, Brian H',
      'Johnson, Christine K',
      'Uhart, Marcela',
      'Pandit, Pranav S',
    ],
    journal: 'npj Viruses',
    volume: '4',
    issue: '1',
    pages: '23',
    year: 2026,
    publisher: 'Nature Publishing Group UK London',
    url: 'https://www.nature.com/articles/s44298-026-00189-2',
    keywords: ['Climate Change', 'Arenavirus', 'Zoonotic Risk', 'South America', 'Species Distribution Modeling'],
    description:
      'This study examines how climate change impacts the spatial distribution and zoonotic risk of arenaviral hemorrhagic fevers across South America. Using machine learning species distribution models, the research projects changes in virus-host-human interaction zones under different climate scenarios.',
  },
  {
    id: 'flores2025',
    title:
      'Climate Change Impact on Human-Rodent Interfaces: Modeling Junin Virus Reservoir Shifts',
    authors: [
      'Flores-Pérez, Nuri',
      'Kulkarni, Pranav',
      'Uhart, Marcela',
      'Pandit, Pranav S',
    ],
    journal: 'EcoHealth',
    volume: '22',
    issue: '3',
    pages: '332–345',
    year: 2025,
    publisher: 'Springer',
    url: 'https://link.springer.com/article/10.1007/s10393-025-01723-z',
    keywords: ['Junin Virus', 'Reservoir Host', 'Climate Modeling', 'Human-Animal Interface', 'Argentina'],
    description:
      'This research focuses specifically on Junin virus, a causative agent of Argentine hemorrhagic fever. The study models how climate change may shift the geographic range of reservoir rodent populations, potentially altering human exposure risk patterns in affected regions.',
  },
];

// BibTeX citations for easy academic export
export const BIBTEX_CITATIONS = {
  kulkarni2026: `@article{kulkarni2026climate,
  title={Climate-driven changes in zoonotic risk of arenaviral hemorrhagic fevers in South America},
  author={Kulkarni, Pranav S and Flores-P{\\'e}rez, Nuri Y and Jian, Andie H and Bird, Brian H and Johnson, Christine K and Uhart, Marcela and Pandit, Pranav S},
  journal={npj Viruses},
  volume={4},
  number={1},
  pages={23},
  year={2026},
  publisher={Nature Publishing Group UK London}
}`,
  flores2025: `@article{flores2025climate,
  title={Climate Change Impact on Human-Rodent Interfaces: Modeling Junin Virus Reservoir Shifts: N. Flores-P{\\'e}rez et al.},
  author={Flores-P{\\'e}rez, Nuri and Kulkarni, Pranav and Uhart, Marcela and Pandit, Pranav S},
  journal={EcoHealth},
  volume={22},
  number={3},
  pages={332--345},
  year={2025},
  publisher={Springer}
}`,
};

export default FEATURED_PAPERS;
