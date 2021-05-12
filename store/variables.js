export const state = () => ({
  application: {
    title: 'Rhode Island Data Discovery Center',
    subtitle:
      'Explore our collection of present and historical data from the Narragansett Bay.',
    baseURL: 'https://ridatadiscoverycenter.github.io/',
    menu: {
      home: 'Home',
      resources: 'Resources',
      about: 'About',
    },
    titles: {
      highlights: 'Highlights',
      collaborators: 'Collaborators',
    },
  },
  fileFormats: [
    'htmlTable',
    'csv',
    'json',
    'nc',
    'geoJson',
    'mat',
    'xhtml',
    'graph',
    'tsv',
    'html',
    'dataTable',
  ],
  baseUrl: 'https://pricaimcit.services.brown.edu/erddap',
});
